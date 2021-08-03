import { parse, stringify } from 'query-string';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { Key, SorterResult } from 'antd/lib/table/interface';
import { identity, isArray, isEmpty, pickBy } from 'lodash';
import {
  TableActions,
  useDataTable,
  TablePagination,
  FilterColumns,
  TableListState,
} from './slice/types';

export const useHandleDataTable = (
  state: TableListState,
  actions: TableActions,
): useDataTable => {
  const history = useHistory();
  const location = useLocation();
  const urlParams = parse(location.search, {
    sort: false,
  });

  const dispatch = useDispatch();
  const { filterColumns, reload, loading } = state;
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
    if (location.search && reload && !loading) {
      let params = parse(location.search, {
        sort: false,
      });
      dispatch(actions.changeState(pickBy(params, identity)));
    }
  }, [actions, dispatch, location.search, reload, loading]);

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
