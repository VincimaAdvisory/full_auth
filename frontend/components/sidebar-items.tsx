import { JSX } from 'react';
import { Icon } from '@iconify/react';


export type SideNavItem = {
  title: string;
  path: string;
  icon?: JSX.Element;
  submenu?: boolean;
  subMenuItems?: SideNavItem[];
};

export type MenuItemWithSubMenuProps = {
  item: SideNavItem;
  toggleOpen: () => void;
};


export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "dashboard",
    path: '/',
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },
  {
    title: "invoices",
    path: "/projects",
    icon: <Icon icon="lucide:folder" width="24" height="24" />,
    submenu: true,
    subMenuItems:[
      { title: "banks", path: "/projects" },
      { title: "Webdesign", path: "/projects/web-design" },
    ]
  },
  {
    title: 'expenses',
    path: '/messages',
    icon: <Icon icon="lucide:mail" width="24" height="24" />,
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: <Icon icon="lucide:settings" width="24" height="24" />,
    submenu: true,
    subMenuItems: [
      { title: 'Account', path: '/settings/account' },
      { title: 'Privacy', path: '/settings/privacy' },
    ],
  },
  {
    title: 'Help',
    path: '/help',
    icon: <Icon icon="lucide:help-circle" width="24" height="24" />,
  },
];
