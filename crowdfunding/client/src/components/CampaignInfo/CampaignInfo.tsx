import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useEth from '../../contexts/EthContext/useEth';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import { DonateButton } from '../DonateButton/DonateButton';
import { Campaign } from '../../interfaces/interface';
import { convertSecondsToDays } from '../../utils/utils';
import { RefundButton } from '../RefundButton/RefundButton';
import { ClaimButton } from '../ClaimButton/ClaimButton';
import './campaignInfo.scss';

const initialCampaign = {
  id: 0,
  title: '',
  description: '',
  goal: 0,
  alreadyDonated: 0,
  endsAt: 0,
  organizer: '',
  claimed: false,
  currentUserDonations: 0,
  donate: () => ({}),
  refundDonation: () => ({}),
  claim: () => ({}),
};

export const CampaignInfo: FC = () => {
  const { state: { campaigns, userAccount } } = useEth();

  const { id: campaignId } = useParams();

  const [currentCampaign, setCurrentCampaign] = useState<Campaign>(initialCampaign);

  const {
    id,
    title,
    description,
    goal,
    alreadyDonated,
    endsAt,
    organizer,
    claimed,
    currentUserDonations,
    donate,
    refundDonation,
    claim,
  } = currentCampaign;

  const fetchCampaigns = () => {
    const foundedCampaign = campaigns
      .filter((campaign: Campaign) => campaign.id === Number(campaignId));
    if (foundedCampaign.length) {
      setCurrentCampaign(foundedCampaign[0]);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [campaigns]);

  return (
    <>
      {currentCampaign ? (
        <div className="campaign-info-container">
          <div className="campaign-info-container-content">
            <div className="campaign-info-container-content-title">
              <h1>{title}</h1>
            </div>
            <div className="campaign-info-container-content-info">
              <div className="campaign-info-container-content-info-image">Image</div>
              <div className="campaign-info-container-content-info-details">
                <ProgressBar
                  goal={goal}
                  alreadyDonated={alreadyDonated}
                />
                <div className="campaign-info-container-content-info-details-amount">
                  {`${alreadyDonated} ETH donated of ${goal} ETH goal`}
                </div>
                <div>
                  <b>
                    Ви перерахували
                    {' '}
                    {currentUserDonations}
                    {' '}
                    ETH.
                  </b>
                </div>
                <div className="campaign-info-container-content-info-details-days">
                  {`${convertSecondsToDays(endsAt)} days to go`}
                </div>
                {claimed
                  ? <div>Кампанію вже завершено. Кошти були переведені на гаманець організатора.</div>
                  : (
                    <div className="campaign-info-container-content-info-details-buttons">
                      <DonateButton
                        id={id}
                        donate={donate}
                      />
                      <hr />
                      <RefundButton
                        id={id}
                        refundDonation={refundDonation}
                        disabled={!currentUserDonations}
                      />
                    </div>
                  )}
              </div>
              <div className="campaign-info-container-content-info-description">
                {description}
              </div>
              <div className="campaign-info-container-content-info-claim">
                {userAccount === organizer && !claimed
                    && (
                    <ClaimButton
                      id={id}
                      claim={claim}
                      disabled={alreadyDonated < goal}
                    />
                    )}
              </div>
            </div>
          </div>
        </div>
      ) : <div>Loading...</div> }
    </>
  );
};
