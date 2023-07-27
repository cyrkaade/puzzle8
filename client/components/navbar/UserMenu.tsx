'use client';

import { useCallback, useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useMediaQuery } from 'react-responsive';

import useLoginModal from "../../hooks//useLoginModal";
import useRegisterModal from "../../hooks/useRegisterModal";

import MenuItem from "./MenuItem";
import { User } from "@prisma/client";
import Avatar from "../Avatar";
import Cookies from 'js-cookie';
import { useTranslation } from 'next-i18next';




interface UserMenuProps {
    currentUser?: User | null
  }

  const UserMenu: React.FC<UserMenuProps> = ({
    currentUser
  }) => {
  const router = useRouter();

  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();

  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);
  const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 768px)' });

  const { t, i18n } = useTranslation('common');
  const changeLanguage = () => {
    const currentPath = router.asPath;
    const currentLocale = router.locale;
    const defaultLocale = router.defaultLocale;
    
    const newPath = currentPath.replace(`/${currentLocale}/`, '/');
    
    if (currentLocale === 'en') {
      i18n.changeLanguage('ru');
      router.push(newPath, newPath, { locale: 'ru' });
    } else {
      i18n.changeLanguage('en');
      router.push(newPath, newPath, { locale: 'en' });
    }
  };
  
  
  

  return ( 
    
    <div className="relative">
      <div className="flex flex-row items-center gap-3 w-[200px] justify-end">

        <div 
        onClick={toggleOpen}
        className="
          p-4
          md:py-1
          md:px-2
          border-[1px] 
          border-neutral-200 
          flex 
          flex-row 
          items-center 
          gap-3 
          rounded-full 
          cursor-pointer 
          hover:shadow-md 
          transition
          "
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            <Avatar src={currentUser?.image} />
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="
            absolute 
            rounded-xl 
            shadow-md
            w-[40vw]
            md:w-3/4 
            bg-white 
            overflow-hidden 
            right-0 
            top-12 
            text-sm
          "
        >
          <div className="flex flex-col cursor-pointer">
            {currentUser ? (
              <>
                {!isDesktopOrLaptop && 
                  <>
                    <MenuItem
                    label={t('explore')}
                    onClick={() => router.push('/explore')}
                  />
                  <hr />
                  <MenuItem
                    label={t('ranked')}
                    onClick={() => router.push('/ranked')}
                  />
                  <hr />
                  </>
                }

                <MenuItem 
                  label={i18n.language === 'en' ? 'Language: EN' : 'Язык: RU'} 
                  onClick={changeLanguage}
                />

                <MenuItem 
                  label={t('favorites')} 
                  onClick={() => router.push('/favorites')}
                />
                <hr />
                <MenuItem 
                  label={t('logout')} 
                  onClick={() => signOut()}
                />
                <hr />
              </>
            ) : (
              <>
                <MenuItem 
                  label={i18n.language === 'en' ? 'Language: EN' : 'Язык: RU'} 
                  onClick={changeLanguage}
                />
                <MenuItem 
                  label={t('login_title')} 
                  onClick={loginModal.onOpen}
                />
                <MenuItem 
                  label={t('signup')}  
                  onClick={registerModal.onOpen}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
 
export default UserMenu;