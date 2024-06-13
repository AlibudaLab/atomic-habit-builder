/* eslint-disable jsx-a11y/anchor-is-valid */
import { Tab, Tabs } from '@nextui-org/react';
import { Key, useEffect, useState } from 'react';
import { IoIosHome, IoIosAddCircle, IoMdTrophy } from 'react-icons/io';
import { FaList } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

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
    <div
      aria-label="Options"
      className="fixed bottom-0 z-50 mx-10 mb-6 flex items-center gap-8 rounded-[40px] bg-white p-4 text-dark shadow-2xl "
      color="primary"
    >
      <button
        key={TabKey.HOME}
        className={selected === TabKey.HOME ? 'opacity-100' : 'opacity-40'}
        onClick={() => router.push('/')}
      >
        <div className="mx-2 flex items-center">
          <IoIosHome size={25} />
        </div>
      </button>

      <button
        key={TabKey.LIST}
        className={selected === TabKey.LIST ? 'opacity-100' : 'opacity-40'}
        onClick={() => router.push('/habit/list')}
      >
        <div className="mx-2 flex items-center">
          <FaList size={25} />
        </div>
      </button>

      <button
        key={TabKey.CREATE}
        className={selected === TabKey.CREATE ? 'opacity-100' : 'opacity-40'}
        onClick={() => router.push('/habit/create')}
      >
        <div className="mx-2 flex items-center">
          <IoIosAddCircle size={25} />
        </div>
      </button>

      <button
        key={TabKey.TROPHY}
        className="opacity-40"
        // disabled
        onClick={() => toast('Coming soon!')}
      >
        <div className="mx-2 flex items-center">
          <IoMdTrophy size={25} />
        </div>
      </button>
    </div>
  );
}
