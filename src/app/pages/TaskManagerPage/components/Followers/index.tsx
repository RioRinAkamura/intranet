import React, { useState, useCallback } from 'react';
import styled from 'styled-components/macro';
import { Select, Button, List, Spin } from 'antd';
import { api } from 'utils/api';
import { Pagination } from '@hdwebsoft/boilerplate-api-sdk/libs/type';
import {
  Task,
  Employee,
} from '@hdwebsoft/boilerplate-api-sdk/libs/api/hr/models';
import { DeleteOutlined } from '@ant-design/icons';
import { Avatar } from 'app/components/Avatar/Loadable';
import { useNotify, ToastMessageType } from 'app/components/ToastNotification';
import { DeleteModal } from 'app/components/DeleteModal';

interface FollowersProps {
  callback: () => void;
  task: Task;
}
const { Option } = Select;

export const Followers = (props: FollowersProps) => {
  const { callback, task } = props;

  const { notify } = useNotify();

  const [value, setValue] = useState<string>();
  const [visible, setVisible] = useState(false);
  const [searchLoad, setSearchLoad] = useState(false);
  const [employeeId, setEmployeeId] = useState<string>('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [followers, setFollowers] = useState<Employee[]>([]);

  const fetchEmployee = useCallback(async (search: string) => {
    try {
      const response: Pagination<Employee> = await api.hr.employee.list(search);
      return response.results;
    } catch (error) {
      console.log('error', error);
    }
  }, []);

  const options = employees.map(user => (
    <Option key={user.id} value={user.id}>
      {user.first_name} {user.last_name}
    </Option>
  ));

  const handleSearch = async value => {
    if (value) {
      setSearchLoad(true);
      const response = await fetchEmployee(value);
      if (response) {
        setEmployees(response);
        setSearchLoad(false);
      }
    } else {
      setEmployees([]);
    }
  };

  const getFollowers = (id?: string): string[] => {
    let followerIds: string[] = [];

    if (task.followers) {
      if (id) {
        followerIds = task.followers
          .filter(follower => follower.id !== id)
          .map(item => {
            return item.id;
          });
      } else {
        followerIds = task.followers.map(follower => {
          return follower.id;
        });
      }
    }

    return followerIds;
  };

  const updateFollower = async (id?: string) => {
    try {
      if (!value && !id) return;

      let followerIds = getFollowers(id);
      if (value) followerIds = [...followerIds, value];

      const taskUpdated: Task = await api.hr.task.update({
        ...task,
        follower_ids: followerIds,
        assignee_id: task.assignee.id,
        project_id: task.project.id,
      });
      callback();
      setValue(undefined);
      setFollowers(taskUpdated.followers || []);

      notify({
        type: ToastMessageType.Info,
        duration: 2,
        message: `${visible ? 'Delete' : 'Add'} Follower Successfully`,
      });

      setVisible(false);
      setEmployeeId('');
    } catch (e) {
      notify({
        type: ToastMessageType.Error,
        duration: 2,
        message: `${visible ? 'Delete' : 'Add'} Follower Failed`,
      });
    }
  };

  React.useEffect(() => {
    if (task && task.followers) {
      setFollowers(task.followers);
    }
  }, [task]);

  return (
    <>
      <StyledWrapperSelect>
        <StyledSelect
          showSearch
          value={value}
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          size="large"
          loading={searchLoad}
          placeholder="Search employee"
          onChange={(value: any) => setValue(value)}
          onSearch={handleSearch}
          notFoundContent={searchLoad ? <Spin size="default" /> : null}
        >
          {options}
        </StyledSelect>

        <Button size="large" type="primary" onClick={() => updateFollower()}>
          Add
        </Button>
      </StyledWrapperSelect>
      <List
        dataSource={followers}
        pagination={{
          pageSize: 5,
        }}
        header={<></>}
        renderItem={follower => (
          <List.Item key={follower.id}>
            <StyledWrapperFollower>
              <Avatar
                size={30}
                src={follower.avatar}
                name={follower.first_name + ' ' + follower.last_name}
              />
              <StyledFollowerName>
                {follower.first_name + ' ' + follower.last_name}
              </StyledFollowerName>
            </StyledWrapperFollower>

            <StyledDeleteOutlined
              onClick={() => {
                setEmployeeId(follower.id);
                setVisible(true);
              }}
            />
          </List.Item>
        )}
      />

      <DeleteModal
        open={visible}
        handleDelete={() => updateFollower(employeeId)}
        handleCancel={() => setVisible(false)}
        content="Are you sure you want to delete this follower?"
      />
    </>
  );
};

const StyledWrapperSelect = styled.div`
  display: flex;
`;

const StyledSelect = styled(Select)`
  width: 100%;
  margin-right: 20px;
`;

const StyledWrapperFollower = styled.div`
  display: flex;
  align-items: center;
`;

const StyledFollowerName = styled.div`
  font-weight: bold;
  margin-left: 10px;
`;

const StyledDeleteOutlined = styled(DeleteOutlined)`
  color: red;
  cursor: pointer;
`;
