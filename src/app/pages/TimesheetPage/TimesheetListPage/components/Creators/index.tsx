import { DeleteOutlined } from '@ant-design/icons';
import { Employee } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';
import { ProjectTimesheet } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/timesheet/models';
import { Pagination } from '@hdwebsoft/intranet-api-sdk/libs/type';
import { Button, List, Select, Spin } from 'antd';
import { Avatar } from 'app/components/Avatar/Loadable';
import { DeleteModal } from 'app/components/DeleteModal';
import { ToastMessageType, useNotify } from 'app/components/ToastNotification';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components/macro';
import { api } from 'utils/api';

interface CreatorsProps {
  callback: () => void;
  timesheet: ProjectTimesheet;
}
const { Option } = Select;

export const Creators = (props: CreatorsProps) => {
  const { callback, timesheet } = props;

  const { notify } = useNotify();

  const [value, setValue] = useState<string>();
  const [visible, setVisible] = useState(false);
  const [searchLoad, setSearchLoad] = useState(false);
  const [employeeId, setEmployeeId] = useState<string>('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [creators, setCreators] = useState<any[]>([]);

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

  const getCreators = (id?: string): any[] => {
    let creatorIds: string[] = [];
    if (timesheet.creators) {
      if (id) {
        creatorIds = timesheet.creators
          .filter(creator => creator.id !== id)
          .map(item => {
            return item.id;
          });
      } else {
        creatorIds = timesheet.creators.map(creator => {
          return creator.id;
        });
      }
    }
    return creatorIds;
  };

  const updateCreator = async (id?: string) => {
    try {
      if (!value && !id) return;
      let creatorIds = getCreators(id);
      if (value) creatorIds = [...creatorIds, value];
      let newCerators = creatorIds.map(creator => ({ id: creator }));
      const timesheetUpdated: ProjectTimesheet = await api.hr.projectTimesheet.update(
        {
          ...timesheet,
          creators: newCerators,
        },
      );
      callback();
      setValue(undefined);
      setCreators(timesheetUpdated.creators || []);

      notify({
        type: ToastMessageType.Info,
        duration: 2,
        message: `${visible ? 'Delete' : 'Add'} Creator Successfully`,
      });

      setVisible(false);
      setEmployeeId('');
    } catch (e) {
      notify({
        type: ToastMessageType.Error,
        duration: 2,
        message: `${visible ? 'Delete' : 'Add'} Creator Failed`,
      });
    }
  };

  React.useEffect(() => {
    if (timesheet && timesheet.creators) {
      setCreators(timesheet.creators);
    }
  }, [timesheet]);

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
          placeholder="Select employee"
          onChange={(value: any) => setValue(value)}
          onSearch={handleSearch}
          notFoundContent={searchLoad ? <Spin size="default" /> : null}
        >
          {options}
        </StyledSelect>
        <Button size="large" type="primary" onClick={() => updateCreator()}>
          Add
        </Button>
      </StyledWrapperSelect>
      <List
        dataSource={creators}
        pagination={{
          pageSize: 5,
        }}
        header={<></>}
        renderItem={creator => (
          <List.Item key={creator.id}>
            <StyledWrapperCreator>
              <Avatar
                size={30}
                src={creator.avatar || undefined}
                name={creator.first_name + ' ' + creator.last_name}
              />
              <StyledCreatorName>{creator.name}</StyledCreatorName>
            </StyledWrapperCreator>

            <StyledDeleteOutlined
              onClick={() => {
                setEmployeeId(creator.id);
                setVisible(true);
              }}
            />
          </List.Item>
        )}
      />

      <DeleteModal
        open={visible}
        handleDelete={() => updateCreator(employeeId)}
        handleCancel={() => setVisible(false)}
        content="Are you sure you want to delete this creator?"
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

const StyledWrapperCreator = styled.div`
  display: flex;
  align-items: center;
`;

const StyledCreatorName = styled.div`
  font-weight: bold;
  margin-left: 10px;
`;

const StyledDeleteOutlined = styled(DeleteOutlined)`
  color: red;
  cursor: pointer;
`;
