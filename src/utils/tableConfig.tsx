import * as React from 'react';
import { has } from 'lodash';
import { Button, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import Highlighter from 'react-highlight-words';
import { TagsInput } from 'app/components/Tags';
import { TableStateProps } from 'app/pages/UserPage/UserListPage/useHandleDataTable';
import { TagType } from './types';

interface useTableProps {
  getColumnSorterProps: (dataIndex: string, columnPriority: number) => {};
  getColumnSearchInputProps: (dataIndex: string[], filterIndex?: number) => {};
  getColumnSearchTagProps: (dataIndex: string, tags?: TagType[]) => {};
}

type MessageTranslate = {
  [key: string]: Function;
};

export const useTableConfig = (
  state: TableStateProps,
  messageTrans: MessageTranslate,
  setFilterText: (dataIndex: string, data: string) => void,
  resetFilter: (dataIndex: string) => void,
): useTableProps => {
  const { t } = useTranslation();

  const [selectedKeys, setSelectedKeys] = React.useState([]);

  React.useLayoutEffect(() => {
    if (state.filterColumns) {
      setSelectedKeys(prev => ({ ...prev, ...state.filterColumns }));
    }
  }, [state.filterColumns]);

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

  const getColumnSearchInputProps = (
    dataIndex: string[],
    filterIndex?: number,
  ) => ({
    ellipsis: true,
    filterDropdown: ({ confirm }) => {
      return (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={`${t(
              messageTrans.filterInputPlaceholder(),
            )} ${dataIndex}`}
            value={selectedKeys[dataIndex[filterIndex || 0]]}
            onChange={e => {
              e.persist();
              setSelectedKeys(prevState => ({
                ...prevState,
                [dataIndex[filterIndex || 0]]: e.target.value
                  ? e.target.value
                  : null,
              }));
            }}
            onPressEnter={() =>
              handleSearch(dataIndex[filterIndex || 0], confirm)
            }
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(dataIndex[filterIndex || 0], confirm)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
              loading={state.loading}
            >
              {t(messageTrans.filterSearchButton())}
            </Button>
            <Button
              onClick={() => handleReset(dataIndex[filterIndex || 0], confirm)}
              size="small"
              loading={state.loading}
              style={{ width: 90 }}
            >
              {t(messageTrans.filterResetButton())}
            </Button>
          </Space>
        </div>
      );
    },
    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex[filterIndex || 0]]
        ? record[dataIndex[filterIndex || 0]]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    render: (text, record) => {
      let dataText = '';
      dataIndex.map(data => {
        if (record[data]) {
          dataText += record[data] + ' ';
        }
        return data;
      });
      return has(state.filterColumns, dataIndex[filterIndex || 0]) ||
        (state.params.search && state.params.search.length > 0) ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[
            state.filterColumns![dataIndex[filterIndex || 0]],
            state.params.search &&
              state.params.search.length > 0 &&
              state.params.search,
          ]}
          autoEscape
          textToHighlight={text ? dataText.trim().toString() : ''}
        />
      ) : (
        dataText.trim()
      );
    },
  });

  const handleSearch = (dataIndex: string, confirm: () => void) => {
    setFilterText(dataIndex, selectedKeys[dataIndex]);
    confirm();
  };

  const handleReset = (dataIndex: string, confirm: () => void) => {
    setSelectedKeys(prevState => ({
      ...prevState,
      [dataIndex]: undefined,
    }));
    resetFilter(dataIndex);
    confirm();
  };

  const getColumnSearchTagProps = (dataIndex: string) => ({
    ellipsis: true,
    filterDropdown: ({ confirm }) => {
      return (
        <div style={{ padding: 8 }}>
          <TagsInput
            value={selectedKeys[dataIndex]}
            callback={e => {
              setSelectedKeys(prevState => ({
                ...prevState,
                [dataIndex]: e ? e : null,
              }));
            }}
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
              {t(messageTrans.filterSearchButton())}
            </Button>
            <Button
              onClick={() => handleReset(dataIndex, confirm)}
              size="small"
              loading={state.loading}
              style={{ width: 90 }}
            >
              {t(messageTrans.filterResetButton())}
            </Button>
          </Space>
        </div>
      );
    },
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
  });

  return {
    getColumnSorterProps,
    getColumnSearchInputProps,
    getColumnSearchTagProps,
  };
};
