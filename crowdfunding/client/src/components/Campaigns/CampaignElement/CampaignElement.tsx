import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom'; // Hook для навігації між сторінками

import { ProgressBar } from '../../ProgressBar/ProgressBar'; // Компонент для відображення прогресу збору коштів
import { convertSecondsToDays } from '../../../utils/utils'; // Функція для конвертації секунд у дні
import { DonateButton } from '../../DonateButton/DonateButton'; // Кнопка для внесення внеску
import './campaignElement.scss'; // Стилі для компонента

// Опис пропсів для компонента
interface CampaignElementProps {
    id: number;
    title: string;
    description: string;
    goal: number;
    alreadyDonated: number;
    claimed: boolean;
    endsAt: number;
    donate: () => any;
}

// Головний компонент
export const CampaignElement: FC<CampaignElementProps> = ({
  id,
  title,
  description,
  goal,
  claimed,
  alreadyDonated,
  endsAt,
  donate,
}) => {
  const navigate = useNavigate(); // Використовуємо Hook для навігації

  // Функція для переходу на сторінку кампанії
  const navigateToCampaignPage = () => navigate(`/campaign/${id}`);

  // Рендеримо компонент
  return (
    <div
      onClick={navigateToCampaignPage} // При кліку на компонент переходимо на сторінку кампанії
      className="campaigns-element-item"
    >
      <div className="campaigns-element-item-image" />
      <div className="campaigns-element-item-content">
        <div className="campaigns-element-item-content-text">
          <h2 className="campaigns-element-item-content-text-title">{title}</h2>
          <p className="campaigns-element-item-content-text-description">{description}</p>
        </div>
        <div className="campaigns-element-item-content-details">
          <div className="campaigns-element-item-content-details-goal">
            <h3 className="font-bold">{`Ціль: ${goal} ETH`}</h3>
            <ProgressBar
              goal={goal}
              alreadyDonated={+alreadyDonated.toFixed(3)}
            />
          </div>
          <p className="campaigns-element-item-content-details-endsAt">{`${convertSecondsToDays(+endsAt)} днів залишолось`}</p>
        </div>
      </div>
      {claimed
        ? <div>Кампанію вже завершено. Кошти переведені на гаманець організатора.</div>
        : <DonateButton id={id} donate={donate} />}
    </div>
  );
};
