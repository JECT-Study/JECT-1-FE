import { useRouter } from "expo-router";

import { ROUTES } from "@/constants/Routes";

export default function usePageNavigation() {
  const router = useRouter();
  return {
    goEditProfile() {
      router.push(ROUTES.MY.EDIT_PROFILE);
    },
    goLike() {
      router.push(ROUTES.MY.LIKE);
    },
    goTerms() {
      router.push(ROUTES.MY.TERMS);
    },
    goWithdrawal() {
      router.push(ROUTES.MY.WITHDRAWAL);
    },
    goHome() {
      router.push(ROUTES.HOME);
    },
    goSearch() {
      router.push(ROUTES.SEARCH);
    },
    goSchedule() {
      router.push(ROUTES.SCHEDULE);
    },
  };
}
