import { FC } from 'react';
import { Link } from 'react-router-dom';

import useEth from '../../contexts/EthContext/useEth';
import './header.scss';

export const Header: FC = () => {
  const { state, connectWallet } = useEth();

  return (
    <div className="header">
      <Link to="/">
        <div className="header-logo">
          <p className="header-logo-text">
            StudyChain
          </p>
        </div>
      </Link>

      <nav className="header-navbar">
        <Link to="/" className="header-navbar-item">Головна</Link>
        <Link to="/create-campaign" className="header-navbar-item">Создати кампанію</Link>
        <Link to="/my-campaigns" className="header-navbar-item">Мої кампанії</Link>
        <Link to="/about" className="header-navbar-item">Про проект</Link>
      </nav>

      <div className="header-authorization">
        {state.isMetamaskInstalled
          ? state.userAccount
            ? (
              <p className="header-authorization-account-address">{state.userAccount}</p>
            )
            : (<button onClick={connectWallet} className="header-authorization-sign-up button" type="submit">Підключити гаманець</button>)
          : (
            <a href="https://metamask.io/download/" target="_blank" rel="noreferrer">
              <button type="button">Встановіть metamask у додатках вашого браузеру, щоб взаэмодіяти с платформою.</button>
            </a>
          )}

      </div>
    </div>
  );
};
