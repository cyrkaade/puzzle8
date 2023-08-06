import axios from "axios";
import { AiFillGithub } from "react-icons/ai";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { SubmitHandler, UseFormRegister, useForm } from "react-hook-form";
import { useTranslation } from 'next-i18next';
import { useRouter } from "next/router";

import Input from "../components/Input";
import Heading from "../components/Heading";
import Button from "../components/Button";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

type FormData = {
    username: string;
    email: string;
    password: string;
  };

  

  const RegisterPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation('common');
    const router = useRouter();
  
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<FormData>({
      defaultValues: {
        username: '',
        email: '',
        password: ''
      },
    });

    useEffect(() => {
        fetch('/api/currentUser')
          .then((res) => res.json())
          .then((data) => {
            if (data.user) {

              router.push('/home');
            }
          });
      }, []);
  
    const onSubmit: SubmitHandler<FormData> = (data) => {
      setIsLoading(true);
  
      axios.post('/api/register', {...data, locale: router.locale})
      .then(() => {
        toast.success(`${t('registered')}`);
        router.push('/login');
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

  return (
    <>
<Toaster
  position="top-right"
  reverseOrder={false}
  toastOptions={{
    // Define default options
    style: {
      margin: '40px',
      background: '#363636',
      color: '#fff',
      zIndex: 1,
    },
    duration: 5000,
    success: {
      // Override options for success toasts
      style: {
        background: 'green',
        color: 'black',
      },
      duration: 3000,
    },
  }}
/>
    <div className="bg-white min-h-screen flex justify-center items-center">
      <div className="flex flex-col max-w-2xl w-full p-8 bg-white border border-gray-200 shadow-lg rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Heading
            title={t('welcome')}
            subtitle={t('create_account')}
          />
          <div className="flex flex-col gap-3 mb-3">
            <Input
              id="email"
              label="Email"
              disabled={isLoading}
              //@ts-ignore
              register={register}
              errors={errors}
              required
            />
            <Input
              id="username"
              label={t('username')}
              disabled={isLoading}
              //@ts-ignore
              register={register}
              errors={errors}
              required
            />
            <Input
              id="password"
              label={t('password')}
              type="password"
              disabled={isLoading}
              //@ts-ignore
              register={register}
              errors={errors}
              required
            />
          </div>
          
          <Button
          //@ts-ignore
            type="submit"
            label={t('continue')}
            className="mt-4"
            loading={isLoading}
          />
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
            <div className="text-neutral-500 text-center mt-4 font-light">
              <p>{t('already')}
                <span 
                  onClick={() => router.push('/login')} 
                  className="text-neutral-800 cursor-pointer hover:underline"
                > {t('log_in')}</span>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
      ...await serverSideTranslations(locale as string, ['common']),
      locale,
    },
  });
    


export default RegisterPage;
