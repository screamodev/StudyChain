import { FC } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'; // імпортуємо компоненти для маршрутизації з react-router-dom
import { HomePage } from '../../pages/HomePage/HomePage'; // імпортуємо компонент HomePage
import { EthProvider } from '../../contexts/EthContext'; // імпортуємо провайдер контексту Ethereum
import { CreateCampaignPage } from '../../pages/CreateCampaignPage/CreateCampaignPage'; // імпортуємо компонент CreateCampaignPage
import { AboutPage } from '../../pages/AboutPage/AboutPage'; // імпортуємо компонент AboutPage
import { CampaignPage } from '../../pages/CampaignPage/CampaignPage'; // імпортуємо компонент CampaignPage
import { MyCampaignsPage } from '../../pages/MyCampaignsPage/MyCampaignsPage'; // імпортуємо компонент MyCampaignsPage

// Основний компонент додатку
export const App: FC = () => (
    // Обгортка з контекстом Ethereum
    <EthProvider>
      {/* Використовуємо BrowserRouter для маршрутизації */}
      <BrowserRouter>
        {/* Визначаємо маршрути для нашого додатку */}
        <Routes>
          {/* Домашня сторінка */}
          <Route path="/" element={<HomePage />} />
          {/* Сторінка окремої кампанії, де :id - це параметр, що містить ідентифікатор кампанії */}
          <Route path="/campaign/:id" element={<CampaignPage />} />
          {/* Сторінка для створення кампанії */}
          <Route path="/create-campaign" element={<CreateCampaignPage />} />
          {/* Сторінка зі списком кампаній користувача */}
          <Route path="/my-campaigns" element={<MyCampaignsPage />} />
          {/* Сторінка з інформацією про додаток */}
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </BrowserRouter>
    </EthProvider>
);
