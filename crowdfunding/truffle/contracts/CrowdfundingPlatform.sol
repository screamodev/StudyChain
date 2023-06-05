//SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "./Campaign.sol";

contract CrowdfundingPlatform {
    // Структура кампанії збору коштів, яка зберігає контракт кампанії та інформацію про те, чи були вже заявлені кошти
    struct CrowdfundingCampaign {
        Campaign targetContract;
        bool claimed;
    }

    // Відображення, яке зберігає всі кампанії
    mapping(uint => CrowdfundingCampaign) public campaigns;
    // Кількість кампаній
    uint public campaignsCount;
    // Власник платформи
    address public owner;

    // Подія, яка сповіщає про старт нової кампанії
    event CampaignStarted(uint id, Campaign newCampaignAddress, uint endsAt, uint goal, address organizer);

    // Функція для створення нової кампанії
    function startCampaign(
        string memory _title,
        string memory _description,
        uint _goal,
        uint _endsAt
    ) external {
        // Перевіряємо, що дата завершення в майбутньому і мета кампанії більша за 0
        require(_endsAt > block.timestamp, "Campaign duration can't be earlier than now.");
        require(_goal > 0, "You must define goal of your campaign.");

        // Збільшуємо кількість кампаній
        campaignsCount = campaignsCount + 1;

        // Створюємо нову кампанію
        Campaign newCampaign = new Campaign(campaignsCount, _title, _description, _endsAt, _goal, msg.sender);

        // Додаємо кампанію до нашого відображення
        campaigns[campaignsCount] = CrowdfundingCampaign({
            targetContract: newCampaign,
            claimed: false
        });

        // Викликаємо подію про старт кампанії
        emit CampaignStarted(campaignsCount, newCampaign, _endsAt, _goal, msg.sender);
    }

    // Функція для відзначення, що кошти було вилучено
    function onClaimed(uint id) external {
        CrowdfundingCampaign storage targetCampaign = campaigns[id];

        // Перевіряємо, що ця функція була викликана контрактом цільової кампанії
        require(msg.sender == address(targetCampaign.targetContract), "It is not required campaign.");

        // Встановлюємо статус claimed у true
        targetCampaign.claimed = true;
    }
}
