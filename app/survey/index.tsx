import { useFunnel } from "@use-funnel/react-navigation-native";

import AfterSurvey from "@/components/survey/AfterSurvey";
import SurveyIntro from "@/components/survey/SurveyIntro";
import SurveyStep from "@/components/survey/SurveyStep";
import { options, questions } from "@/constants/Surveys";

type SurveyResult = {
  step1?: number;
  step2?: number;
  step3?: number;
};

export default function SurveyScreen() {
  const funnel = useFunnel<{
    intro: SurveyResult;
    step1: SurveyResult;
    step2: SurveyResult;
    step3: SurveyResult;
    done: SurveyResult;
  }>({
    id: "survey-app",
    initial: {
      step: "intro",
      context: {},
    },
  });

  const totalQuestions = 3;

  return (
    <funnel.Render
      intro={({ history }) => (
        <SurveyIntro onNext={() => history.push("step1")} />
      )}
      step1={({ history, context }) => (
        <SurveyStep
          question={questions.Q1}
          options={options.Q1}
          onNext={(answerIndex) =>
            history.push("step2", { ...context, step1: answerIndex })
          }
          onBack={() => history.push("step1", context)}
          total={totalQuestions}
          currentStep={1}
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
            history.push("done", { ...context, step3: answerIndex })
          }
          onBack={() => history.push("step2", context)}
          total={totalQuestions}
          currentStep={3}
        />
      )}
      done={({ context, history }) => (
        <AfterSurvey context={context} history={history} />
      )}
    />
  );
}
