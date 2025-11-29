import Link from "next/link";
import { RegisterForm } from "@/components/forms";
import type { Metadata } from "next";
import { useTypedTranslation } from "@/i18n/useTypedTranslation";

export const metadata:Metadata = {
  title: 'Full Auth | Register',
  description: 'Full Auth register page',
}

export default function Page() {
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
            {t('titleRegister')}
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <RegisterForm />

          <p className="mt-4 text-center text-sm/6 text-gray-500 dark:text-gray-400">
            {t('alreadyAccount')}{' '}
            <Link
              href="/auth/login/"
              className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              {t('loginLink')}
            </Link>
          </p>
        </div>
      </div>
  );
}
