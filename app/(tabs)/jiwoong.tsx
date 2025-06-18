import { useFunnel } from "@use-funnel/react-navigation-native";
import { Button, SafeAreaView, Text, View } from "react-native";

import SurveyStep from "@/components/survey/SurveyStep";
import { options, questions } from "@/constants/Surveys";

type SurveyResult = {
  step1?: number;
  step2?: number;
  step3?: number;
};

export default function SurveyScreen() {
  const funnel = useFunnel<{
    step1: SurveyResult;
    step2: SurveyResult;
    step3: SurveyResult;
    done: SurveyResult;
  }>({
    id: "survey-app",
    initial: {
      step: "step1",
      context: {},
    },
  });

  const totalQuestions = 3;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <funnel.Render
        step1={({ history, context }) => (
          <SurveyStep
            question={questions.Q1}
            options={options.Q1}
            onNext={(answerIndex) =>
              history.push("step2", { ...context, step1: answerIndex })
            }
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
            total={totalQuestions}
            currentStep={3}
          />
        )}
        done={({ history, context }) => (
          <View style={{ padding: 20 }}>
            <Text>🎉 설문 완료!</Text>
            <Text>결과: {JSON.stringify(context)}</Text>
            <Button
              title="처음으로"
              onPress={() => history.replace("step1", {})}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
