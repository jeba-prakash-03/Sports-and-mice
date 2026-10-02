import React from 'react';

/** Live "12/30" character counter, used next to text inputs with a hard limit. Turns red past the limit. */
const CharCounter = ({ value, max }) => {
  const length = (value || '').length;
  const overLimit = length > max;

  return (
    <span className={`cms-char-counter ${overLimit ? 'over-limit' : ''}`}>
      {length}/{max}
    </span>
  );
};

export default CharCounter;
