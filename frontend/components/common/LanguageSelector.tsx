'use client';

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Field, Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import clsx from "clsx";

import type { IconType } from "react-icons";
import { BsChevronDown, BsCheck } from "react-icons/bs";
import { FaChevronDown, FaCheck } from "react-icons/fa";
import { FaChevronDown as Fa6ChevronDown, FaCheck as Fa6Check } from 'react-icons/fa6';
import { FiChevronDown, FiCheck } from "react-icons/fi";
import { LuChevronDown, LuCheck } from "react-icons/lu";

import { FlagDE, FlagES, FlagFR, FlagGB, FlagIT, FlagNL, FlagRO } from "../icons";

type IconLibrary = 'bs' | 'fa' | 'fa6' | 'fi' | 'lu';

const libMapChevron: Record<IconLibrary, IconType> = {
  bs: BsChevronDown,
  fa: FaChevronDown,
  fa6: Fa6ChevronDown,
  fi: FiChevronDown,
  lu: LuChevronDown,
}

const libMapCheck: Record<IconLibrary, IconType> ={
  bs: BsCheck,
  fa: FaCheck,
  fa6: Fa6Check,
  fi: FiCheck,
  lu: LuCheck,
}


type Locale = 'de' | 'es' | 'fr' | 'en' | 'it' | 'nl' | 'ro';

const SUPPORTED_LOCALES: Locale[] = ['de', 'es', 'fr', 'en', 'it', 'nl', 'ro'];

const FLAGS: Record<Locale, React.ComponentType<{ size?: number }>> = {
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

const PREFERRED_COOKIE = 'preferred_locale';


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

// --- tiny client helper for persistence ---
function setPreferredLocale(next: Locale) {
  try {
    // Cookie (1 year)
    document.cookie = `${PREFERRED_COOKIE}=${encodeURIComponent(next)};
      Max-age=31536000;
      Path=/; 
      SameSite=Lax`;
    // LocalStorage
    window.localStorage.setItem(PREFERRED_COOKIE, next);
  } catch {
    // no-op (private mode / disabled)
  }
}


export default function LanguageSelector({
  className,
  flagSize = 20,
  iconSize = 16,
  iconLib = 'bs', 
  menuWidthClass = 'w-44',
}: {
  className? : string;
  flagSize?: number;              // flag size in px
  iconSize?: number;              // icon size in px
  iconLib?: IconLibrary;
  menuWidthClass?: string;        // Tailwind width class for the button/menu
}) {
  const router = useRouter();
  const pathname = usePathname();
  const current = inferCurrentLocale(pathname);
  const [value, setValue] = useState<Locale>(current);

  useEffect(() => setValue(current), [current]);

  const CurrentFlag = FLAGS[value];
  
  const ChevronIcon = libMapChevron[iconLib] ?? BsChevronDown
  const CheckIcon = libMapCheck[iconLib] ?? BsCheck

  const onChange = (next: Locale) => {
    if (next === value) return;

    setValue(next);
    setPreferredLocale(next);
    // router.push(swapLocaleInPath(pathname, next));
  };

  return (
    <div className={clsx('realive inline-block', className)}>
      <Field>
        <Label className="sr-only">Change language</Label>
        
        <Listbox value={value} onChange={onChange}>
          {({ open }) => (
            <div className="relative">
              <ListboxButton
                aria-label="Select language"
                className={clsx(
                  'flex items-center justify-between gap-1 rounded-xl border px-3 py-2 text-sm shadow-sm',
                  'border-zinc-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500',
                  'dark:border-zinc-700 dark:bg-zinc-900',
                  menuWidthClass
                )}
              >
                <span className="flex min-w-0 items-center gap-1">
                  <CurrentFlag size={flagSize} />
                  <span className="truncate">{LABELS[value]}</span>
                </span>
                <ChevronIcon
                  size={iconSize}
                  className={clsx('transition-transform duration-300', open && 'rotate-180')}
                  aria-hidden
                />
              </ListboxButton>

              <ListboxOptions
                anchor="bottom start"
                className={clsx(
                  'z-50 mt-1 max-h-72 overflow-auto rounded-xl border bg-white p-1 shadow-lg outline-none',
                  'border-zinc-200 dark:border-zinc-600 dark:bg-zinc-900',
                  menuWidthClass
                )}
              >
                {SUPPORTED_LOCALES.map((loc, idx) => {
                  const Flag = FLAGS[loc];
                  const isCurrent = loc === value;

                  return (
                    <ListboxOption
                      key={idx}
                      value={loc}
                      disabled={isCurrent}
                      title={isCurrent ? 'Already selected': undefined}
                      className={clsx(
                        // base
                        'group flex cursor-default select-none items-center gap-1 rounded-lg px-2 py-2 text-sm',
                        // hover/focus (v2 exposes data attributes)
                        'data-focus:bg-zinc-100 dark:data-focus:bg-zinc-800',
                        // visual affordances for disabled state
                        'data-disabled:opacity-50 data-disabled:cursor-not-allowed'
                      )}
                    >
                      {/* You can also use render props if you prefer */}
                      <Flag size={flagSize} />
                      <span className="flex-1 truncate">{LABELS[loc]}</span>
                      <CheckIcon
                        size={iconSize}
                        className="invisible group-data-selected:visible"
                        aria-hidden
                      />
                    </ListboxOption>
                  );
                })}
              </ListboxOptions>
            </div>
          )}
        </Listbox>
      </Field>
    </div>
  );
};
