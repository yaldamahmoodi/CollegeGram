import React, { useState } from "react";
import CheckIcon from "@assets/icons/check.svg";
import StepIcon from "@assets/icons/step.svg";
import Button from "@components/Button";

type Step = {
    title: string;
    content: React.ReactNode;
};

type StepperProps = {
    steps: Step[];
    currentStep?: number;
    onStepChange?: (step: number) => void;
    callbackHandler?: () => void;
    handlePostSubmit?: () => void;
};

const Stepper: React.FC<StepperProps> = ({
                                             steps,
                                             currentStep: controlledStep,
                                             onStepChange,
                                             callbackHandler,
                                             handlePostSubmit,
                                         }) => {
    const [internalStep, setInternalStep] = useState(0);
    const currentStep = controlledStep ?? internalStep;

    const setStep = (step: number) => {
        if (onStepChange) onStepChange(step);
        else setInternalStep(step);
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-8">
            <div className="flex items-center justify-center mb-6 mr-[20px]">
                {steps.map((step, index) => {
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep;

                    return (
                        <div
                            key={index}
                            className="flex-1 last:flex-none flex flex-col items-center"
                        >
                            <div className="flex items-center w-full">
                                <div
                                    className={`
                    w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all
                    ${
                                        isActive
                                            ? "bg-white border-black"
                                            : isCompleted
                                                ? "bg-black border-black"
                                                : "bg-white border-gray-300"
                                    }
                  `}
                                >
                                    {isActive ? (
                                        <img
                                            className="w-auto h-[8px] no-repeat"
                                            src={StepIcon}
                                            alt="step icon"
                                        />
                                    ) : isCompleted ? (
                                        <img
                                            className="w-auto h-[12px] no-repeat"
                                            src={CheckIcon}
                                            alt="check icon"
                                        />
                                    ) : null}
                                </div>

                                {index < steps.length - 1 && (
                                    <div
                                        className={`flex-1 h-1 ${
                                            isCompleted ? "bg-black" : "bg-gray-300"
                                        }`}
                                    />
                                )}
                            </div>

                            <span
                                className={`
                  mt-2 text-md self-start mr-4
                  ${
                                    isActive || isCompleted
                                        ? "font-bold text-black"
                                        : "text-gray-400"
                                }
                `}
                            >
                {step.title}
              </span>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 min-h-[250px]">{steps[currentStep].content}</div>

            {controlledStep === undefined && (
                <div className="flex justify-end items-center mt-6 w-full gap-4">
                    <a
                        className="text-gray-700 cursor-pointer"
                        onClick={() => callbackHandler?.()}
                    >
                        پشیمون شدم
                    </a>

                    {currentStep !== steps.length - 1 ? (
                        <Button
                            variant="danger"
                            label="بعدی"
                            onClick={() =>
                                setStep(Math.min(steps.length - 1, currentStep + 1))
                            }
                        />
                    ) : (
                        <Button
                            variant="danger"
                            label="ثبت تغییرات"
                            onClick={() => handlePostSubmit?.()}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default Stepper;
