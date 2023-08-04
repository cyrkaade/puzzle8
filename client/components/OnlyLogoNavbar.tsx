import Link from "next/link";
import { useMediaQuery } from 'react-responsive';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';



const OnlyLogoNavbar = ({
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
    </header>
  );
  
}

export default OnlyLogoNavbar