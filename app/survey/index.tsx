import { useState } from "react";

import { useFunnel } from "@use-funnel/react-navigation-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import SurveyBalloon from "@/components/survey/SurveyBalloon";
import SurveyStep from "@/components/survey/SurveyStep";
import CommonModal from "@/components/ui/CommonModal";
import { options, questions } from "@/constants/Surveys";
import { authApi } from "@/features/axios/axiosInstance";

interface SurveyResult {
  step1?: number;
  step2?: number;
  step3?: number;
  step4?: number;
  step5?: number;
  step6?: number;
}

const totalQuestions = 6;

export default function SurveyScreen() {
  const [showExitAlert, setShowExitAlert] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const funnel = useFunnel<{
    intro: SurveyResult;
    step1: SurveyResult;
    step2: SurveyResult;
    step3: SurveyResult;
    step4: SurveyResult;
    step5: SurveyResult;
    step6: SurveyResult;
    done: SurveyResult;
  }>({
    id: "survey-app",
    initial: {
      step: "intro",
      context: {},
    },
  });

  const handleStep6Next = async (
    answerIndex: number,
    context: SurveyResult,
    history: any,
  ) => {
    const newContext = { ...context, step6: answerIndex };

    // 첫 번째 질문의 답변을 region으로 사용
    const region = options.Q1[context.step1 ?? 0];

    const answers = [
      {
        questionId: 1,
        optionId: (context.step2 ?? 0) + 1,
      },
      {
        questionId: 2,
        optionId: (context.step3 ?? 0) + 5,
      },
      {
        questionId: 3,
        optionId: (context.step4 ?? 0) + 9,
      },
      {
        questionId: 4,
        optionId: (context.step5 ?? 0) + 13,
      },
      { questionId: 5, optionId: answerIndex + 17 },
    ];

    const requestBody = {
      region,
      answers,
    };

    console.log("API 전송 데이터:", requestBody);

    // // API 호출
    try {
      const response = await authApi.post("/trait-test", requestBody);

      if (response.data.isSuccess) {
        console.log("설문 제출 성공:", response.data);
        history.push("done", newContext);
      } else {
        throw new Error(response.data.message || "설문 제출 실패");
      }
    } catch (error) {
      console.error("설문 제출 중 오류 발생:", error);
      setShowErrorModal(true);
    }

    // 임시로 done 페이지로 이동
    // history.push("done", newContext);
  };

  return (
    <SafeAreaView className="w-full flex-1 justify-between bg-white">
      <funnel.Render
        intro={({ history }) => (
          <SurveyBalloon type="INTRO" onNext={() => history.push("step1")} />
        )}
        step1={({ history, context }) => (
          <SurveyStep
            question={questions.Q1}
            options={options.Q1}
            onNext={(answerIndex) =>
              history.push("step2", { ...context, step1: answerIndex })
            }
            onBack={() => {
              setShowExitAlert(true);
            }}
            total={totalQuestions}
            currentStep={1}
            dividedOptions={true}
            selectedValue={context.step1}
          />
        )}
        step2={({ history, context }) => (
          <SurveyStep
            question={questions.Q2}
            options={options.Q2}
            onNext={(answerIndex) =>
              history.push("step3", { ...context, step2: answerIndex })
            }
            onBack={() => history.push("step1", context)}
            total={totalQuestions}
            currentStep={2}
            selectedValue={context.step2}
          />
        )}
        step3={({ history, context }) => (
          <SurveyStep
            question={questions.Q3}
            options={options.Q3}
            onNext={(answerIndex) =>
              history.push("step4", { ...context, step3: answerIndex })
            }
            onBack={() => history.push("step2", context)}
            total={totalQuestions}
            currentStep={3}
            selectedValue={context.step3}
          />
        )}
        step4={({ history, context }) => (
          <SurveyStep
            question={questions.Q4}
            options={options.Q4}
            onNext={(answerIndex) =>
              history.push("step5", { ...context, step4: answerIndex })
            }
            onBack={() => history.push("step3", context)}
            total={totalQuestions}
            currentStep={4}
            selectedValue={context.step4}
          />
        )}
        step5={({ history, context }) => (
          <SurveyStep
            question={questions.Q5}
            options={options.Q5}
            onNext={(answerIndex) =>
              history.push("step6", { ...context, step5: answerIndex })
            }
            onBack={() => history.push("step4", context)}
            total={totalQuestions}
            currentStep={5}
            selectedValue={context.step5}
          />
        )}
        step6={({ history, context }) => (
          <SurveyStep
            question={questions.Q6}
            options={options.Q6}
            onNext={(answerIndex) =>
              handleStep6Next(answerIndex, context, history)
            }
            onBack={() => history.push("step5", context)}
            total={totalQuestions}
            currentStep={6}
            selectedValue={context.step6}
          />
        )}
        done={({ context, history }) => (
          <SurveyBalloon type="END" onNext={() => router.push("/(tabs)")} />
        )}
      />

      {/* 설문 종료 확인 모달 */}
      <CommonModal
        visible={showExitAlert}
        onClose={() => setShowExitAlert(false)}
        mainTitle="취향 분석을 그만두시겠어요?"
        subTitle="선택한 내용은 저장되지 않아요."
        cancelText="취소"
        confirmText="확인"
        onCancel={() => setShowExitAlert(false)}
        onConfirm={() => {
          setShowExitAlert(false);
          router.back();
        }}
      />

      {/* 설문 제출 오류 모달 */}
      <CommonModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        mainTitle="설문 제출 실패"
        subTitle="설문 제출 중 오류가 발생했습니다. 다시 시도해주세요."
        showCancelButton={false}
        confirmText="확인"
        onConfirm={() => setShowErrorModal(false)}
      />
    </SafeAreaView>
  );
}
