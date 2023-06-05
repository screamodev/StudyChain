import { FC, ReactNode } from 'react';
import { Header } from '../Header/Header';
import './pageLayout.scss';

interface PageLayoutProps {
    children: ReactNode;
}

export const PageLayout: FC<PageLayoutProps> = ({ children }) => (
  <div className="page-layout">
    <div className="page-layout-container">
      <Header />
      <main className="page-layout-container-content">
        {children}
      </main>
    </div>
  </div>
);
