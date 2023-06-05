import { FC } from 'react';

// Використовуємо наш Ethereum провайдер
import useEth from '../../contexts/EthContext/useEth';
// Інтерфейс для опису структури кампанії
import { Campaign } from '../../interfaces/interface';
// Компонент, що відображає окрему кампанію
import { CampaignElement } from './CampaignElement/CampaignElement';
// Стилі для даного компонента
import './campaigns.scss';

// Головний компонент
export const Campaigns: FC = () => {
  // Отримуємо стан Ethereum провайдеру
  const { state: { campaigns, isLoading, userAccount } } = useEth();

  // Рендеримо компонент
  return (
    <>
      {/* Якщо користувач залогінений */}
      {userAccount
        ? !isLoading
          ? !campaigns.length
            ? (<span>Кампаній на данний час не існує.</span>) // Якщо кампаній немає
            : (
              <div className="campaigns-container">
                {/* Рендеримо список кампаній */}
                {campaigns.map(({
                  id,
                  title,
                  description,
                  goal,
                  alreadyDonated,
                  claimed,
                  endsAt,
                  donate,
                }: Campaign) => (
                  <CampaignElement
                    id={id}
                    key={id}
                    title={title}
                    description={description}
                    goal={goal}
                    alreadyDonated={alreadyDonated}
                    claimed={claimed}
                    endsAt={endsAt}
                    donate={donate}
                  />
                ))}
              </div>
            )
          : (<span>Загрузка...</span>) // Якщо дані ще завантажуються
        : (<span>Вам треба увійти за допомогою гаманця metamask.</span>)}
      {' '}
      {/* Якщо користувач не залогінений */}
    </>
  );
};
