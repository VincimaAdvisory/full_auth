'use client';

import React, { useState , useEffect} from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FlagDE,FlagES, FlagFR, FlagGB, FlagIT, FlagNL, FlagRO } from "../icons";
import clsx from "clsx";

type Locale = 'de' | 'es' | 'fr' | 'en' | 'it' | 'nl' | 'ro';

const SUPPORTED_LOCALES: Locale[] = ['de', 'es', 'fr', 'en', 'it', 'nl', 'ro'];


const FLAGS: Record<Locale, React.ComponentType<{
  size?: number,
  className?: string } >> = {
  de: FlagDE,
  es: FlagES,
  fr: FlagFR,
  en: FlagGB,
  it: FlagIT,
  nl: FlagNL,
  ro: FlagRO,
};

const LABELS: Record<Locale, string> = {
  de: 'Deutsch',
  es: 'Español',
  fr: 'Fraçais',
  en: 'English',
  it: 'Italiano',
  nl: 'Nederlands',
  ro: 'Română',
}

function inferCurrentLocale(pathname: string): Locale {
  const seg = pathname.split('/').filter(Boolean)[0] as Locale | undefined;
  
  return SUPPORTED_LOCALES.includes(seg as Locale) ? (seg as Locale) : 'en';
}

function swapLocaleInPath(pathname: string, nextLocale: Locale): string {
  const parts = pathname.split('/');

  if (parts.length > 1 && SUPPORTED_LOCALES.includes(parts[1] as Locale)) {
    parts[1] = nextLocale;
    return parts.join('/') || '/';
  }
  // If no locale segment is present (e.g. '/'), prefix it
  const tail = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `/${nextLocale}${tail === '/' ? '' : tail}`;
}

interface DropDownMenuProps {
  buttonLabel: string;
  items: {
    title: string;
    url?: string;
    icon?: JSX.Element;
    action?: () => void;
  }[];
  size?: number;
}

export const DropDownMenu = ({
  buttonLabel,
  items,
  size = 24,
} : DropDownMenuProps) => {
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prev) => !prev);
  };
  
  const pathname = usePathname();
  const current = inferCurrentLocale(pathname);
  const [value, setValue] = useState<Locale>(current);

  useEffect(() => setValue(current), [current]);
  
  const CurrentFlag = FLAGS[current];

  return (
    <div className="relative">
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-md text-sm border border-zinc-600 h-10 px-4 py-2"
        onClick={handleToggle}
      >
        <CurrentFlag size={size} /><span className="truncate">{LABELS[value]}</span>
        <span className="ml-2">
          {open ? <FaChevronUp/> : <FaChevronDown/>}
        </span>
      </button>
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 top-12">
          <ul className="w-40 h-aut0 shadow-md rounded-md p-1 border bg-white dark:bg-gray-800">
            {SUPPORTED_LOCALES.map((loc, idx) => {
              const Flag = FLAGS[loc];
              const selected = loc === current;
              return (
                <li
                  key={idx}
                  className={`relative flex items-center gap-1 px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-gray-500 rounded-md`}
                >
                  <Flag size={size} />
                  <span
                    className={clsx(
                      'flex-1 truncate',
                      selected ? 'font-medium' : 'font-normal'
                    )}
                  >
                    {LABELS[loc]}
                  </span>
                  {selected && (
                    'Check'
                  )}
                </li>
              )
            })}
          </ul>
        </div>  
      )}
    </div>
  );
};