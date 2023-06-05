import { FC } from 'react';
// useFormik для створення форми з реактивними властивостями
import { useFormik } from 'formik';
// useNavigate для перенаправлення користувача
import { useNavigate } from 'react-router-dom';

// Ethereum контекст
import useEth from '../../contexts/EthContext/useEth';
// Допоміжна функція для отримання екземпляра кампанії
import { filterCampaignInstance } from '../../contexts/EthContext/helpers/helpers';
// Actions для взаємодії з Ethereum контекстом
import { actions } from '../../contexts/EthContext';
// Стилі для форми створення кампанії
import './CreateCampaignForm.scss';

// Головний компонент форми створення кампанії
export const CreateCampaignForm: FC = () => {
  // Ініціалізація navigate для перенаправлення користувача
  const navigate = useNavigate();

  // Отримання поточного стану Ethereum контексту та функції dispatch для його оновлення
  const {
    state: {
      web3,
      campaignAbi,
      crowdfundingPlatformInstance,
      userAccount,
    }, dispatch,
  } = useEth();

  // Ініціалізація formik для керування станом форми
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      campaignDuration: '2592000',
      requiredAmount: '1',
    },
    // Обробник події onSubmit
    onSubmit: async ({
      title,
      description,
      campaignDuration,
      requiredAmount,
    }) => {
      // Обчислення часу закінчення кампанії
      const endAt = Math.floor(Date.now() / 1000) + +campaignDuration;
      // Конвертуємо ETH в Wei для зберігання в блокчейні
      const ethToWei = web3.utils.toWei(`${requiredAmount}`, 'ether');

      // Створюємо нову кампанію на блокчейні
      await crowdfundingPlatformInstance.methods
        .startCampaign(
          title,
          description,
          ethToWei,
          endAt,
        ).send({ from: userAccount })
        .then(async ({ events: { CampaignStarted: { returnValues } } }: any) => {
          // Отримуємо екземпляр новоствореної кампанії
          const campaign = await filterCampaignInstance(
            web3,
            campaignAbi,
            returnValues[1],
            userAccount,
          );

          // Додаємо нову кампанію в стан Ethereum контексту
          dispatch({
            type: actions.addCampaign,
            data: campaign,
          });

          return campaign;
        }).then(({ id }: {id: number }) => {
          // Перенаправляємо користувача на сторінку новоствореної кампанії
          navigate(`/campaign/${id}`);
        });
    },
  });

  // Рендеримо форму
  return (
  // Компонент форми створення кампанії
    <div className="create-campaign">
      <h1>Створити свій сбір</h1>
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="title">
          Назва кампанії
          <input
            id="title"
            placeholder="Введіть назву..."
            name="title"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.title}
          />
        </label>

        <label htmlFor="description">
          Опис кампанії
          <textarea
            id="description"
            placeholder="Введіть опис..."
            name="description"
            onChange={formik.handleChange}
            value={formik.values.description}
          />
        </label>

        <label htmlFor="campaignDuration">
          Час виділенний на сбор коштів
          <select
            name="campaignDuration"
            value={formik.values.campaignDuration}
            onChange={formik.handleChange}
          >
            <option value="2592000">30 днів</option>
            <option value="3888000">45 днів</option>
            <option value="5184000">60 днів</option>
          </select>
        </label>

        <label htmlFor="requiredAmount">
          Необходна сума сбору (ETH)
          <input
            id="requiredAmount"
            placeholder="Введіть суму яку плануєте зібрати..."
            name="requiredAmount"
            type="number"
            onChange={formik.handleChange}
            value={formik.values.requiredAmount}
          />
        </label>
        <button className="form-button" type="submit">Создати</button>
      </form>
    </div>
  );
};
