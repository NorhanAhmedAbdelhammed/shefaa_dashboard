import { Tabs, TabsRef } from 'flowbite-react';
import { useRef, useLayoutEffect } from 'react';
import type { IconType } from 'react-icons/lib';
import { useNavigate, useSearchParams } from 'react-router-dom';

export interface ITabPanel {
  key: string;
  title: string;
  icon: IconType;
  component: React.ReactNode;
}
interface IMainTabsProps {
  panels: ITabPanel[];
}

// This component handles navigating between panel with the help of the search params
// in case of extending it to deal with Backend filters

const MainTabs: React.FunctionComponent<IMainTabsProps> = ({ panels }) => {
  const tabsRef = useRef<TabsRef>(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTabKey = searchParams.get('tab');

  const currentTab: string =
    (currentTabKey && panels.find((panel) => panel.key === currentTabKey)?.key) || panels[0].key;

  const keysList: string[] = panels.map((item) => item.key);

  const tabChangeHandler = (tab = 0): void => {
    navigate('', { state: { tab: keysList[tab] } });

    // moving between tabs resets all other filters by default
    setSearchParams({ tab: keysList[tab] });
  };

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full max-w-full align-middle">
          <div className="overflow-hidden shadow">
            <Tabs.Group
              ref={tabsRef}
              style="underline"
              aria-label="Tabs with icons"
              onActiveTabChange={tabChangeHandler}>
              {panels.map(({ title, component, icon }, idx) => (
                <Tabs.Item
                  key={title}
                  title={title}
                  icon={icon}
                  className="max-w-full overflow-hidden"
                  active={currentTab === keysList[idx]}>
                  {component}
                </Tabs.Item>
              ))}
            </Tabs.Group>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainTabs;
