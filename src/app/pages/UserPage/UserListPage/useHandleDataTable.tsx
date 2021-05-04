import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import { parse, stringify } from 'query-string';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { Pagination } from '../types';
import { UsersMessages } from './messages';
import { useUserspageSlice } from './slice';
import Highlighter from 'react-highlight-words';
import { useTranslation } from 'react-i18next';
import { Key, SorterResult } from 'antd/lib/table/interface';
import { has, identity, isArray, isEmpty, pickBy } from 'lodash';

interface GetUsersListHook {
  setSearchText: (text: string) => void;
  resetSearch: () => void;
  setSelectedRows: <T>(selectedRowKeys: Key[], selectedRows: T[]) => void;
  setOrdering: <T>(sorter: SorterResult<T> | SorterResult<T>[]) => void;
  setPagination: (pagination: Pagination) => void;
  getColumnSorterProps: (dataIndex: string, columnPriority: number) => {};
  getColumnSearchProps: (dataIndex: string) => {};
}

export const useHandleDataTable = (state: any): GetUsersListHook => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const urlParams = parse(location.search, {
    sort: false,
  });
  const { actions } = useUserspageSlice();
  const dispatch = useDispatch();
  const { filterColumns } = state;
  const { search, ordering } = state.params;

  const [selectedKeys, setSelectedKeys] = React.useState({});

  React.useLayoutEffect(() => {
    if (location.search) {
      let params = parse(location.search, {
        sort: false,
      });
      dispatch(
        actions.changeUsersState({
          params: pickBy(params, identity),
          filterColumns: pickBy(params, identity),
          pagination: pickBy({ ...params }, identity),
        }),
      );
      setSelectedKeys(prevState => ({
        ...prevState,
        ...params,
      }));
    } else {
      dispatch(actions.notQuery());
    }
  }, [actions, dispatch, location.search]);

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
            page: urlParams.page ? 1 : undefined,
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

  const getColumnSorterProps = (dataIndex: string, columnPriority: number) => {
    const ordering = {
      sorter: {
        multiple: columnPriority,
      },
    };
    if (state.params.ordering) {
      ordering['sortOrder'] = state.params.ordering.includes(dataIndex)
        ? state.params.ordering.includes('-' + dataIndex)
          ? ('descend' as 'descend')
          : ('ascend' as 'ascend')
        : null;
    } else if (state.params.ordering === '') {
      ordering['sortOrder'] = null;
    }
    return ordering;
  };

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
            loading={state.loading}
          >
            {t(UsersMessages.filterSearchButton())}
          </Button>
          <Button
            onClick={() => handleReset(dataIndex, confirm)}
            size="small"
            loading={state.loading}
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
      return has(filterColumns, dataIndex) || (search && search.length > 0) ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[
            filterColumns![dataIndex],
            search && search.length > 0 && search,
          ]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      );
    },
  });

  const setSelectedRows = <T,>(
    selectedRowKeys: Key[],
    selectedRows: T[],
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
    setSelectedKeys({});
    history.replace({
      search: '',
    });
    dispatch(actions.resetSearch());
  };

  const setOrdering = <T,>(
    sorter: SorterResult<T> | SorterResult<T>[],
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

        if (ordering !== orderingParams.toString()) {
          history.replace({
            search: stringify({
              ...urlParams,
              ordering: orderingParams.toString(),
            }),
          });
          dispatch(actions.setOrdering(orderingParams.toString()));
        }
      } else {
        if (sorter.order === 'ascend') {
          if (ordering !== '+' + sorter.field) {
            history.replace({
              search: stringify({
                ...urlParams,
                ordering: '+' + sorter.field,
              }),
            });
            dispatch(actions.setOrdering('+' + sorter.field));
          }
        } else if (sorter.order === 'descend') {
          if (ordering !== '-' + sorter.field) {
            history.replace({
              search: stringify({
                ...urlParams,
                ordering: '-' + sorter.field,
              }),
            });
            dispatch(actions.setOrdering('-' + sorter.field));
          }
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
    setSearchText,
    setSelectedRows,
    resetSearch,
    setOrdering,
    setPagination,
    getColumnSorterProps,
    getColumnSearchProps,
  };
};
