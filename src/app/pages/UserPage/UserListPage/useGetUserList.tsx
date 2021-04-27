import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { models } from '@hdwebsoft/boilerplate-api-sdk';
import { Avatar, Button, Input, Space, Tag, Tooltip } from 'antd';
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
  selectUserspageFilterColumns,
  selectUserspageIsFilter,
  selectUserspageParams,
} from './slice/selectors';
import { QueryParams, UserspageState } from './slice/types';
import Highlighter from 'react-highlight-words';
import { useTranslation } from 'react-i18next';
import { Key } from 'antd/lib/table/interface';
import styled from 'styled-components/macro';
import { has, identity, pickBy } from 'lodash';

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
  const filterColumns = useSelector(selectUserspageFilterColumns);

  const [searchText, setSearchText] = React.useState('');
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
      const changedParams = {
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
      dispatch(
        actions.changeUsersState({
          params: pickBy(changedParams, identity),
          filterColumns: pickBy(changedParams, identity),
          pagination: pickBy(changedParams, identity),
        }),
      );
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
      return has(filterColumns, dataIndex) || searchText.length > 0 ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[filterColumns![dataIndex], searchText.length > 0]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      );
    },
  });

  const handleSearch = (dataIndex: string, confirm: () => void) => {
    dispatch(
      actions.filterColumns({
        ...filterColumns,
        [dataIndex]: selectedKeys[dataIndex],
      }),
    );
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
    //   setSearchTextColumns(prevState => ({
    //     ...prevState,
    //     [dataIndex]: null,
    //   }));
    //   setSearchedColumns(prevState => ({
    //     ...prevState,
    //     [dataIndex]: null,
    //   }));
    //   setSelectedKeys(prevState => ({
    //     ...prevState,
    //     [dataIndex]: null,
    //   }));
    //   delete urlParams[dataIndex];
    //   history.replace({
    //     search: stringify(
    //       {
    //         ...urlParams,
    //       },
    //       { sort: false },
    //     ),
    //   });
    confirm();
  };

  const columns: ColumnProps<Employee>[] = [
    {
      title: t(UsersMessages.listAvatarTitle()),
      dataIndex: 'avatar',
      width: 100,
      render: (text, record: Employee) => (
        <Avatar
          size={50}
          src={text}
          alt={record.first_name + ' ' + record.last_name}
        />
      ),
    },
    {
      title: t(UsersMessages.listFirstNameTitle()),
      dataIndex: 'first_name',
      width: 150,
      // sorter: {
      //   multiple: 1,
      // },
      // defaultSortOrder: urlParams.ordering?.includes('first_name')
      //   ? urlParams.ordering.includes('-first_name')
      //     ? 'descend'
      //     : 'ascend'
      //   : null,
      ...getColumnSearchProps('first_name'),
    },
    {
      title: t(UsersMessages.listLastNameTitle()),
      dataIndex: 'last_name',
      width: 150,
      //   sorter: {
      //     multiple: 2,
      //   },
      //   defaultSortOrder: urlParams.ordering?.includes('last_name')
      //     ? urlParams.ordering.includes('-last_name')
      //       ? 'descend'
      //       : 'ascend'
      //     : null,
      ...getColumnSearchProps('last_name'),
    },
    // {
    //   title: t(UsersMessages.listEmailTitle()),
    //   dataIndex: 'email',
    //   width: 250,
    //   sorter: {
    //     multiple: 3,
    //   },
    //   defaultSortOrder: urlParams.ordering?.includes('email')
    //     ? urlParams.ordering.includes('-email')
    //       ? 'descend'
    //       : 'ascend'
    //     : null,
    //   ...getColumnSearchProps('email'),
    // },
    // {
    //   title: 'Phone Number',
    //   dataIndex: 'phone',
    //   width: 170,
    //   sorter: {
    //     multiple: 4,
    //   },
    //   defaultSortOrder: urlParams.ordering?.includes('phone')
    //     ? urlParams.ordering.includes('-phone')
    //       ? 'descend'
    //       : 'ascend'
    //     : null,
    //   ...getColumnSearchProps('phone'),
    // },
    // {
    //   title: 'Code',
    //   dataIndex: 'code',
    //   width: 170,
    //   sorter: {
    //     multiple: 5,
    //   },
    //   defaultSortOrder: urlParams.ordering?.includes('code')
    //     ? urlParams.ordering.includes('-code')
    //       ? 'descend'
    //       : 'ascend'
    //     : null,
    //   ...getColumnSearchProps('code'),
    // },
    // {
    //   title: 'Tags',
    //   dataIndex: 'tags',
    //   width: 230,
    //   render: (text, record: Employee, index: number) => {
    //     return (
    //       <>
    //         {text.map(tag => {
    //           return (
    //             <Tag color="geekblue" key={tag}>
    //               {tag.toUpperCase()}
    //             </Tag>
    //           );
    //         })}
    //       </>
    //     );
    //   },
    // },
    // {
    //   title: 'Type',
    //   dataIndex: 'type',
    //   width: 120,
    // },
    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    //   width: 120,
    // },
    // {
    //   title: t(UsersMessages.listOptionsTitle()),
    //   dataIndex: 'id',
    //   fixed: 'right',
    //   width: 120,
    //   render: (text, record: Employee, index: number) => {
    //     return (
    //       <>
    //         <Tooltip title={t(UsersMessages.listViewTooltip())}>
    //           <IconButton
    //             type="primary"
    //             shape="circle"
    //             size="small"
    //             icon={<EyeOutlined />}
    //             onClick={() => {
    //               history.push(`/employees/${text}`);
    //             }}
    //           />
    //         </Tooltip>
    //         <Tooltip title={t(UsersMessages.listEditTooltip())}>
    //           <IconButton
    //             shape="circle"
    //             icon={<EditOutlined />}
    //             size="small"
    //             onClick={() => {
    //               history.push({
    //                 pathname: '/employees/' + text,
    //                 state: { edit: true },
    //               });
    //             }}
    //           />
    //         </Tooltip>
    //         {/* <Tooltip title={t(UsersMessages.listDeleteTooltip())}>
    //           <IconButton
    //             danger
    //             shape="circle"
    //             size="small"
    //             icon={<DeleteOutlined />}
    //             onClick={() => {
    //               setDeleteModal({ open: true, id: text });
    //             }}
    //           />
    //         </Tooltip> */}
    //       </>
    //     );
    //   },
    // },
  ];

  return {
    getUserListState,
    fetchUsers,
    columns,
    setSearchText,
  };
};

const IconButton = styled(Button)`
  margin: 5px;
  span {
    position: absolute !important;
    width: 100%;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
`;
