import { PasswordResetConfirmForm } from '@/components/forms';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Full Auth | Password Reset Confirm',
  description: 'Password reset confirm page',
}

interface PasswordResetConfirmFormProps {
  params: {
    uid: string;
    token: string;
  }
};


export default function Page({ params: { uid, token }}: PasswordResetConfirmFormProps) {
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-white dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Vincima"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
          Reset your Password
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <PasswordResetConfirmForm uid={uid} token={token}/>
      </div>
    </div>
  );
}