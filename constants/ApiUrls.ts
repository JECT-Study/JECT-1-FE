import Constants from "expo-constants";

export const BACKEND_URL = Constants.expoConfig?.extra?.BACKEND_URL;

// Search
export const SearchUrl = `${BACKEND_URL}/search`;
export const SearchResultUrl = `${BACKEND_URL}/search/result`;
export const SearchRecentUrl = `${BACKEND_URL}/search/recent`;

// MyPage
export const UsersFavoriteUrl = `${BACKEND_URL}/users/favorites`;

// /users/favorites?page=0&limit=10&category = “FESTIVAL
