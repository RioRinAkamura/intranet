import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { models } from '@hdwebsoft/boilerplate-api-sdk';
import { Avatar, Button, Input, Space, Tag, Tooltip } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { parse, stringify } from 'query-string';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { Pagination, ParamsPayload } from '../types';
import { UsersMessages } from './messages';
import { useUserspageSlice } from './slice';
import {
  selectUserspage,
  selectUserspageFilterColumns,
  selectUserspageIsFilter,
  selectUserspageParams,
  selectUserspageSearchText,
} from './slice/selectors';
import { UserspageState } from './slice/types';
import Highlighter from 'react-highlight-words';
import { useTranslation } from 'react-i18next';
import { Key, SorterResult } from 'antd/lib/table/interface';
import styled from 'styled-components/macro';
import { has, identity, isArray, isEmpty, pickBy } from 'lodash';

type Employee = models.hr.Employee;
interface GetUsersListHook {
  getUserListState: UserspageState;
  fetchUsers: () => void;
  setSearchText: (text: string) => void;
  resetSearch: () => void;
  setSelectedRows: (selectedRowKeys: Key[], selectedRows: Employee[]) => void;
  setOrdering: (
    sorter: SorterResult<Employee> | SorterResult<Employee>[],
  ) => void;
  setPagination: (pagination: Pagination) => void;
}

export const useHandleDataTable = (): GetUsersListHook => {
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
  const searchText = useSelector(selectUserspageSearchText);

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
      setSelectedKeys(prevState => ({
        ...prevState,
        ...changedParams,
      }));
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
            page: urlParams.page && urlParams.page > 1 ? 1 : undefined,
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
    dispatch(
      actions.filterColumns({
        ...filterColumns,
        [dataIndex]: undefined,
      }),
    );
    setSelectedKeys(prevState => ({
      ...prevState,
      [dataIndex]: undefined,
    }));
    history.replace({
      search: stringify(
        {
          ...urlParams,
          [dataIndex]: undefined,
        },
        { sort: false },
      ),
    });
    confirm();
  };

  const getColumnFilterProps = (dataIndex: string, columnPriority) => ({
    sorter: {
      multiple: columnPriority,
    },
    defaultSortOrder: urlParams.ordering?.includes(dataIndex)
      ? urlParams.ordering.includes('-' + dataIndex)
        ? ('descend' as 'descend')
        : ('ascend' as 'ascend')
      : null,
  });

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
      return has(filterColumns, dataIndex) ||
        (searchText && searchText.length > 0) ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[
            filterColumns![dataIndex],
            searchText && searchText.length > 0 && searchText,
          ]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      );
    },
  });

  const setSelectedRows = (
    selectedRowKeys: Key[],
    selectedRows: Employee[],
  ): void => {
    dispatch(actions.selectedRows({ selectedRowKeys, selectedRows }));
  };

  const setSearchText = (text: string): void => {
    if (urlParams.limit || urlParams.page) {
      history.replace({
        search: stringify({ search: text }),
      });
    } else if (text) {
      history.replace({
        search: stringify({ ...urlParams, search: text }),
      });
    } else {
      history.replace({
        search: stringify({ ...urlParams, search: undefined }),
      });
    }
    dispatch(actions.setSearchText({ text }));
  };

  const resetSearch = () => {
    history.replace({
      search: '',
    });
    dispatch(actions.resetSearch());
  };

  const setOrdering = (
    sorter: SorterResult<Employee> | SorterResult<Employee>[],
  ): void => {
    if (!isEmpty(sorter)) {
      if (isArray(sorter)) {
        const orderingParams = sorter.map(item => {
          if (item.order === 'ascend') {
            return '+' + item.field;
          } else if (item.order === 'descend') {
            return '-' + item.field;
          } else {
            return '';
          }
        });

        history.replace({
          search: stringify({
            ...urlParams,
            ordering: orderingParams.toString(),
          }),
        });
        dispatch(actions.setOrdering(orderingParams.toString()));
      } else {
        if (sorter.order === 'ascend') {
          history.replace({
            search: stringify({
              ...urlParams,
              ordering: '+' + sorter.field,
            }),
          });
          dispatch(actions.setOrdering('+' + sorter.field));
        } else if (sorter.order === 'descend') {
          history.replace({
            search: stringify({
              ...urlParams,
              ordering: '-' + sorter.field,
            }),
          });
          dispatch(actions.setOrdering('-' + sorter.field));
        } else {
          if (urlParams.ordering) {
            delete urlParams.ordering;
            history.replace({
              search: stringify({
                ...urlParams,
              }),
            });
            dispatch(actions.setOrdering(undefined));
          }
        }
      }
    }
  };

  const setPagination = (pagination: Pagination) => {
    history.replace({
      search: stringify(
        {
          ...urlParams,
          page: pagination.current,
          limit: pagination.pageSize,
        },
        { sort: false },
      ),
    });
    dispatch(actions.setPagination(pagination));
  };

  return {
    getUserListState,
    fetchUsers,
    setSearchText,
    setSelectedRows,
    resetSearch,
    setOrdering,
    setPagination,
  };
};

