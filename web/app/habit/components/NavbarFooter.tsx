/* eslint-disable jsx-a11y/anchor-is-valid */
import { Tab, Tabs } from '@nextui-org/react';
import { Key, useEffect, useState } from 'react';
import { IoIosHome, IoIosAddCircle, IoMdTrophy } from 'react-icons/io';
import { FaList } from "react-icons/fa";
import { usePathname } from 'next/navigation';

enum TabKey {
  HOME = 'home',
  LIST = 'list',
  CREATE = 'create',
  TROPHY = 'trophy',
}

export default function NavbarFooter() {
  const [selected, setSelected] = useState<TabKey>(TabKey.HOME);

  const pathName = usePathname()

  // detect url to see which is selected
  useEffect(() => {
    if (pathName.includes('list')) {
      setSelected(TabKey.LIST)
    } else if (pathName.includes('create')) {
      setSelected(TabKey.CREATE)
    } else {
      setSelected(TabKey.HOME)
    }
  }, [pathName, setSelected])  

  return (
    
    <Tabs
      aria-label="Options"
      selectedKey={selected}
      onSelectionChange={(value: Key) => setSelected(value as TabKey)}
      size='lg'
      variant='light'
      className="fixed bottom-0 z-50 flex items-center justify-around mb-6 mx-6 rounded-2xl shadow-2xl bg-white"
      color='primary'
    >
      <Tab
        key={TabKey.HOME}
        className='p-6 text-dark mx-2 focus:bg-dark'
        title={
          <div className="flex items-center">
            <IoIosHome size={20} />
          </div>
        }
      />

      <Tab
        key={TabKey.LIST}
        className='p-6 text-dark mx-2'
        title={
          <div className="flex items-center">
            <FaList size={20}  />
          </div>
        }
      />

      <Tab
        key={TabKey.CREATE}
        className='p-6 text-dark mx-2'
        title={
          <div className="flex items-center">
            <IoIosAddCircle size={20}  />
          </div>
        }
      />

      <Tab
        key={TabKey.TROPHY}
        className='p-6 text-dark mx-2'
        isDisabled
        title={
          <div className="flex items-center">
            <IoMdTrophy size={20}  />
          </div>
        }
      />
    </Tabs>

  );
}
