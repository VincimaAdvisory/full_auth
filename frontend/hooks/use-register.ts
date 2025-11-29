import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "@/redux/features/authApiSlice";
import { useTypedTranslation } from "@/i18n/useTypedTranslation";
import { toast } from "react-toastify";

export default function useRegister() {
  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation();
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    re_password: '',
  });

  const { first_name, last_name, email, password, re_password } = formData;

  const t = useTypedTranslation('forms');

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    
    setFormData({...formData, [name]: value });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    register({ first_name, last_name, email, password, re_password  })
      .unwrap()
      .then(() => {
        toast.success(t('checkEmailActivateAccount'));  //('Please check your email to verify account');
        router.push('/auth/login');
      })
      .catch(() => {
        toast.error(t('failedRegistration')); //('Failed to register account. Please contact admin.');
      });
  };

  return {
    first_name, 
    last_name, 
    email, 
    password, 
    re_password,
    isLoading,
    onChange,
    onSubmit,
    };

}