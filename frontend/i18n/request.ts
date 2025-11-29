import {cookies, headers} from 'next/headers';
import {getRequestConfig} from 'next-intl/server';
import { routing, MODE, AppLocale } from './routing';


async function detectLocale(): Promise<AppLocale> {
  let detectedLocale: AppLocale | undefined;

  // 1. If using cookie mode, read locale from cookie
  if (MODE === 'cookie') {
    const cookieStore = await cookies();

    detectedLocale = cookieStore.get('NEXT_LOCALE')?.value;
  }
  
  // 2. Fallback: detect from headers (browser language)
  if (!detectLocale) {
    const headerStore = await headers();
    const acceptLang = headerStore.get('accept-language') // ?? '';

    detectedLocale = acceptLang?.split(',')[0]?.split('-')[0];
  }

  // 3. Ensure it's a supported locale
  if (!routing.locales.includes(detectedLocale as any)) {
    detectedLocale = routing.defaultLocale
  }

  return detectedLocale;
}


export default getRequestConfig(async () => {
  const detectedLocale = await detectLocale();
 
  return {
    locale: detectedLocale,
    messages: (await import(`@/messages/${detectedLocale}.json`)).default
  };
});