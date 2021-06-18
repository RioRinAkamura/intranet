import {
  AppstoreOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

const SIDE_BAR_MENU_ITEMS = [
  {
    title: 'Dashboard',
    to: '/',
    icon: <PieChartOutlined />,
  },
  {
    title: 'Users',
    to: '/Users',
    icon: <UserOutlined />,
  },
  {
    title: 'Employees',
    to: '/employees',
    icon: <TeamOutlined />,
  },
  {
    title: 'Leave Applications',
    to: '/leave_applications',
    icon: <TeamOutlined />,
  },
  {
    title: 'Navigation Two',
    icon: <AppstoreOutlined />,
    subMenu: [
      {
        title: 'Option 9',
        to: '/option9',
      },
      {
        title: 'Option10',
        to: '/option10',
      },
    ],
  },
];

export default SIDE_BAR_MENU_ITEMS;
