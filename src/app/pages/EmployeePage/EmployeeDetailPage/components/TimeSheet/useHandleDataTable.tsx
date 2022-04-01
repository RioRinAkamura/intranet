import { parse, stringify } from 'query-string';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { Key, SorterResult } from 'antd/lib/table/interface';
import { identity, isArray, isEmpty, pickBy } from 'lodash';

interface useDataTable {
  setSearchText: (text: string, isDeleted: boolean) => void;
  resetSearch: () => void;
  setFilterText: (value: FilterColumns) => void;
  setSelectedRows: <T>(selectedRowKeys: Key[], selectedRows: T[]) => void;
  setOrdering: <T>(sorter: SorterResult<T> | SorterResult<T>[]) => void;
  setPagination: (pagination: TablePagination) => void;
}

export interface TableStateProps {
  loading?: boolean;
  params: Params;
  filterColumns?: FilterColumns;
}

export interface TablePagination {
  current?: number;
  pageSize?: number;
  total?: number;
}

interface Params {
  [key: string]: string | string[] | number | undefined;
  ordering?: string;
  search?: string;
}
interface FilterColumns {
  [key: string]: string | string[] | undefined;
}

interface TableActions {
  [key: string]: Function;
}

export const useHandleDataTable = (
  state: TableStateProps,
  actions: TableActions,
): useDataTable => {
  const history = useHistory();
  const location = useLocation();
  const urlParams = parse(location.search, {
    sort: false,
  });

  const dispatch = useDispatch();
  const { filterColumns } = state;
  const { ordering } = state.params;

  React.useEffect(() => {
    const searchParams = parse(location.search, {
      sort: false,
    });

    if (isEmpty(searchParams)) {
      dispatch(actions.resetSearch());
    }
  }, [dispatch, actions, location.search]);

  React.useLayoutEffect(() => {
    if (location.search) {
      let params = parse(location.search, {
        sort: false,
      });
      dispatch(actions.changeState(pickBy(params, identity)));
    } else {
      dispatch(actions.notQuery());
    }
  }, [actions, dispatch, location.search]);

  const setSelectedRows = <T,>(
    selectedRowKeys: Key[],
    selectedRows: T[],
  ): void => {
    dispatch(actions.selectedRows({ selectedRowKeys, selectedRows }));
  };

  const setSearchText = (text: string, isDeleted: boolean): void => {
    if (urlParams.limit || urlParams.page) {
      history.replace({
        search: stringify({ search: text }),
      });
    } else if (text) {
      history.replace({
        search: stringify({
          search: text,
          is_deleted: isDeleted ? 'true' : undefined,
        }),
      });
    } else {
      if (isDeleted) {
        history.replace({
          search: stringify({
            is_deleted: 'true',
          }),
        });
      } else {
        history.replace({
          search: stringify({
            ...urlParams,
            search: undefined,
            is_deleted: undefined,
          }),
        });
      }
    }
    dispatch(actions.setSearchText({ text, isDeleted }));
  };

  const resetSearch = () => {
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
            return item.field;
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
          if (ordering !== sorter.field) {
            history.replace({
              search: stringify({
                ...urlParams,
                ordering: sorter.field,
              }),
            });
            dispatch(actions.setOrdering(sorter.field));
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
            dispatch(actions.setOrdering(null));
          }
        }
      }
    }
  };

  const setPagination = (pagination: TablePagination) => {
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

  const setFilterText = (value: FilterColumns) => {
    dispatch(
      actions.filterColumns({
        ...filterColumns,
        ...value,
      }),
    );
    history.replace({
      search: stringify(
        {
          ...urlParams,
          ...value,
          page: urlParams.page ? 1 : undefined,
        },
        { sort: false },
      ),
    });
  };

  return {
    setSearchText,
    setSelectedRows,
    resetSearch,
    setOrdering,
    setPagination,
    setFilterText,
  };
};
