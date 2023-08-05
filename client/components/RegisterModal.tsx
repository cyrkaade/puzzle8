'use client';

import axios from "axios";
import { AiFillGithub } from "react-icons/ai";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { 
  FieldValues, 
  SubmitHandler,
  useForm
} from "react-hook-form";

import useLoginModal from "../hooks/useLoginModal";
import useRegisterModal from "../hooks/useRegisterModal";
import { useTranslation } from 'next-i18next';

import Modal from "./Modal";
import Input from "./Input";
import Heading from "./Heading";
import Button from "./Button";

const RegisterModal= () => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation('common');
  

  const { 
    register, 
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<FieldValues>({
    defaultValues: {
      username: '',
      email: '',
      password: ''
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios.post('/api/register', data)
    .then(() => {
      toast.success(`${t('registered')}`);
      registerModal.onClose();
      loginModal.onOpen();
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message || JSON.stringify(error));
      }
    })
    .finally(() => {
      setIsLoading(false);
    })
}

  const onToggle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
  }, [registerModal, loginModal])

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title={t('welcome')}
        subtitle={t('create_account')}
      />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="username"
        label={t('username')}
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        label={t('password')}
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  )

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <Button 
        outline 
        label={t('google_continue')}
        icon={FcGoogle}
        onClick={() => signIn('google')} 
      />
      {/* <Button 
        outline 
        label={t('github_continue')}
        icon={AiFillGithub}
        onClick={() => signIn('github')}
      /> */}
      <div 
        className="
          text-neutral-500 
          text-center 
          mt-4 
          font-light
        "
      >
        <p>{t('already')}
          <span 
            onClick={onToggle} 
            className="
              text-neutral-800
              cursor-pointer 
              hover:underline
            "
            > {t('log_in')}</span>
        </p>
      </div>
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title={t('register_title')}
      actionLabel={t('continue')}
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
}

export default RegisterModal;