import '../App.css';
import React, { useState } from 'react';
import * as qna from '@tensorflow-models/qna';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import { largeText } from '../data';
import Spinner from 'react-bootstrap/Spinner';

function QNS1() {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [highlightedText, setHighlightedText] = useState(largeText);

    const handleInputChange = (event) => {
        setQuestion(event.target.value);
    };

    const handleSubmit = async (event) => {
        if (question.trim() === '') {
            return;
        }
        event.preventDefault();
        setLoading(true);

        const model = await qna.load();
        const answers = await model.findAnswers(question, largeText);

        if (answers.length > 0) {
            const answerText = answers[0].text;
            const highlightedText = largeText.replace(answerText, `<mark>${answerText}</mark>`);
            setHighlightedText(highlightedText);
            setAnswer(answers[0]);
        } else {
            setAnswer(null);
            setHighlightedText(largeText);
        }
        setLoading(false);
    }






    return (
        <>
            <div className="App">

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={question}
                        onChange={handleInputChange}
                        placeholder='Ask a question...'
                    />
                    <button type='submit' className='button'>Submit</button>
                </form>
                {loading &&
                    <Spinner style={{ width: '50px', height: '50px' }} animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>}
                <div className='answerr'>

                    {answer && (
                        <div>
                            <h2>Answer</h2>
                            <p className='mark'>{answer.text}</p>
                        </div>
                    )}
                </div>
                <div className='largeText'>
                    <div dangerouslySetInnerHTML={{ __html: highlightedText }} />
                </div>
            </div>
        </>
    );
}

export default QNS1;
