import MainTabs from '@UI/MainTabs/MainTabs';
import { Button, PageContainer } from '@UI/index';
import { useState } from 'react';
import { HiPlus } from 'react-icons/hi';
import { AddPharmacyModal } from '../../_components';
import { pharmaciesPanels } from './pharmacies-panels';

const PharmaciesListPage: React.FC = () => {
  const [isOpen, setOpen] = useState(false);

  const toggleOpen = (): void => setOpen((state) => !state);
  const closeModal = (): void => setOpen(false);

  return (
    <PageContainer title="pharmacies">
      <div className="block items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700 sm:flex">
        <div className="mb-1 w-full">
          <div className="block items-center sm:flex">
            <div className="flex w-full items-center sm:justify-end">
              <div>
                <Button onClick={toggleOpen}>
                  <HiPlus className="mr-3 text-sm" />
                  Add pharmacy
                </Button>
              </div>
              <AddPharmacyModal onClose={closeModal} isOpen={isOpen} />
            </div>
          </div>
        </div>
      </div>
      <MainTabs panels={pharmaciesPanels} />
    </PageContainer>
  );
};

export default PharmaciesListPage;
