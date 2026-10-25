import React, { useState, useEffect, useRef, useCallback } from 'react';

const CYBER_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*<>[]';

/**
 * TextScramble Component
 * Implements subtle, ultra-clean cyber text scramble/split effect
 * Perfect for high-tech hero titles and subheadings
 */
export default function TextScramble({
  text,
  as: Component = 'span',
  className = '',
  triggerOnHover = true,
  scrambleSpeed = 30,
  revealDelay = 2,
  onComplete = null,
  children
}) {
  const targetText = text || (typeof children === 'string' ? children : '');
  const [displayText, setDisplayText] = useState(targetText);
  const [isScrambling, setIsScrambling] = useState(false);
  const frameRef = useRef(null);

  const startScramble = useCallback(() => {
    if (!targetText) return;
    
    let iteration = 0;
    const maxIterations = targetText.length * revealDelay;
    
    cancelAnimationFrame(frameRef.current);
    setIsScrambling(true);

    const update = () => {
      setDisplayText(
        targetText
          .split('')
          .map((char, index) => {
            // Keep spaces intact
            if (char === ' ') return ' ';
            
            // Once iteration surpasses the character threshold, lock the true character
            if (index * revealDelay < iteration) {
              return targetText[index];
            }
            
            // Otherwise show a random high-tech cyber glyph
            return CYBER_CHARS[Math.floor(Math.random() * CYBER_CHARS.length)];
          })
          .join('')
      );

      if (iteration < maxIterations) {
        iteration += 1;
        frameRef.current = requestAnimationFrame(() => {
          setTimeout(update, scrambleSpeed);
        });
      } else {
        setDisplayText(targetText);
        setIsScrambling(false);
        if (onComplete) onComplete();
      }
    };

    update();
  }, [targetText, scrambleSpeed, revealDelay, onComplete]);

  useEffect(() => {
    startScramble();
    return () => cancelAnimationFrame(frameRef.current);
  }, [startScramble]);

  const handleMouseEnter = () => {
    if (triggerOnHover && !isScrambling) {
      startScramble();
    }
  };

  return (
    <Component
      className={`inline-block select-none ${className}`}
      onMouseEnter={handleMouseEnter}
      aria-label={targetText}
    >
      {displayText}
    </Component>
  );
}

