import { Link } from  "@/i18n/navigation"  // "next/link";
import { LoginForm } from "@/components/forms";
import type { Metadata } from "next";
import { useLocale } from "next-intl";
import { useTypedTranslation } from "@/i18n/useTypedTranslation";

export const metadata:Metadata = {
  title: 'Full Auth | Login',
  description: 'Full Auth Login page',
}

export default function Page() {
  // const locale = useLocale();
  const t = useTypedTranslation('forms');


  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Vincima"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
          {t('titleLogIn')}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <LoginForm />

        <p className="mt-4 text-center text-sm/6 text-gray-500 dark:text-gray-400">
          {t("noAccount")}{' '}
          <Link
            href="/auth/register/"
            className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            {t("registerLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
