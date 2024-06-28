import React, { useState, useEffect } from 'react';
import * as qna from '@tensorflow-models/qna';
import '@tensorflow/tfjs-backend-webgl'; // Use WebGL backend for potential performance boost
import { largeText } from '../data'; // Import largeText data from your source

function QNS2() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [highlightedText, setHighlightedText] = useState(largeText);

  // Effect to load the model on component mount
  useEffect(() => {
    async function loadModel() {
      setLoading(true);
      try {
        await qna.load(); // Load the Q&A model
      } catch (error) {
        console.error('Error loading Q&A model:', error);
        // Handle error loading the model (e.g., show error message)
      } finally {
        setLoading(false);
      }
    }

    loadModel();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const model = await qna.load(); // Ensure model is loaded (may already be loaded from useEffect)
      const answers = await model.findAnswers(question, largeText, { maxAnswers: 3 });

      if (answers.length > 0) {
        const answerText = answers.map(answer => answer.text).join('. ');
        const highlighted = largeText.replace(new RegExp(escapeRegExp(answerText), 'gi'), `<mark>${answerText}</mark>`);

        setHighlightedText(highlighted);
        setAnswer(answers[0]); // Display the first answer for simplicity
      } else {
        setAnswer(null);
        setHighlightedText(largeText);
      }
    } catch (error) {
      console.error('Error finding answers:', error);
      // Handle error finding answers (e.g., show error message)
    }

    setLoading(false);
  };

  // Function to escape special characters in a string for use in regular expressions
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escapes . * + ? ^ $ { } ( ) | [ ] \ characters
  }

  return (
    <div className="App">
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question..."
        />
        <button type="submit">Submit</button>
      </form>
      {loading && <p>Loading...</p>}
      {answer && (
        <div>
          <h2>Answer</h2>
          <p>{answer.text}</p>
        </div>
      )}
      <div dangerouslySetInnerHTML={{ __html: highlightedText }} />
    </div>
  );
}

export default QNS2;
