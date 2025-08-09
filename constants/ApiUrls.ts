import Constants from "expo-constants";

const BACKEND_URL = Constants.expoConfig?.extra?.BACKEND_URL;

// Search
export const SearchUrl = `${BACKEND_URL}/search`;
export const SearchResultUrl = `${BACKEND_URL}/search/result`;
export const SearchRecentUrl = `${BACKEND_URL}/search/recent`;

// MyPage
export const UsersFavoriteUrl = `${BACKEND_URL}/users/favorites`;
export const UsersProfileUrl = `${BACKEND_URL}/users/profile`;
export const UsersScheduleUrl = `${BACKEND_URL}/users/schedule`;

// Login
// export const KakaoLoginUrl = `${BACKEND_URL}/auth/social/kakao`;
// export const KakaoLoginCallbackUrl = `${KakaoLoginUrl}/callback`;
const AuthUrl = `${BACKEND_URL}/auth`;
export const LoginUrl = `${AuthUrl}/login`;
export const LogoutUrl = `${AuthUrl}/logout`;
