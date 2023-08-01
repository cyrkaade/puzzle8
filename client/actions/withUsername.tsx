import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ExtendedSession } from '../types/next-auth';
import { NextPage } from 'next';
import { parseCookies } from 'nookies';
import Cookies from 'js-cookie';

export default function withUsername(Component: NextPage<any, any>) {
  return function ProtectedRoute(props: any) {
    const { data: session, status } = useSession() as { data: ExtendedSession | null, status: string };
    const router = useRouter();

    useEffect(() => {
      if (status === 'loading') return;
    
      const username = Cookies.get('username');
      if (!username) {
        router.push('/set-username'); 
      }
    }, [status, router]);

    if (status === 'loading') {
      return null;
    }

    return <Component {...props} />;
  }
}