import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { useLoginMutation } from "@/redux/features/authApiSlice";
import { setAuth } from "@/redux/features/authSlice";
import { useTypedTranslation } from "@/i18n/useTypedTranslation";
import { toast } from "react-toastify";

export default function useLogin() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const t = useTypedTranslation('forms');

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    
    setFormData({...formData, [name]: value });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    login({ email, password })
      .unwrap()
      .then(() => {
        dispatch(setAuth());
        toast.success(t('loginSuccess'));  //('Succesfully Logged in');
        router.push('/dashboard');
      })
      .catch(() => {
        toast.error(t('loginFailed'));  //('Failed to log in.');
      });
  };

  return {
    email, 
    password, 
    isLoading,
    onChange,
    onSubmit,
  };

}