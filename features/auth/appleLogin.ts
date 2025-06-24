import * as AppleAuthentication from "expo-apple-authentication";

export async function IOSAppleLogin() {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    console.log("credential", credential);
    // TODO : 로그인 로직 반영
  } catch (error) {
    console.log(error);
  }
}

export async function AndroidAppleLogin() {
  console.log("Android Login");
}
