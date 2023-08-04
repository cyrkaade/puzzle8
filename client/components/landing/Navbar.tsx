import Link from "next/link";
import ThemeChanger from "./DarkSwitch";
import Image from "next/image"
import { Disclosure } from "@headlessui/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import useRegisterModal from "../../hooks/useRegisterModal";
import { useCallback, useState } from "react";

const Navbar = () => {
  const registerModal = useRegisterModal();
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);
  const { t, i18n } = useTranslation();
  const router = useRouter();
  
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
    <div className="w-full">
      <nav className="container relative flex flex-wrap items-center justify-between p-8 mx-auto lg:justify-between xl:px-0">

        <Disclosure>
          {({ open }) => (
            <>
              <div className="flex flex-wrap items-center justify-between w-full lg:w-auto">
                <Link href="/">
                  <span className="flex items-center space-x-2 text-2xl font-medium text-black dark:text-gray-100">
                    <span>
                      <Image
                        src="/reallogo.png"
                        alt="N"
                        width="32"
                        height="32"
                        className="w-8"
                      />
                    </span>
                    <span>sherlck.</span>
                  </span>
                </Link>

                <Disclosure.Button
                  aria-label="Toggle Menu"
                  className="px-2 py-1 ml-auto text-gray-500 rounded-md lg:hidden hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:text-gray-300 dark:focus:bg-trueGray-700">
                  <svg
                    className="w-6 h-6 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24">
                    {open && (
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                      />
                    )}
                    {!open && (
                      <path
                        fillRule="evenodd"
                        d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                      />
                    )}
                  </svg>
                </Disclosure.Button>

                <Disclosure.Panel className="flex flex-col w-full my-5 lg:hidden">
                <button
                  className="px-3 py-1 mb-3 text-gray-500 border border-gray-500 rounded-md hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:text-gray-300 dark:focus:bg-trueGray-700"
                  onClick={changeLanguage}
                >
                  {i18n.language === 'en' ? 'Language: EN' : 'Язык: RU'}
                </button>
                <button onClick={registerModal.onOpen} className="w-full px-6 py-2 text-center text-white bg-yellow-800 rounded-md lg:ml-5">
                  {t('joining')}
                </button>
              </Disclosure.Panel>
              </div>
            </>
          )}
        </Disclosure>

        <div className="hidden mr-3 space-x-4 lg:flex nav__item">
          <button
            className="px-3 py-1 mr-3 text-gray-500 border border-gray-500 rounded-md hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:text-gray-300 dark:focus:bg-trueGray-700"
            onClick={changeLanguage}
          >
            {i18n.language === 'en' ? 'Language: EN' : 'Язык: RU'}
          </button>
          <button onClick={registerModal.onOpen}  className="px-6 py-2 text-white bg-yellow-800 rounded-md md:ml-5">
          {t('joining')}
          </button>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;