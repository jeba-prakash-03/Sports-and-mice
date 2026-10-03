import React from 'react';
import { countWords } from '../utils/adminValidation';

/** Live "12 / 30 words" counter, used next to text inputs with a word-count limit. Turns red past the limit. */
const WordCounter = ({ value, max }) => {
  const count = countWords(value);
  const overLimit = count > max;

  return (
    <span className={`cms-char-counter ${overLimit ? 'over-limit' : ''}`}>
      {count} / {max} words
    </span>
  );
};

export default WordCounter;
