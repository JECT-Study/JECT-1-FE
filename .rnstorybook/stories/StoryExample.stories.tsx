import { StoryExample } from "../../components/StoryExample";

export default {
  title: "StoryExample",
  component: StoryExample,
};

export const Default = () => (
  <StoryExample label="Click me" onPress={() => console.log("Pressed")} />
);

export const Korean = () => (
  <StoryExample label="눌러보세요" onPress={() => console.log("눌림")} />
);
