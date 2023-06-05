import React, { FC, useState } from 'react';
import useEth from '../../contexts/EthContext/useEth';
import { actions } from '../../contexts/EthContext';
import './donateButton.scss';

interface DonateButtonProps {
    id: number;
    donate: () => any;
}

export const DonateButton: FC<DonateButtonProps> = ({
  id,
  donate,
}) => {
  const {
    state: {
      web3,
      userAccount,
    }, dispatch,
  } = useEth();

  const [donationAmount, setDonationAmount] = useState('');
  const [isDonateClicked, setIsDonateClicked] = useState(false);

  const handleChangeDonate = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setDonationAmount(e.target.value);
  };

  const handleClickDonate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsDonateClicked(true);
  };

  const handleSendDonation = async (value: number) => {
    const valueInWei = web3.utils.toWei(`${value}`, 'ether');

    await donate().send({ from: userAccount, value: valueInWei })
      .then(async ({ events: { Donated: { returnValues: { amount } } } }: any) => {
        const donatedAmount = +web3.utils.fromWei(amount, 'ether');
        const fixedAmount = +donatedAmount.toFixed(3);

        dispatch({
          type: actions.donateFunds,
          data: { id, donatedAmount: fixedAmount },
        });
      });
  };

  return (
    <>
      {!isDonateClicked ? (
        <button
          className="donate-button"
          onClick={handleClickDonate}
          type="button"
        >
          Пожертвувати
        </button>
      ) : (
        <div className="donate-funds">
          <input
            placeholder="Введіть кількість ETH"
            className="donate-funds-input"
            type="number"
            onClick={(e) => e.stopPropagation()}
            onChange={handleChangeDonate}
            value={donationAmount}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              return handleSendDonation(+donationAmount);
            }}
            className="donate-funds-button"
            type="button"
          >
            Відправити
          </button>
        </div>
      )}
    </>
  );
};
