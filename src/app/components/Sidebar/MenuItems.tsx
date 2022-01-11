import { Link } from 'react-router-dom';
import { Menu as MenuLayout } from 'antd';

// import constants
import SIDE_BAR_MENU_ITEMS, { Menu } from 'constants/global';
import { useGetIdentity } from '../Auth/useGetIdentity';
import { ProfileOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

export const MenuItems: React.FC = () => {
  const { Item, SubMenu } = MenuLayout;
  const [menuItems, setMenuItems] = useState<Menu[]>(SIDE_BAR_MENU_ITEMS);
  const { identity } = useGetIdentity();

  useEffect(() => {
    // role length = 0 mean super admin
    if (identity) {
      const userIdentity: any = {
        ...identity,
      };
      // role to array string
      const userRoles = [...userIdentity.role].map(role => role.role);

      if (userRoles.includes('Admin') || userRoles.length === 0)
        setMenuItems(prevMenu => [
          ...prevMenu,
          {
            title: 'Skills',
            to: '/skills',
            needPermission: true,
            icon: <ProfileOutlined />,
          },
        ]);
    }
  }, [identity]);

  return (
    <MenuLayout
      theme="dark"
      defaultSelectedKeys={[window.location.pathname]}
      mode="inline"
      children={menuItems.map((item, key) => {
        return item.subMenu ? (
          <SubMenu icon={item.icon} key={key} title={item.title}>
            {item.subMenu.map(menu => {
              return (
                <Item key={menu.to}>
                  <Link to={menu.to!}>{menu.title}</Link>
                </Item>
              );
            })}
          </SubMenu>
        ) : (
          <Item key={item.to} icon={item.icon}>
            <Link to={item.to!}>{item.title}</Link>
          </Item>
        );
      })}
    />
  );
};
