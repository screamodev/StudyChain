import { FC } from 'react';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { UserCampaigns } from '../../components/Campaigns/UserCampaigns';

export const MyCampaignsPage: FC = () => (
  <PageLayout>
    <UserCampaigns />
  </PageLayout>
);
