'use client';

import React from 'react';

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import LanguageSelector from './LanguageSelector';
import LocaleSwitcher from './LocaleSwitcher';
import { useScroll } from '@/hooks';
import clsx from 'clsx';


const Navbar = () => {
  const scrolled = useScroll(5);
  const selectedLayout = useSelectedLayoutSegment();


  return (
    <nav className={clsx('sticky inset-x-0 top-0 z-50 w-full transition-all border-b border-gray-200', 
      {
        'border-b border-gray-200 bg-white/75 backdrop-blur-lg': scrolled,
        'border-b border-gray-200 bg-white': selectedLayout,
      }
    )}
    >
      <div className='flex h-[47px] items-center justify-between px-4'>
        <div className='flex items-center space-x-4'>
          <Link
            href="/"
            className='flex flex-row space-x-3 items-center justify-center md:hidden'
          >
            <span className='h-7 w-7 bg-purple-800 rounded-lg' />
            <span className='font-bold text-xl flex'>Logo</span>
          </Link>
        </div>

        <div className='mt-10'>
          <LocaleSwitcher />
        </div>

        <div className='hidden md:block'>
          <div className='h-8 w-8 rounded-full bg-red-800 flex items-center justify-center'>
            <span className='font-semibold text-sm'>HQ</span>
          </div>
        </div>

      </div>
      {/* <h1>
        Navbar
      </h1> */}
    </nav>
  );
};

export default Navbar;