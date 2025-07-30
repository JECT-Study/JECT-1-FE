import HomeIcon from "@/components/icons/HomeIcon";
import MyIcon from "@/components/icons/MyIcon";
import ScheduleIcon from "@/components/icons/ScheduleIcon";
import SearchIcon from "@/components/icons/SearchIcon";

export const TAB_SCREENS = [
  {
    name: "index",
    title: "홈",
    Icon: HomeIcon,
  },
  {
    name: "search_tab",
    title: "검색",
    Icon: SearchIcon,
  },
  {
    name: "schedule",
    title: "일정",
    Icon: ScheduleIcon,
  },
  {
    name: "my/index",
    title: "마이",
    Icon: MyIcon,
    activePage: "my",
  },
  // 탭 바에 표시되지 않을 화면들
  { name: "my/terms", href: null },
  { name: "my/edit_profile", href: null },
  { name: "my/like", href: null },
  { name: "my/plan", href: null },
];
