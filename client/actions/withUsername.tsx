import { useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ExtendedUser, ExtendedSession } from '../types/next-auth';
import { NextPage } from 'next';

export default function withUsername(Component: NextPage<any, any>) {
  return function ProtectedRoute(props: any) {
    const { data: session, status } = useSession() as { data: ExtendedSession | null, status: string };
    const router = useRouter();

    useEffect(() => {
      if (status === 'loading') return;

      if (session) {
        const extendedUser = session?.user;
        if (!extendedUser?.isUsernameSet) {
          router.push('/set-username'); 
        }
      }
    }, [session, status, router]);

    if (status === 'loading') {
      return null;
    }

    return <Component {...props} />;
  }
}