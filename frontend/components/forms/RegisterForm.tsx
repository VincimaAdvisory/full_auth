'use client';

import { useRegister } from "@/hooks";
import { Form } from '@/components/forms';
import { useTypedTranslation } from "@/i18n/useTypedTranslation";

export default function RegisterForm() {
  const {
    first_name,
    last_name,
    email,
    password,
    re_password,
    isLoading,
    onChange,
    onSubmit,
  } = useRegister();

  const t = useTypedTranslation("forms")

  const config = [
    {
      labelText: t('firstName'), //'First Name',
      labelId: 'first_name',
      type: 'text',
      placeholder: '<Your first name>',
      value: first_name,
      required: true
    },
    {
      labelText: t('lastName'), //'Last Name',
      labelId: 'last_name',
      type: 'text',
      placeholder: '<Your last name>',
      value: last_name,
      required: true
    },
    {
      labelText: t('emailAddress'), //'Email address',
      labelId: 'email',
      type: 'email',
      placeholder: '<example@domain.com>',
      value: email,
      required: true
    },
    {
      labelText: t('password'),
      labelId: 'password',
      type: 'password',
      placeholder: '<Password, minimal 8 characters>',
      value: password,
      required: true
    },
    {
      labelText: t('confirmPassword'), //'Confirm Password',
      labelId: 're_password',
      type: 'password',
      placeholder: '<Retype your password>',
      value: re_password,
      required: true
    },
  ];

  return (
    <Form
      config={config}
      isLoading={isLoading}
      btnText={t('buttonSignUp')}
      onChange={onChange}
      onSubmit={onSubmit}
    />
  )
}