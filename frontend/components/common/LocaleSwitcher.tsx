'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import Flag from 'react-world-flags';
import { AppLocale, MODE } from '@/i18n/routing';

const LOCALES = [
  { code: 'en', label: 'English', flag: 'GB' },
  { code: 'nl', label: 'Nederlands', flag: 'NL' },
  { code: 'es', label: 'Espanol', flag: 'ES' },
  { code: 'ro', label: 'Romana', flag: 'RO' },
  { code: 'de', label: 'Deutsch', flag: 'DE' },
] as const;

export default function LocaleSwitcher() {
  const router = useRouter();
  const path = usePathname();
  const locale = useLocale();

  const setLocale = (next: AppLocale) => {
    if (next === locale) return;

    // ✅ persist everywhere
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000`;
    localStorage.setItem('NEXT_LOCALE', next);

    // const mode = process.env.NEXT_PUBLIC_I18N_MODE ?? 'pathname';
    if (MODE === 'pathname') {
      const parts = path.split('/');
      if (parts[1]?.length === 2) parts[1] = next;
      else parts.splice(1, 0, next);

      router.push(parts.join('/'));
    } else {
      router.refresh();
    }
  };

  return (
    <div className="relative inline-block">
      <select
        className="border px-3 py-2 rounded pr-8"
        value={locale}
        onChange={e => setLocale(e.target.value as AppLocale)}
      >
        {LOCALES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
      </select>
      <div className="inline-block pointer-events-none">
        <Flag code={LOCALES.find(l => l.code === locale)?.flag} height="28" />
      </div>
    </div>
  );
}
