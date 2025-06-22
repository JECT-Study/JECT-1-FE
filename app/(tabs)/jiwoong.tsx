import { router } from "expo-router";
import { Button, SafeAreaView, View } from "react-native";

export default function Jiwoong() {
  return (
    <SafeAreaView>
      <View>
        <Button title="survey" onPress={() => router.push("/survey")} />
        <Button title="login" onPress={() => router.push("/login")} />
      </View>
    </SafeAreaView>
  );
}
