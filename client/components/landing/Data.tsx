import {
    FaceSmileIcon,
    ChartBarSquareIcon,
    CursorArrowRaysIcon,
    DevicePhoneMobileIcon,
    AdjustmentsHorizontalIcon,
    SunIcon,
  } from "@heroicons/react/24/solid";
  
  const yellowIconStyle = { backgroundColor: "#FBBF24", padding: "5px", borderRadius: "5px",border: "none"};

  export const getBenefitsData = (t: any) => {
    const benefitOne = {
      title: t("benefitOne.title"),
      desc: t("benefitOne.desc"),
      image: "/reallogo.png",
      bullets: [
        {
          title: t("benefitOne.bullets.haveFun.title"),
          desc: t("benefitOne.bullets.haveFun.desc"),
          icon: (
            <div style={yellowIconStyle}>
              <FaceSmileIcon />
            </div>
          ),
        },
        {
          title: t("benefitOne.bullets.improveThinking.title"),
          desc: t("benefitOne.bullets.improveThinking.desc"),
          icon: (<div style={yellowIconStyle}><ChartBarSquareIcon /></div>),
        },
        {
          title: t("benefitOne.bullets.easyToUse.title"),
          desc: t("benefitOne.bullets.easyToUse.desc"),
          icon: (<div style={yellowIconStyle}><CursorArrowRaysIcon /></div>),
        },
      ],
    };
  
    const benefitTwo = {
      title: t("benefitTwo.title"),
      desc: t("benefitTwo.desc"),
      image: "/reallogo.png",
      bullets: [
        {
          title: t("benefitTwo.bullets.mobileResponsive.title"),
          desc: t("benefitTwo.bullets.mobileResponsive.desc"),
          icon: (<div style={yellowIconStyle}><DevicePhoneMobileIcon /></div>),
        },
        {
          title: t("benefitTwo.bullets.poweredByAI.title"),
          desc: t("benefitTwo.bullets.poweredByAI.desc"),
          icon: (<div style={yellowIconStyle}><AdjustmentsHorizontalIcon /></div>),
        },
        {
          title: t("benefitTwo.bullets.makeFutureBrighter.title"),
          desc: t("benefitTwo.bullets.makeFutureBrighter.desc"),
          icon: (<div style={yellowIconStyle}><SunIcon /></div>),
        },
      ],
    };
  
    return { benefitOne, benefitTwo };
  };

  
  // const benefitOne = {
  //   title: "Generate unlimited amount of puzzles",
  //   desc: "You can generate unique puzzles based on your interests and tastes.",
  //   image: "/reallogo.png",
  //   bullets: [
  //     {
  //       title: "Have fun",
  //       desc: "You can call your friends and try to solve challenging puzzles together.",
  //       icon: (
  //         <div style={yellowIconStyle}>
  //         <FaceSmileIcon />
  //       </div>
  //       ), 
  //     },
  //     {
  //       title: "Improve critical-thinking skills",
  //       desc: "Puzzles can increase your ability to think faster and make correct decisions.",
  //       icon: (<div style={yellowIconStyle}><ChartBarSquareIcon/></div>),
  //     },
  //     {
  //       title: "Easy to use",
  //       desc: "Dashboard, generate and ranked pages - all you need here.",
  //       icon: (<div style={yellowIconStyle}><CursorArrowRaysIcon/></div>),
  //     },
  //   ],
  // };
  
  // const benefitTwo = {
  //   title: "Compete with other users in the world",
  //   desc: "Solve the puzzles in real time, get right answer and raise your rating in the application. Check your answers until timer stops.",
  //   image: "/reallogo.png",
  //   bullets: [
  //     {
  //       title: "Mobile Responsive Application",
  //       desc: "Sherlck is designed as a mobile first responsive web app.",
  //       icon: (<div style={yellowIconStyle}><DevicePhoneMobileIcon/></div>),
  //     },
  //     {
  //       title: "Powered by AI",
  //       desc: "This application is powered by latest technologies and tools, so you don't need to worry about puzzles' creativeness and uniqueness.",
  //       icon: (<div style={yellowIconStyle}><AdjustmentsHorizontalIcon/></div>),
  //     },
  //     {
  //       title: "Make your future brighter.",
  //       desc: "By solving puzzles you can increase your intellegence and after time your sharp mind will help you anyway.",
  //       icon: (<div style={yellowIconStyle}><SunIcon/></div>),
  //     },
  //   ],
  // };
  
  
  // export {benefitOne, benefitTwo};