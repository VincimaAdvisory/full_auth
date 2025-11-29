'use client';

import { useResetPassword } from "@/hooks";
import  { Form } from "@/components/forms";
import { useTypedTranslation } from "@/i18n/useTypedTranslation";

export default function PasswordResetForm() {
  const { email, isLoading, onChange, onSubmit } = useResetPassword();

  const t = useTypedTranslation("forms");
  
  const config = [
    {
      labelText: t('emailAddress'), //'Email address',
      labelId: 'email',
      type: 'email',
      placeholder: '<example@domain.com>',
      value: email,
      required: true
    },
  ];
  
  return (
    <Form
      config={config}
      isLoading={isLoading}
      btnText={t('buttonResetPassword')} //'Reset Password'
      onChange={onChange}
      onSubmit={onSubmit}
    />
  );
}