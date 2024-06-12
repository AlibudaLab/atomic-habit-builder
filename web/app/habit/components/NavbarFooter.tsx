/* eslint-disable jsx-a11y/anchor-is-valid */
import { Tab, Tabs } from '@nextui-org/react';
import { Key, useEffect, useState } from 'react';
import { IoIosHome, IoIosAddCircle, IoMdTrophy } from 'react-icons/io';
import { FaList } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

enum TabKey {
  None = 'none',
  HOME = 'home',
  LIST = 'list',
  CREATE = 'create',
  TROPHY = 'trophy',
}

export default function NavbarFooter() {
  const [selected, setSelected] = useState<TabKey>(TabKey.None);

  const pathName = usePathname();

  console.log('pathName', pathName);

  const router = useRouter();

  // detect url to see which is selected
  useEffect(() => {
    if (pathName.includes('list')) {
      setSelected(TabKey.LIST);
    } else if (pathName.includes('create')) {
      setSelected(TabKey.CREATE);
    } else if (pathName === '/') {
      setSelected(TabKey.HOME);
    } else {
      setSelected(TabKey.None);
    }
  }, [pathName, setSelected]);

  return (
    <Tabs
      aria-label="Options"
      selectedKey={selected}
      onSelectionChange={(value: Key) => {
        console.log('value', value);
        // setSelected(value as TabKey)
        // navigate to the selected tab
        if (value === TabKey.HOME) {
          router.push('/');
        } else if (value === TabKey.LIST) {
          router.push('/habit/list');
        } else if (value === TabKey.CREATE) {
          router.push('/habit/create');
        }
      }}
      size="lg"
      variant="light"
      className="fixed bottom-0 z-50 mx-6 mb-6 flex items-center justify-around rounded-2xl bg-white shadow-2xl"
      color="primary"
    >
      <Tab key={TabKey.None} className="m-0 w-0 p-0" />
      <Tab
        key={TabKey.HOME}
        className="text-dark focus:bg-dark mx-2 p-6"
        title={
          <div className="flex items-center">
            <IoIosHome size={20} />
          </div>
        }
      />

      <Tab
        key={TabKey.LIST}
        className="text-dark mx-2 p-6"
        title={
          <div className="flex items-center">
            <FaList size={20} />
          </div>
        }
      />

      <Tab
        key={TabKey.CREATE}
        className="text-dark mx-2 p-6"
        title={
          <div className="flex items-center">
            <IoIosAddCircle size={20} />
          </div>
        }
      />

      <Tab
        key={TabKey.TROPHY}
        className="text-dark mx-2 p-6"
        isDisabled
        title={
          <div className="flex items-center">
            <IoMdTrophy size={20} />
          </div>
        }
      />
    </Tabs>
  );
}
