import React, { FC } from 'react';
import './progressBar.scss';

interface ProgressBarProps {
    goal: number;
    alreadyDonated: number;
}

export const ProgressBar: FC<ProgressBarProps> = ({ goal, alreadyDonated }) => {
  const progressPercentage = ((alreadyDonated / goal) * 100) > 100
    ? 100
    : (alreadyDonated / goal) * 100;

  return (
    <div className="progress-bar-container">
      <div
        style={{ width: `${progressPercentage}%` }}
        className="progress-bar-container-filler"
      />
      <span className="progress-bar-container-label">{`${alreadyDonated} з ${goal}`}</span>
    </div>
  );
};
