// 25.06.30 기준 사용 X

// import { create } from "zustand/react";
//
// type ModalStoreType = {
//   logoutModalState: boolean;
//   action: {
//     setLogoutModalState: (value: boolean) => void;
//   };
// };
//
// const useModalStateStore = create<ModalStoreType>((set) => ({
//   logoutModalState: false,
//   action: {
//     setLogoutModalState: (value: boolean) =>
//       set(() => ({ logoutModalState: value })),
//   },
// }));
//
// // 로그아웃 모달 export
// export const useLogoutModalState = () =>
//   useModalStateStore((state) => state.logoutModalState);
// export const useSetLogoutModalState = () =>
//   useModalStateStore((state) => state.action.setLogoutModalState);
