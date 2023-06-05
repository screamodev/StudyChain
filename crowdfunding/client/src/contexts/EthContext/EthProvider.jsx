import React, {
  useReducer, useCallback, useEffect,
} from 'react';
import Web3 from 'web3';

import EthContext from './EthContext'; // Контекст, який ми будемо використовувати для передачі даних про Ethereum
import { reducer, actions, initialState } from './state'; // Наш ред'юсер та відповідні дії
import {
  filterCampaignInstance,
  getCampaignsAddresses,
} from './helpers/helpers'; // Допоміжні функції

// Наши контракти для взаємодії з Ethereum
const CrowdfundingPlatform = require('../../contracts/CrowdfundingPlatform.json');
const CampaignContract = require('../../contracts/Campaign.json');

// Наш Ethereum провайдер
function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState); // Використовуємо useReducer для управління станом

  const init = useCallback(async () => { // Ініціалізація Ethereum
    if (CrowdfundingPlatform && CampaignContract) {
      // Створюємо новий екземпляр Web3
      const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');

      const accounts = await web3.eth.requestAccounts(); // Запитуємо доступ до облікових записів
      const networkID = await web3.eth.net.getId(); // Отримуємо ID мережі

      // Витягуємо abi наших контрактів
      const { abi } = CrowdfundingPlatform;
      const { abi: campaignAbi } = CampaignContract;

      // Отримуємо адресу нашої CrowdfundingPlatform в мережі
      const { address } = CrowdfundingPlatform.networks[networkID];

      // Створюємо екземпляр контракту CrowdfundingPlatform
      const crowdfundingPlatformInstance = new web3.eth.Contract(abi, address);

      // Зчитуємо кількість кампаній за допомогою змінних у контракті
      const campaignsCount = await crowdfundingPlatformInstance
        .methods.campaignsCount().call();

      // Завантажуємо всі кампанії
      const campaigns = await (async function () {
        if (!campaignsCount) {
          return [];
        }

        // Отримуємо адреси всіх кампаній
        const campaignsAddresses = await getCampaignsAddresses(
          crowdfundingPlatformInstance,
          campaignsCount,
        );

        // Фільтруємо кампанії
        const campaignsPending = campaignsAddresses
          .map((campaign) => filterCampaignInstance(
            web3,
            campaignAbi,
            campaign.targetContract,
            accounts[0],
          ));

        // Очікуємо завершення всіх асінхронних запитів
        const campaignsPromisses = await Promise.all(campaignsPending);

        return campaignsPromisses;
      }());

      // Відправляємо дію для ініціалізації
      dispatch({
        type: actions.init,
        data: {
          web3,
          campaignAbi,
          isLoading: false,
          userAccount: accounts[0],
          crowdfundingPlatformInstance,
          campaigns,
        },
      });
    }
  }, []);

  // Перевірка наявності Metamask при монтуванні компонента
  useEffect(() => {
    dispatch({
      type: actions.init,
      data: { isMetamaskInstalled: !!window.ethereum },
    });
  }, []);

  // Спостерігаємо за змінами в блокчейні або аккаунтах
  useEffect(() => {
    if (window.ethereum) {
      isConnected();
      const events = ['chainChanged', 'accountsChanged'];
      const handleChange = () => {
        init();
      };

      // Додаємо слухачів подій
      events.forEach((e) => window.ethereum.on(e, handleChange));

      // При розмонтовуванні компонента видаляємо слухачів
      return () => {
        events.forEach((e) => window.ethereum.removeListener(e, handleChange));
      };
    }
  }, [init, CrowdfundingPlatform]);

  // Перевірка на підключеність до Ethereum
  const isConnected = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length) {
      init();
    }
  };

  // Функція для підключення гаманця
  const connectWallet = () => {
    init();
  };

  // Повертаємо провайдер EthContext
  return (
    <EthContext.Provider value={{
      state,
      dispatch,
      connectWallet,
    }}
    >
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
