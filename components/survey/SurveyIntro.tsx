import SurveyBalloon from "@/components/survey/SurveyBalloon";

export default function SurveyIntro({ onNext }: { onNext: () => void }) {
  return <SurveyBalloon type="INTRO" onNext={() => console.log("test")} />;
}
