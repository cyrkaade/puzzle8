import Link from "next/link";
import useRegisterModal from "../../hooks/useRegisterModal";
import { User } from "@prisma/client";
import UserMenu from "./UserMenu";
import { useMediaQuery } from 'react-responsive';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';


interface HeaderProps {
  currentUser?: User | null
}

const Header: React.FC<HeaderProps> = ({
  currentUser,
}) => {
  const { t } = useTranslation('common');
  

  return (
    <header className="flex justify-between items-center w-full mt-5 border-b-2 pb-4 sm:px-4 px-2">
      <Link href="/" className="flex space-x-3 -ml-2">
        <img
          alt="header text"
          src="/reallogo.png"
          className="sm:w-12 sm:h-12 w-8 h-8"
          width={32}
          height={32}
        />
        <h1 className="sm:text-4xl text-2xl font-bold ml-2 tracking-tight">
          sherlck.me
        </h1>
      </Link>
  
      <div className="md:flex hidden mr-12 space-x-6">
        <Link href="/explore" className="hover:underline">{t('explore')}</Link>
        <Link href="/ranked" className="hover:underline">{t('ranked')}</Link>
      </div>
  
      <div className="flex items-center mr-2">
      <UserMenu currentUser={currentUser} />
    </div>
    </header>
  );
  
}

export default Header