import {defineRouting} from 'next-intl/routing';

const SUPPORTED_LOCALES = JSON.parse(process.env.NEXT_PUBLIC_LOCALES || "[]");
const DEFAULT_LOCALE = `${process.env.NEXT_PUBLIC_FALLBACK_LOCALE}` || 'en';

export const MODE = process.env.NEXT_PUBLIC_I18N_MODE ?? 'pathname';

export const routing = defineRouting({
  // A list of all locales that are supported
  // locales: ['de', 'en', 'es', 'fr', 'it', 'nl', 'ro'] as const,

  // Used when no locale matches
  // defaultLocale: 'en',
  // localePrefix: 'as-needed',
  // Optional: localized pathnames for “pretty” URLs
  // pathnames: {
  //   '/': '/',
  //   '/dashboard': {
  //     en: '/dashboard',
  //     fr: '/tableau',
  //     de: '/dashboard',
  //     es: '/panel',
  //     nl: '/dashboard'
  //   },
  //   '/settings': {
  //     en: '/settings',
  //     fr: '/parametres',
  //     de: '/einstellungen',
  //     es: '/ajustes',
  //     nl: '/instellingen'
  //   }
  // }

  // We make use of providing a locale to next-intl via a cookie
  // In this setup we don't need a localePrefix.
  // localePrefix: 'never'

  locales: SUPPORTED_LOCALES,
  defaultLocale: DEFAULT_LOCALE,

  // Enable locale in path only when MODE = "pathname"
  localePrefix: MODE === 'pathname' ? 'as-needed': 'never'
});

export type AppLocale = typeof routing.locales[number];