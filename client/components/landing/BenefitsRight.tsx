import Image from "next/image";
import React from "react";
import Container from "./Container";
import TestRanked from "./TestRanked";

const BenefitsRight = (props:any) => {
  
  const { data } = props;
  return (
    <>
      <Container className="flex flex-wrap lg:gap-10 lg:flex-nowrap mt-[-20]">
        <div
          className={`flex items-center justify-center w-full lg:w-1/2 ${
            props.imgPos === "right" ? "lg:order-1" : ""
          }`}>
          <div className="w-full bg-orange-200 p-8 rounded-xl shadow-lg">
            <TestRanked/>
          </div>
        </div>

        <div
          className={`flex flex-wrap items-center w-full lg:w-1/2 ${
            data.imgPos === "right" ? "lg:justify-end" : ""
          }`}>
          <div>
            <div className="flex flex-col w-full mt-4">
              <h3 className="max-w-2xl mt-3 text-3xl font-bold leading-snug tracking-tight text-gray-800 lg:leading-tight lg:text-4xl dark:text-white">
                {data.title}
              </h3>

              <p className="max-w-2xl py-4 text-lg leading-normal text-gray-500 lg:text-xl xl:text-xl dark:text-gray-300">
                {data.desc}
              </p>
            </div>

            <div className="w-full mt-5">
              {data.bullets.map((item: any, index: any) => (
                <BenefitRight key={index} title={item.title} icon={item.icon}>
                  {item.desc}
                </BenefitRight>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

function BenefitRight(props: any) {
  return (
    <>
      <div className="flex items-start mt-8 space-x-3">
        <div className="flex items-center justify-center flex-shrink-0 mt-1 bg-indigo-500 rounded-md w-11 h-11 ">
          {React.cloneElement(props.icon, {
            className: "w-7 h-7 text-indigo-50",
          })}
        </div>
        <div>
          <h4 className="text-xl font-medium text-gray-800 dark:text-gray-200">
            {props.title}
          </h4>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            {props.children}
          </p>
        </div>
      </div>
    </>
  );
}

export default BenefitsRight;