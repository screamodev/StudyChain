import { FC } from 'react';

import useEth from '../../contexts/EthContext/useEth';
import { Campaign } from '../../interfaces/interface';
import { CampaignElement } from './CampaignElement/CampaignElement';
import './campaigns.scss';

export const UserCampaigns: FC = () => {
  const { state: { campaigns, isLoading, userAccount } } = useEth();

  const filteredCampaigns = campaigns
    .filter((campaign: Campaign) => campaign.organizer === userAccount);

  return (
    <>
      {userAccount
        ? !isLoading
          ? !filteredCampaigns.length
            ? (<span>You don&#39;t have any campaigns.</span>)
            : (
              <div className="campaigns-container">
                {filteredCampaigns.map(({
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
          : (<span>Загрузка...</span>)
        : (<span>Вам треба увійти за допомогою гаманця metamask.</span>)}
    </>
  );
};
