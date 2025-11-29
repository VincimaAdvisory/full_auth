'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SIDENAV_ITEMS, SideNavItem } from '../sidebar-items';
import { Icon } from '@iconify/react';
import { NextIntlClientProvider, useTranslations, useLocale } from 'next-intl';


// export default function Sidebar({ children }) {
//   return (
//     <aside className='h-screen w-64'>
//       <nav className='h-full flex flex-col bg-blue-800 border-r shadow-sm'>
//         <div className='p-4 pb-2 flex justify-between items-center'>
//           <button className='p-1.5 rounded-lg bg-gray-500 hover:bg-gray-400'>
//             <LuChevronFirst />
//           </button>
//         </div>
//         <ul className='flex-1 px-3'>{children}</ul>
//         <div className='border-t flex p-3'>
//           <div className='flex justify-between items-center ml-3'>
//             <div>
//               <h4 className='font-semibold'>Item</h4>
//               <span className='text-xs text-gray-600'>example@domain.com</span>
//             </div>

//           </div>

//         </div>
//       </nav>

//     </aside>
//   )
// }

// export default function SidebarItem({});

const Sidebar = () => {

      <div className="md:w-60 bg-white h-screen flex-1 fixed border-r border-zinc-200 hidden md:flex">
        <div className="flex flex-col space-y-6 w-full">
          <Link
            href="/"
            className="flex flex-row space-x-3 items-center justify-center md:justify-start md:px-6 border-b border-zinc-200 h-12 w-full"
          >
            <span className="h-7 w-7 bg-zinc-300 rounded-lg" />
            <span className="font-bold text-xl hidden md:flex">Logo</span>
          </Link>

          <div className="flex flex-col space-y-2  md:px-6 ">
            {SIDENAV_ITEMS.map((item, idx) => {
              return <MenuItem key={idx} item={item} />;
            })}
          </div>
        </div>
      </div>

};

export default Sidebar;


const MenuItem = ({ item }: { item: SideNavItem }) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };
  const t = useTranslations('Sidebar');

  return (
    <NextIntlClientProvider>
      <div className="">
        {item.submenu ? (
          <>
            <button
              onClick={toggleSubMenu}
              className={`flex flex-row items-center p-2 rounded-lg hover-bg-zinc-100 w-full justify-between hover:bg-zinc-100 ${
                pathname.includes(item.path) ? 'bg-zinc-100' : ''
              }`}
            >
              <div className="flex flex-row space-x-4 items-center">
                {item.icon}
                <span className="font-semibold text-xl  flex">{item.title}</span>
              </div>

              <div className={`${subMenuOpen ? 'rotate-180' : ''} flex`}>
                <Icon icon="lucide:chevron-down" width="24" height="24" />
              </div>
            </button>

            {subMenuOpen && (
              <div className="my-2 ml-12 flex flex-col space-y-4">
                {item.subMenuItems?.map((subItem, idx) => {
                  return (
                    <Link
                      key={idx}
                      href={subItem.path}
                      className={`${
                        subItem.path === pathname ? 'font-bold' : ''
                      }`}
                    >
                      <span>{t(subItem.title)}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <Link
            href={item.path}
            className={`flex flex-row space-x-4 items-center p-2 rounded-lg hover:bg-zinc-100 ${
              item.path === pathname ? 'bg-zinc-100' : ''
            }`}
          >
            {item.icon}
            <span className="font-semibold text-xl flex">{t(item.title)}</span>
          </Link>
        )}
      </div>
    </NextIntlClientProvider>
  );
};