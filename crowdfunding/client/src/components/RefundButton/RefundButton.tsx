import React, { FC, useState } from 'react';
import useEth from '../../contexts/EthContext/useEth';
import { actions } from '../../contexts/EthContext';
import '../DonateButton/donateButton.scss';

interface RefundButtonProps {
    id: number;
    refundDonation: (value: number) => any;
    disabled: boolean;
}

export const RefundButton: FC<RefundButtonProps> = ({
  id,
  refundDonation,
  disabled,
}) => {
  const {
    state: {
      web3,
      userAccount,
    }, dispatch,
  } = useEth();

  const [refundAmount, setRefundAmount] = useState('');
  const [isRefundClicked, setIsRefundClicked] = useState(false);

  const handleChangeRefund = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRefundAmount(e.target.value);
  };

  const handleClickRefund = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsRefundClicked(true);
  };

  const handleSendDonation = async (value: number) => {
    await refundDonation(web3.utils.toWei(`${value}`, 'ether')).send({ from: userAccount })
      .then(({ events: { RefundedAmount: { returnValues } } }: any) => {
        const refundedAmount = +web3.utils.fromWei(returnValues[0], 'ether');
        console.log(refundedAmount);
        dispatch({
          type: actions.refundFunds,
          data: { id, currentUserDonations: refundedAmount },
        });
      });
  };

  return (
    <>
      {!isRefundClicked ? (
        <button
          className={disabled ? 'donate-button-disabled' : 'donate-button'}
          onClick={handleClickRefund}
          type="button"
          disabled={disabled}
        >
          Refund money
        </button>
      ) : (
        <div className="donate-funds">
          <input
            placeholder="Enter ETH amount"
            className="donate-funds-input"
            type="number"
            onChange={handleChangeRefund}
            value={refundAmount}
          />
          <button
            onClick={() => handleSendDonation(+refundAmount)}
            className="donate-funds-button"
            type="button"
          >
            Refund
          </button>
        </div>
      )}
    </>
  );
};
