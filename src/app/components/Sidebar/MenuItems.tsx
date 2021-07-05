import { Link } from 'react-router-dom';
import { Menu } from 'antd';

// import constants
import SIDE_BAR_MENU_ITEMS from 'constants/global';

export const MenuItems: React.FC = () => {
  const { Item, SubMenu } = Menu;

  return (
    <Menu
      theme="dark"
      defaultSelectedKeys={[window.location.pathname]}
      mode="inline"
      children={SIDE_BAR_MENU_ITEMS.map((item, key) => {
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
