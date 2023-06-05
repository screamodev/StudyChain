import { FC } from 'react';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { CampaignInfo } from '../../components/CampaignInfo/CampaignInfo';

export const CampaignPage: FC = () => (
  <PageLayout>
    <CampaignInfo />
  </PageLayout>
);
