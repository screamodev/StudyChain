import { FC } from 'react';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { Campaigns } from '../../components/Campaigns/Campaigns';

export const HomePage: FC = () => (
  <PageLayout>
    <Campaigns />
  </PageLayout>
);
