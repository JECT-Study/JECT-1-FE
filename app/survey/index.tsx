import { useFunnel } from "@use-funnel/react-navigation-native";
import { router } from "expo-router";

import SurveyBalloon from "@/components/survey/SurveyBalloon";
import SurveyStep from "@/components/survey/SurveyStep";
import { options, questions } from "@/constants/Surveys";
import { testerLogin } from "@/features/auth/testerLogin";

type SurveyResult = {
  step1?: number;
  step2?: number;
  step3?: number;
  step4?: number;
  step5?: number;
  step6?: number;
};

export default function SurveyScreen() {
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

  const totalQuestions = 6;

  return (
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
            // step1에서 뒤로가기 시 설문조사 인트로로 이동
            history.push("intro");
          }}
          total={totalQuestions}
          currentStep={1}
          dividedOptions={true}
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
        />
      )}
      step6={({ history, context }) => {
        const handleNext = (answerIndex: number) => {
          try {
            const newContext = { ...context, step6: answerIndex };
            history.push("done", newContext);
          } catch (error) {
            console.error("설문 제출 중 오류 발생:", error);
          }
        };

        return (
          <SurveyStep
            question={questions.Q6}
            options={options.Q6}
            onNext={handleNext}
            onBack={() => history.push("step5", context)}
            total={totalQuestions}
            currentStep={6}
          />
        );
      }}
      done={({ context, history }) => {
        const handleSurveyComplete = async () => {
          try {
            // 테스터 로그인 실행
            await testerLogin();
            // 로그인 성공 후 루트 페이지로 이동
            router.push("/(tabs)");
          } catch (error) {
            console.error("테스터 로그인 중 오류 발생:", error);
            // 에러 발생 시 마이페이지로 이동
            router.push("/my");
          }
        };

        return <SurveyBalloon type="END" onNext={handleSurveyComplete} />;
      }}
    />
  );
}
