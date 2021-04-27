import { SearchOutlined } from '@ant-design/icons';
import { models } from '@hdwebsoft/boilerplate-api-sdk';
import { Button, Input, Space } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import useSelection from 'antd/lib/table/hooks/useSelection';
import { parse, stringify } from 'query-string';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { ParamsPayload } from '../types';
import { UsersMessages } from './messages';
import { useUserspageSlice } from './slice';
import {
  selectUserspage,
  selectUserspageIsFilter,
  selectUserspageParams,
} from './slice/selectors';
import { QueryParams, UserspageState } from './slice/types';
import Highlighter from 'react-highlight-words';
import { useTranslation } from 'react-i18next';
import { Key } from 'antd/lib/table/interface';

type Employee = models.hr.Employee;
interface GetUsersListHook {
  getUserListState: UserspageState;
  fetchUsers: () => void;
  columns: ColumnProps<Employee>[];
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  // queryUsers: () => void;
  // resetQueryUsers: () => void;
}

export const useGetUserList = (): GetUsersListHook => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const urlParams: ParamsPayload = parse(location.search, {
    sort: false,
  });
  const { actions } = useUserspageSlice();
  const dispatch = useDispatch();

  const params = useSelector(selectUserspageParams);
  const isFilter = useSelector(selectUserspageIsFilter);
  const getUserListState = useSelector(selectUserspage);

  const [searchText, setSearchText] = React.useState('');
  const [searchTextColumns, setSearchTextColumns] = React.useState({});
  const [searchedColumns, setSearchedColumns] = React.useState({});
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<Key[]>([]);
  const [selectedRows, setSelectedRows] = React.useState<Employee[]>([]);
  const [selectedKeys, setSelectedKeys] = React.useState({});

  React.useLayoutEffect(() => {
    if (
      urlParams.code ||
      urlParams.email ||
      urlParams.first_name ||
      urlParams.last_name ||
      urlParams.limit ||
      urlParams.ordering ||
      urlParams.page ||
      urlParams.phone ||
      urlParams.search
    ) {
      const params = {
        code: urlParams.code,
        email: urlParams.email,
        first_name: urlParams.first_name,
        last_name: urlParams.last_name,
        limit: urlParams.limit,
        ordering: urlParams.ordering,
        page: urlParams.page,
        phone: urlParams.phone,
        search: urlParams.search,
      };
      dispatch(actions.changeUsersState({ params: { ...params } }));
    } else {
      dispatch(actions.notQuery());
    }
  }, [
    actions,
    dispatch,
    urlParams.code,
    urlParams.email,
    urlParams.first_name,
    urlParams.last_name,
    urlParams.limit,
    urlParams.ordering,
    urlParams.page,
    urlParams.phone,
    urlParams.search,
  ]);

  const fetchUsers = React.useCallback(async () => {
    if (!isFilter) {
      dispatch(actions.fetchUsers({ params: params }));
    }
  }, [actions, dispatch, isFilter, params]);

  const getColumnSearchProps = (dataIndex: string) => ({
    ellipsis: true,
    filterDropdown: ({ confirm }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`${t(
            UsersMessages.filterInputPlaceholder(),
          )} ${dataIndex}`}
          value={selectedKeys[dataIndex]}
          onChange={e => {
            e.persist();
            setSelectedKeys(prevState => ({
              ...prevState,
              [dataIndex]: e.target.value ? e.target.value : null,
            }));
          }}
          onPressEnter={() => handleSearch(dataIndex, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(dataIndex, confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
            loading={getUserListState.loading}
          >
            {t(UsersMessages.filterSearchButton())}
          </Button>
          <Button
            onClick={() => handleReset(dataIndex, confirm)}
            size="small"
            loading={getUserListState.loading}
            style={{ width: 90 }}
          >
            {t(UsersMessages.filterResetButton())}
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    render: text => {
      return searchedColumns[dataIndex] || searchText.length > 0 ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchTextColumns[dataIndex], searchText.length > 0]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      );
    },
  });

  const handleSearch = (dataIndex: string, confirm: () => void) => {
    setSearchTextColumns(prevState => ({
      ...prevState,
      [dataIndex]: selectedKeys[dataIndex],
    }));
    setSearchedColumns(prevState => ({
      ...prevState,
      [dataIndex]: selectedKeys[dataIndex],
    }));
    if (selectedKeys[dataIndex]) {
      history.replace({
        search: stringify(
          {
            ...urlParams,
            [dataIndex]: selectedKeys[dataIndex],
          },
          { sort: false },
        ),
      });
    } else {
      delete urlParams[dataIndex];
      history.replace({
        search: stringify(
          {
            ...urlParams,
          },
          { sort: false },
        ),
      });
    }
    confirm();
  };

  const handleReset = (dataIndex: string, confirm: () => void) => {
    setSearchTextColumns(prevState => ({
      ...prevState,
      [dataIndex]: null,
    }));
    setSearchedColumns(prevState => ({
      ...prevState,
      [dataIndex]: null,
    }));
    setSelectedKeys(prevState => ({
      ...prevState,
      [dataIndex]: null,
    }));
    delete urlParams[dataIndex];
    history.replace({
      search: stringify(
        {
          ...urlParams,
        },
        { sort: false },
      ),
    });
    confirm();
  };

  const columns = [];

  return {
    getUserListState,
    fetchUsers,
    columns,
    setSearchText,
  };
};
