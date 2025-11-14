import { Question, Answer } from '../types';

const escapeXml = (unsafe: string): string => {
    if (!unsafe) return '';
    return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            default: return c;
        }
    });
};

/**
 * A heuristic to determine if a line of text is likely the start of a new question.
 * @param line The line of text to analyze.
 * @param hasAnswersInCurrentQuestion Whether the question being built already has answers.
 * @returns True if the line is likely a new question.
 */
const isLikelyNewQuestion = (line: string, hasAnswersInCurrentQuestion: boolean): boolean => {
    if (!hasAnswersInCurrentQuestion) {
        // If the current question has no answers yet, this line can't be a *new* question.
        // It must be part of the current question's text.
        return false;
    }
    // Common English question starters.
    const questionStarters = /^(what|who|when|where|why|how|which|is|are|do|does|did|can|could|would|should|name the|describe|explain)/i;
    if (questionStarters.test(line)) {
        return true;
    }
    // Ends with a question mark.
    if (line.trim().endsWith('?')) {
        return true;
    }
    return false;
};

const parseAndPrepareQuestions = (text: string): Question[] => {
    const questions: Question[] = [];
    let currentQuestion: Question | null = null;
    let lastAnswer: Answer | null = null;

    const finalizeCurrentQuestion = () => {
        if (currentQuestion && currentQuestion.answers.some(a => a.isCorrect)) {
            questions.push(currentQuestion);
        }
        currentQuestion = null;
        lastAnswer = null;
    };

    const lines = text.trim().split('\n');

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        const answerMatch = trimmedLine.match(/^(Correct|Incorrect):\s*(.*)$/i);

        if (answerMatch) {
            if (!currentQuestion) continue; // Ignore answers without a preceding question.
            
            const isCorrect = answerMatch[1].toLowerCase() === 'correct';
            const answerText = escapeXml(answerMatch[2]);
            const newAnswer: Answer = { id: uuid.v4(), text: answerText, isCorrect, feedback: '' };
            currentQuestion.answers.push(newAnswer);
            lastAnswer = newAnswer;

        } else {
            // This line is not an answer. It's either a new question, more question text, or feedback.
            const hasAnswers = (currentQuestion?.answers.length ?? 0) > 0;
            if (isLikelyNewQuestion(trimmedLine, hasAnswers)) {
                // Heuristic suggests this is a new question.
                finalizeCurrentQuestion();
                const questionText = escapeXml(trimmedLine);
                currentQuestion = { id: uuid.v4(), title: questionText.substring(0, 80), text: questionText, answers: [] };
                lastAnswer = null;
            } else if (lastAnswer && !lastAnswer.isCorrect) {
                // This line follows an incorrect answer and doesn't look like a new question, so it's feedback.
                lastAnswer.feedback = (lastAnswer.feedback ? lastAnswer.feedback + '\n' : '') + escapeXml(trimmedLine);
            } else {
                // This is question text (either for a new question or a multi-line existing one).
                if (currentQuestion) {
                    currentQuestion.text += '\n' + escapeXml(trimmedLine);
                } else {
                    const questionText = escapeXml(trimmedLine);
                    currentQuestion = { id: uuid.v4(), title: questionText.substring(0, 80), text: questionText, answers: [] };
                }
            }
        }
    }

    finalizeCurrentQuestion();

    if (questions.length === 0 && text.trim().length > 0) {
        throw new Error("No valid questions could be parsed. Please check the formatting instructions for supported formats.");
    }
    return questions;
};


const createQtiBankXML_v1_2 = (questions: Question[], bankTitle: string, bankId: string): string => {
    const itemsXML = questions.map((question, index) => {
        const answerLabels = question.answers.map(answer => `
            <response_label ident="${answer.id}">
                <material>
                    <mattext texttype="text/plain">${answer.text}</mattext>
                </material>
            </response_label>`).join('');

        const responseConditions = question.answers.map(answer => {
            if (answer.isCorrect) {
                return `
        <respcondition continue="No" title="Correct">
            <conditionvar>
                <varequal respident="response_1">${answer.id}</varequal>
            </conditionvar>
            <setvar action="Set" varname="SCORE">100</setvar>
        </respcondition>`;
            } else if (answer.feedback) {
                return `
        <respcondition continue="Yes" title="Incorrect">
            <conditionvar>
                <varequal respident="response_1">${answer.id}</varequal>
            </conditionvar>
            <displayfeedback feedbacktype="Response" linkrefid="${answer.id}_fb"/>
        </respcondition>`;
            }
            return '';
        }).join('');

        const itemFeedbacks = question.answers
            .filter(a => a.feedback)
            .map(a => `
    <itemfeedback ident="${a.id}_fb">
        <flow_mat>
            <material>
                <mattext texttype="text/plain">${escapeXml(a.feedback)}</mattext>
            </material>
        </flow_mat>
    </itemfeedback>`).join('');
        
        return `
    <item ident="${question.id}" title="Question ${index + 1}">
        <presentation>
            <material>
                <mattext texttype="text/html">${question.text}</mattext>
            </material>
            <response_lid ident="response_1" rcardinality="Single">
                <render_choice>
                    ${answerLabels}
                </render_choice>
            </response_lid>
        </presentation>
        <resprocessing>
            <outcomes>
                <decvar maxvalue="100" minvalue="0" varname="SCORE" vartype="Decimal"/>
            </outcomes>
            ${responseConditions}
        </resprocessing>
        ${itemFeedbacks}
    </item>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<questestinterop xmlns="http://www.imsglobal.org/xsd/ims_qtiasiv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/ims_qtiasiv1p2 http://www.imsglobal.org/xsd/ims_qtiasiv1p2.xsd">
    ${itemsXML}
</questestinterop>`;
};

const createManifestXML_v1_2 = (bankTitle: string, bankId: string, qtiFileName: string): string => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="MANIFEST-${bankId}" xmlns="http://www.imsglobal.org/xsd/imscp_v1p1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/imscp_v1p1 http://www.imsglobal.org/xsd/imscp_v1p1.xsd http://www.imsglobal.org/xsd/ims_qtiasiv1p2 http://www.imsglobal.org/xsd/ims_qtiasiv1p2.xsd">
    <metadata>
        <schema>IMS Content</schema>
        <schemaversion>1.1.3</schemaversion>
    </metadata>
    <organizations/>
    <resources>
        <resource identifier="${bankId}" type="imsqti_questionbank_xmlv1p2">
            <file href="${qtiFileName}"/>
        </resource>
    </resources>
</manifest>`;
};

export const generateQtiZip = async (text: string, bankTitle: string): Promise<void> => {
    const questions = parseAndPrepareQuestions(text);
    if (questions.length === 0) {
        throw new Error("No valid questions could be parsed from the text.");
    }

    const zip = new JSZip();
    const bankId = `qti_bank_${uuid.v4()}`;
    const qtiFileName = `${bankId}.xml`;

    const qtiBankXmlContent = createQtiBankXML_v1_2(questions, bankTitle, bankId);
    zip.file(qtiFileName, qtiBankXmlContent);

    const manifestContent = createManifestXML_v1_2(bankTitle, bankId, qtiFileName);
    zip.file('imsmanifest.xml', manifestContent);

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const safeFilename = bankTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'question_bank';
    saveAs(zipBlob, `${safeFilename}.zip`);
};