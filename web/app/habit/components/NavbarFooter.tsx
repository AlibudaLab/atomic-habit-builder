'use client';

import { useEffect, useState } from 'react';
import { IoIosHome, IoIosAddCircle } from 'react-icons/io';
import { CgProfile } from 'react-icons/cg';
import { FaList } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

enum TabKey {
  None = 'none',
  HOME = 'home',
  LIST = 'list',
  CREATE = 'create',
  PROFILE = 'profile',
}

export default function NavbarFooter() {
  const [selected, setSelected] = useState<TabKey>(TabKey.None);
  const pathName = usePathname();
  const router = useRouter();

  // detect url to see which is selected
  useEffect(() => {
    if (pathName.includes('list') || pathName.includes('stake')) {
      setSelected(TabKey.LIST);
    } else if (pathName.includes('create')) {
      setSelected(TabKey.CREATE);
    } else if (pathName.includes('profile')) {
      setSelected(TabKey.PROFILE);
    } else if (pathName === '/' || pathName.includes('checkin')) {
      setSelected(TabKey.HOME);
    } else {
      setSelected(TabKey.None);
    }
  }, [pathName, setSelected]);

  return (
    <div
      aria-label="Options"
      className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-8 rounded-[40px] bg-white p-4 text-dark shadow-2xl"
      color="primary"
    >
      <button
        key={TabKey.HOME}
        className={selected === TabKey.HOME ? 'opacity-100' : 'opacity-40'}
        onClick={() => router.push('/')}
        type="button"
      >
        <div className="mx-2 flex items-center">
          <IoIosHome size={25} />
        </div>
      </button>

      <button
        key={TabKey.LIST}
        className={selected === TabKey.LIST ? 'opacity-100' : 'opacity-40'}
        onClick={() => router.push('/habit/list')}
        type="button"
      >
        <div className="mx-2 flex items-center">
          <FaList size={25} />
        </div>
      </button>

      <button
        key={TabKey.CREATE}
        className={selected === TabKey.CREATE ? 'opacity-100' : 'opacity-40'}
        onClick={() => router.push('/habit/create')}
        type="button"
      >
        <div className="mx-2 flex items-center">
          <IoIosAddCircle size={25} />
        </div>
      </button>

      <button
        key={TabKey.PROFILE}
        className={selected === TabKey.PROFILE ? 'opacity-100' : 'opacity-40'}
        onClick={() => router.push('/profile')}
        type="button"
      >
        <div className="mx-2 flex items-center">
          <CgProfile size={25} />
        </div>
      </button>
    </div>
  );
}
