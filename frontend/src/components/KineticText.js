import React from 'react';

const KineticText = ({ children, variant, className }) => {
  // Basic implementation of KineticText
  return (
    <span className={`${className} ${variant}`}>
      {children}
    </span>
  );
};

export default KineticText;
