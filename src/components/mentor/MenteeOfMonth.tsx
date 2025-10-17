import React from 'react';
import '../../styles/components/mentor/MenteeOfMonth.scss';

interface Mentee {
  id: number;
  name: string;
  img: string;
}

interface MenteeOfMonthProps {
  mentees: Mentee[];
}

const MenteeOfMonth: React.FC<MenteeOfMonthProps> = ({ mentees }) => {
  return (
    <div className="mentee-of-month">
      <h3 className="mentee-of-month__title">Mentees of the Month</h3>
      <p className="mentee-of-month__subtitle">Top performing students this month</p>
      <div className="mentee-of-month__grid">
        {mentees.map((mentee, index) => (
          <div key={mentee.id} className="mentee-of-month__item">
            <div className="mentee-of-month__avatar">
              <img src={mentee.img} alt={mentee.name} />
            </div>
            <div className="mentee-of-month__rank">{(index + 1) === 1 ? '1st' : (index + 1) === 2 ? '2nd' : '3rd'}</div>
            <div className="mentee-of-month__name">{mentee.name}</div>
            <div className="mentee-of-month__percent">{index === 0 ? '98% completion' : index === 1 ? '95% completion' : '92% completion'}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenteeOfMonth;