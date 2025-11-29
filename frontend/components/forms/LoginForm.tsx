'use client';

import { useLogin } from "@/hooks";
import { Form } from '@/components/forms';
import { useTypedTranslation } from "@/i18n/useTypedTranslation";

export default function LoginForm() {
  const {
    email,
    password,
    isLoading,
    onChange,
    onSubmit,
  } = useLogin();

  const t = useTypedTranslation("forms")

  const config = [
    {
      labelText: t('emailAddress'), // 'Email address',
      labelId: 'email',
      type: 'email',
      placeholder: '<email@domain.com>',
      value: email,
      required: true
    },
    {
      labelText: t('password'), //Password',
      labelId: 'password',
      type: 'password',
      placeholder: `<${t('password')}>`,
      value: password,
      link:{
        linkText: t('forgotPassword'), //'Forgot password?',
        linkUrl: '/password-reset'
      },
      required: true
    },
  ];

  return (
    <Form
      config={config}
      isLoading={isLoading}
      btnText={t("buttonLogIn")} //'Sign in'
      onChange={onChange}
      onSubmit={onSubmit}
    />
  )
}