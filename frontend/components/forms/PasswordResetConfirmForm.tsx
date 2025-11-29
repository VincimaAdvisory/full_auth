'use client';

import { useResetPasswordConfirm } from "@/hooks";
import  { Form } from "@/components/forms";
import { useTypedTranslation } from "@/i18n/useTypedTranslation";


interface PasswordResetConfirmFormProps {
  uid: string;
  token: string;
}

export default function PasswordResetConfirmForm({
  uid,
  token
}: PasswordResetConfirmFormProps) {
  const { new_password, re_new_password, isLoading, onChange, onSubmit } = useResetPasswordConfirm(uid, token);

  const t = useTypedTranslation("forms");
  
  const config = [
  {
      labelText: t('password'),
      labelId: 'new_password',
      type: 'password',
      placeholder: '<Password, minimal 8 characters>',
      value: new_password,
      required: true
    },
    {
      labelText: t('confirmPassword'), //'Confirm Password',
      labelId: 're_new_password',
      type: 'password',
      placeholder: '<Retype your password>',
      value: re_new_password,
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