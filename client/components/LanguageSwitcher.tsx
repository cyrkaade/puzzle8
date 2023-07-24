import { useRouter } from 'next/router';

function LanguageSwitcher() {
  const router = useRouter();

  const changeLanguage = (language: string) => {
    router.push(router.pathname, router.asPath, { locale: language });
  };

  return (
    <div>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('ru')}>Русский</button>
    </div>
  );
}

export default LanguageSwitcher;