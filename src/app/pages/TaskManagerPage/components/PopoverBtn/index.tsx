import React, { useState, useCallback } from 'react';
import { Popover } from 'antd';
import styled from 'styled-components/macro';
import { Select, Spin, Button } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { api } from 'utils/api';

interface popoverProps {
  followers: any[];
  callback: () => void;
  task: any;
}
const { Option } = Select;

export const PopoverBtn = (props: popoverProps) => {
  const { followers, callback, task } = props;
  const [visible, setVisible] = useState<any>(false);
  const [value, setValue] = useState('');
  const [searchLoad, setSearchLoad] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  const fetchUser = useCallback(async (search: string) => {
    try {
      const response: any = await api.user.list(search);
      return response.results;
    } catch (error) {
      console.log('error', error);
    }
  }, []);

  const options = users?.map(user => (
    <Option key={user.id} value={user.id}>
      {user.first_name} {user.last_name}
    </Option>
  ));

  const followersPopup = (record: string[]) => {
    const handleSearch = async value => {
      if (value) {
        setSearchLoad(true);
        const response = await fetchUser(value);
        if (response) {
          setUsers(response);
          setSearchLoad(false);
        }
      } else {
        setUsers([]);
      }
    };

    const handleChange = value => {
      setValue(value);
    };

    const handleAddFollower = async () => {
      try {
        await api.hr.task.createFollower(task.id, {
          follower: value,
        });
        setVisible(false);
        callback();
      } catch (e) {
        console.log(e);
      }
    };

    return (
      <FlexWrapper>
        <Select
          style={{ width: '100%', display: 'block' }}
          showSearch
          value={value}
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          size="large"
          loading={searchLoad}
          placeholder={'Search User'}
          onSearch={handleSearch}
          onChange={handleChange}
          notFoundContent={searchLoad ? <Spin size="default" /> : null}
        >
          {options}
        </Select>
        <Button
          disabled={!value}
          style={{
            marginBottom: 10,
            marginTop: 10,
            display: 'block',
            width: '100%',
          }}
          size="large"
          type="primary"
          onClick={handleAddFollower}
          // icon={<LaptopOutlined />}
        >
          Add Follower
        </Button>
      </FlexWrapper>
    );
  };
  const handleVisibleChange = visible => {
    setVisible(visible);
  };

  return (
    <Popover
      trigger="click"
      placement="top"
      content={() => followersPopup(followers)}
      visible={visible}
      onVisibleChange={handleVisibleChange}
    >
      <PlusCircleOutlined />
    </Popover>
  );
};

const FlexWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 300px;
  svg {
    cursor: pointer;
  }
`;
