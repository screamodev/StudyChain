//SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "./CrowdfundingPlatform.sol";

contract Campaign {
    // Унікальний ID кампанії
    uint public id;
    // Назва кампанії
    string public title;
    // Опис кампанії
    string public description;
    // Час закінчення кампанії
    uint public endsAt;
    // Мета збору коштів
    uint public goal;
    // Сума, яку вже зібрали
    uint public alreadyDonated;
    // Організатор кампанії
    address public organizer;
    // Контракт головної платформи
    CrowdfundingPlatform parentContract;
    // Чи було вже заявлено кошти
    bool public claimed;
    // Відображення, яке зберігає суми донатів від кожного адреси
    mapping(address => uint) public donations;

    // Подія, яка сповіщає про новий донат
    event Donated(uint amount, address donater);
    // Подія, яка сповіщає про відшкодування донату
    event RefundedAmount(uint amount, address refunder);

    // Конструктор контракту кампанії
    constructor(
        uint _id,
        string memory _title,
        string memory _description,
        uint _endsAt,
        uint _goal,
        address _organizer
    ) {
        id = _id;
        title = _title;
        description = _description;
        endsAt = _endsAt;
        goal = _goal;
        organizer = _organizer;
        parentContract = CrowdfundingPlatform(msg.sender);
    }

    // Функція для здійснення донату
    function donate() external payable {
        // Перевіряємо, що кампанія ще не закінчилась і сума донату більша за 0
        require(block.timestamp <= endsAt, "Campaign already has over.");
        require(msg.value > 0, "You can't donate 0.");

        // Збільшуємо суму вже зібраних коштів і суму донату від цієї адреси
        alreadyDonated += msg.value;
        donations[msg.sender] += msg.value;

        // Викликаємо подію про новий донат
        emit Donated(msg.value, msg.sender);
    }

    // Функція для відшкодування донату
    function refundDonation(uint _amount) external {
// Перевіряємо, що кампанія ще не закінчилась і сума для відшкодування не більша, ніж сума донату від цієї адреси
require(block.timestamp <= endsAt, "Campaign already has over.");
        require(_amount <= donations[msg.sender], "you cant refund more than you gave.");

        // Зменшуємо суму вже зібраних коштів та суму донату від цієї адреси
        donations[msg.sender] -= _amount;
        alreadyDonated -= _amount;

        // Переказуємо кошти назад на адресу донора
        payable(msg.sender).transfer(_amount);

        // Викликаємо подію про відшкодування донату
        emit RefundedAmount(_amount, msg.sender);
    }

    // Функція для виведення коштів організатором
    function claim() external {
        // Перевіряємо, що ця функція була викликана організатором, сума зібраних коштів достатня і кошти ще не були заявлені
        require(msg.sender == organizer, "You are not the organizer.");
        require(alreadyDonated >= goal, "Not enough funds.");
        require(!claimed, "Campaign already has claimed.");

        // Встановлюємо статус claimed у true
        claimed = true;

        // Переказуємо зібрані кошти на адресу організатора
        payable(organizer).transfer(alreadyDonated);

        // Сповіщаємо головний контракт про заявлення коштів
        parentContract.onClaimed(id);
    }
}
