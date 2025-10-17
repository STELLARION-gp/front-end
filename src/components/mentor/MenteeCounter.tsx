import React from 'react';
import Button from '../Button';
import '../../styles/components/mentor/MenteeCounter.scss';

interface MenteeCounterProps {
  maxMentees: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

const MenteeCounter: React.FC<MenteeCounterProps> = ({
  maxMentees,
  onIncrease,
  onDecrease
}) => {
  return (
    <div className="mentee-counter">
      <div className="mentee-counter__content">
        <h4 className="mentee-counter__title">Maximum Mentees</h4>
        <p className="mentee-counter__description">
          Set the maximum number of mentees you can handle
        </p>
      </div>
      <div className="mentee-counter__controls">
        <Button 
          className="mentee-counter__btn mentee-counter__btn--decrease" 
          onClick={onDecrease}
          disabled={maxMentees <= 1}
        >
          -
        </Button>
        <span className="mentee-counter__value">{maxMentees}</span>
        <Button 
          className="mentee-counter__btn mentee-counter__btn--increase" 
          onClick={onIncrease}
        >
          +
        </Button>
      </div>
    </div>
  );
};

export default MenteeCounter;