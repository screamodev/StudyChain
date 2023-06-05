import React, { FC } from 'react';
import useEth from '../../contexts/EthContext/useEth';
import { actions } from '../../contexts/EthContext';
import '../DonateButton/donateButton.scss';

interface ClaimButtonProps {
    id: number;
    claim: () => any;
    disabled: boolean;
}

export const ClaimButton: FC<ClaimButtonProps> = ({
  id,
  claim,
  disabled,
}) => {
  const {
    state: {
      userAccount,
    }, dispatch,
  } = useEth();

  const handleClaimFunds = async () => {
    await claim().send({ from: userAccount })
      .then(() => {
        dispatch({
          type: actions.claimFunds,
          data: { id, claimed: true },
        });
      });
  };

  return (
    <button
      className={disabled ? 'donate-button-disabled' : 'claim-button'}
      onClick={handleClaimFunds}
      type="button"
      disabled={disabled}
    >
      Забрати кошти.
    </button>

  );
};
