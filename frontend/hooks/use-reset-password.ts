import { useState, ChangeEvent, FormEvent } from "react";
import { useResetPasswordMutation } from "@/redux/features/authApiSlice";
import { toast } from "react-toastify";
import { useTypedTranslation } from "@/i18n/useTypedTranslation";

export default function useResetPassword() {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [email, setEmail] = useState('');

  const t = useTypedTranslation('forms');

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    resetPassword(email)
      .unwrap()
      .then(() => {
        toast.success(t('requestSent'));  //('Request sent, check your email for reset link');
      })
      .catch(() => {
        toast.error(t('failedRequest')); //('Failed to send request');
      });
  };
  
  return {
    email, 
    isLoading,
    onChange,
    onSubmit,
  };
}