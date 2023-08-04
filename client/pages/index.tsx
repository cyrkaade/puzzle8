import Head from "next/head";
import Hero from "../components/landing/Hero";
import Navbar from "../components/landing/Navbar";
import { getBenefitsData } from "../components/landing/Data";
import Benefits from "../components/landing/Benefits";
import Cta from "../components/landing/Cta";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps, NextPage } from "next";
import BenefitsRight from "../components/landing/BenefitsRight";
import { useTranslation } from "next-i18next";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Landing: NextPage = () => {

  const { t } = useTranslation();
  const { benefitOne } = getBenefitsData(t);
  const { benefitTwo } = getBenefitsData(t);
  const router = useRouter()

  useEffect(() => {
    fetch('/api/currentUser')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {

          router.push('/home');
        }
      });
  }, []);

  return (
    <>
      <Head>
        <title>Sherlck - don't let your brain become weak.</title>
        <meta
          name="description"
          content="Nextly is a free landing page template built with next.js & Tailwind CSS"
        />
        <link rel="icon" href="/reallogo.ico" />
      </Head>

      <Navbar />
      <Hero />

      <div className="text-center text-2xl lg:text-3xl font-semibold py-6 bg-gray-100">
        {t('tryout')}

      </div>

      <Benefits data={benefitOne} />
      <BenefitsRight imgPos="right" data={benefitTwo} />
      <Cta />
    </>
  );
}
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale as string, ['common']),
    locale,
  },
});
  
  

export default Landing;