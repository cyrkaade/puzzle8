import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession, signIn, getSession } from 'next-auth/react'; 
import { User } from 'next-auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../@/components/ui/card"
import { Input } from '../@/components/ui/input';
import { Label } from '../@/components/ui/label';
import { Button } from '../@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';


export default function SetUsername() {
  const { t } = useTranslation('common');

  const { data: session } = useSession();
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // introduce loading state
  const router = useRouter();

  const handleSubmit = async (e:any) => {
    e.preventDefault();
  
    if (session) {
      const user = session.user as User;
  
      if (!/^[a-z0-9]{4,16}$/.test(username)) {
        setMessage(`${t('warning')}`);
        return;
      }
  
      try {
        setLoading(true);
        const response = await fetch('/api/setUsername', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, username }),
        });
  
        if (response.ok) {
          // @ts-ignore
          signIn(session.user.provider, { callbackUrl: '/', redirect: false });
          await getSession();
          router.push('/');
        } else {
          const { message } = await response.json();
          setMessage(message);
        }
      } catch (error) {
        console.error(error);
        setMessage('Unexpected error, please try again');
      } finally {
        setLoading(false);
      }
    }
  };
  
  

  return (
    <div className="flex justify-center items-center min-h-screen px-4 sm:px-6 lg:px-8">
      {session && 
        <Card className="w-full sm:w-96">
          <CardHeader>
            <CardTitle>{t('username_choose')}</CardTitle>
            <CardDescription>{t('username_description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="username">{t('username')}</Label>
                  <Input id="username" 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  required/>
                </div>
                <div>
                  <Button type='submit' className='bg-primary text-white'>{t('save')}</Button>
                </div>
                {message && <p>{message}</p>}
                {loading && <span className="loading loading-dots loading-lg"></span>} {/* show loading when loading is true */}
              </div>
            </form>
          </CardContent>
        </Card>
      }
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale as string, ['common']),
    locale,
  },
});