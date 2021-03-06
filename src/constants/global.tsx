import {
  // AppstoreOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';

interface MenuItem {
  title: string;
  to?: string;
  icon?: JSX.Element;
  needPermission?: boolean;
}

export interface Menu extends MenuItem {
  subMenu?: MenuItem[];
}

const SIDE_BAR_MENU_ITEMS: Menu[] = [
  {
    title: 'Dashboard',
    to: '/',
    icon: <PieChartOutlined />,
  },
  {
    title: 'Employees',
    to: '/employees',
    icon: <TeamOutlined />,
  },
  {
    title: 'Leave Applications',
    to: '/leave_applications',
    icon: <ScheduleOutlined />,
  },
  {
    title: 'Users',
    to: '/users',
    icon: <UserOutlined />,
  },
  // {
  //   title: 'Skills',
  //   to: '/skills',
  //   needPermission: true,
  //   icon: <UserOutlined />,
  // },
  // {
  //   title: 'Navigation Two',
  //   icon: <AppstoreOutlined />,
  //   subMenu: [
  //     {
  //       title: 'Option 9',
  //       to: '/option9',
  //     },
  //     {
  //       title: 'Option10',
  //       to: '/option10',
  //     },
  //   ],
  // },
];

export default SIDE_BAR_MENU_ITEMS;
