import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { signIn } from 'next-auth/react';
import { 
  FieldValues, 
  SubmitHandler, 
  useForm
} from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import { useRouter } from "next/router";
import { useTranslation } from 'next-i18next';

import Input from "../components/Input";
import Heading from "../components/Heading";
import Button from "../components/Button";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const LoginPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation('common');

  useEffect(() => {
    fetch('/api/currentUser')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {

          router.push('/home');
        }
      });
  }, []);

  const { 
    register, 
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      password: ''
    },
  });
  
  const onSubmit: SubmitHandler<FieldValues> = 
  (data) => {
    setIsLoading(true);

    signIn('credentials', { 
      ...data, 
      redirect: false,
    })
    .then((callback) => {
      setIsLoading(false);

      if (callback?.ok) {
        toast.success(`${t('logged')}`);
        router.push('/home');
      }
      
      if (callback?.error) {
        toast.error(callback.error);
      }
    });
  }

  return (
    <div className="bg-white min-h-screen flex justify-center items-center">
      <div className="flex flex-col max-w-2xl w-full p-8 bg-white border border-gray-200 shadow-lg rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Heading
            title={t('welcome_back')}
            subtitle={t('logindirect')}
          />
          <div className="flex flex-col gap-3 mb-3">
            <Input
              id="email"
              label="Email"
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
          <Button 
            label={t('continue')} 
            //@ts-ignore
            type="submit"
            className="mt-4"
            loading={isLoading}
          />
          <div className="flex flex-col gap-4 mt-3">
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
          </div>
          <div className="text-neutral-500 text-center mt-4 font-light">
            <p>{t('first_time')}
              <span 
                onClick={() => router.push('/register')} 
                className="text-neutral-800 cursor-pointer hover:underline"
              > {t('create_account')}</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
      ...await serverSideTranslations(locale as string, ['common']),
      locale,
    },
  });
    

export default LoginPage;
