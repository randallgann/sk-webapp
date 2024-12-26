import {
  GIRL_1_IMAGE,
  GIRL_2_IMAGE,
  GIRL_3_IMAGE,
  GIRL_4_IMAGE,
  GIRL_5_IMAGE,
} from "./images";

import {
  Squares2X2Icon,
  PresentationChartLineIcon,
  CalendarIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  UsersIcon,
  BellIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

export const threads = [
  {
    threadId: 1,
    name: "Random James",
    shortName: "A",
    isOnline: true,
    avatar: GIRL_2_IMAGE,
    isReaded: true,
  },
  {
    threadId: 2,
    name: "John Doe",
    shortName: "B",
    isOnline: false,
    avatar: GIRL_1_IMAGE,
    isReaded: false,
  },
  {
    threadId: 3,
    name: "Bob Spinkler",
    shortName: "C",
    isOnline: false,
    avatar: null,
    isReaded: false,
  },
  {
    threadId: 4,
    name: "Column Martin",
    shortName: "B",
    isOnline: true,
    avatar: GIRL_5_IMAGE,
    isReaded: true,
  },
  {
    threadId: 5,
    name: "Random James",
    shortName: "A",
    isOnline: true,
    avatar: GIRL_2_IMAGE,
    isReaded: true,
  },
  {
    threadId: 6,
    name: "John Doe",
    shortName: "B",
    isOnline: false,
    avatar: GIRL_1_IMAGE,
    isReaded: false,
  },
  {
    threadId: 7,
    name: "Bob Spinkler",
    shortName: "C",
    isOnline: false,
    avatar: null,
    isReaded: false,
  },
  {
    threadId: 8,
    name: "Column Martin",
    shortName: "B",
    isOnline: true,
    avatar: GIRL_5_IMAGE,
    isReaded: true,
  },
  {
    threadId: 9,
    name: "Random James",
    shortName: "A",
    isOnline: true,
    avatar: GIRL_2_IMAGE,
    isReaded: true,
  },
  {
    threadId: 10,
    name: "John Doe",
    shortName: "B",
    isOnline: false,
    avatar: GIRL_1_IMAGE,
    isReaded: false,
  },
  {
    threadId: 11,
    name: "Bob Spinkler",
    shortName: "C",
    isOnline: false,
    avatar: null,
    isReaded: false,
  },
  {
    threadId: 12,
    name: "Column Martin",
    shortName: "B",
    isOnline: true,
    avatar: GIRL_5_IMAGE,
    isReaded: true,
  },
];

export const menuItems = [
  {
    id: 'chat',
    child: <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6" />,
    active: true,
    showOnMobile: true,
  },
  // {
  //   id: 'home',
  //   child: <Squares2X2Icon className="w-6 h-6" />,
  //   active: false,
  //   showOnMobile: false,
  // },
  // {
  //   id: 'chart',
  //   child: <PresentationChartLineIcon className="w-6 h-6" />,
  //   active: false,
  //   showOnMobile: false,
  // },
  // {
  //   id: 'calendar',
  //   child: <CalendarIcon className="w-6 h-6" />,
  //   active: false,
  //   showOnMobile: true,
  // },
  // {
  //   id: 'users',
  //   child: <UsersIcon className="w-6 h-6" />,
  //   active: false,
  //   showOnMobile: true,
  // },
];

export const settingMenuItems = [
  // {
  //   id: 'notifications',
  //   child: <BellIcon className="w-6 h-6" />,
  //   active: false,
  //   showOnMobile: false,
  // },
  // {
  //   id: 'settings',
  //   child: <Cog6ToothIcon className="w-6 h-6" />,
  //   active: false,
  //   showOnMobile: true,
  // },
];
