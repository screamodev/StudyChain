// Функція для отримання адрес кампаній
export const getCampaignsAddresses = async (contractInstance, campaignsCount) => {
  const campaignsAddressesPending = [];

  // Проходимо через всі кампанії в контракті
  for (let i = 1; i <= campaignsCount; i++) {
    // Отримуємо об'єкт запросу для кожної кампанії, що поверне її адресу
    campaignsAddressesPending.push(contractInstance
      .methods.campaigns(i).call());
  }

  // Виконуємо всі об'єкти запросу паралельно
  const campaignsAddresses = await Promise.all(campaignsAddressesPending);

  // Повертаємо масив адрес кампаній
  return campaignsAddresses;
};

// Функція для створення екземпляру кампанії з вказаної адреси
export const filterCampaignInstance = async (web3, abi, contractAddress, userAccount) => {
  // Створюємо новий контракт на основі ABI та адреси
  const { methods: campaignMethods } = new web3
    .eth.Contract(abi, contractAddress);

  // Зчитуємо дані кампанії з блокчейну та повертаємо їх
  return {
    id: +await campaignMethods.id().call(),
    title: await campaignMethods.title().call(),
    description: await campaignMethods.description().call(),
    goal: +web3.utils.fromWei(await campaignMethods.goal().call(), 'ether'),
    alreadyDonated: +web3.utils.fromWei(await campaignMethods.alreadyDonated().call(), 'ether'),
    endsAt: +await campaignMethods.endsAt().call(),
    organizer: await campaignMethods.organizer().call(),
    claimed: await campaignMethods.claimed().call(),
    currentUserDonations: +web3.utils.fromWei(await campaignMethods.donations(userAccount).call(), 'ether'),
    donate: await campaignMethods.donate,
    refundDonation: await campaignMethods.refundDonation,
    claim: await campaignMethods.claim,
  };
};
