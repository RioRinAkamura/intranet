import * as React from 'react';
import { has } from 'lodash';
import { Button, Input, Select, Space, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import Highlighter from 'react-highlight-words';
import styled from 'styled-components/macro';
import { TagType } from 'app/pages/UserPage/types';
import Link from 'antd/lib/typography/Link';

const Option = Select;

interface useTableProps {
  getColumnSorterProps: (dataIndex: string, columnPriority: number) => {};
  getColumnSearchInputProps: (dataIndex: string[], filterIndex?: number) => {};
  getColumnSearchTagProps: (dataIndex: string, tags?: TagType[]) => {};
}

export const useTableConfig = (
  state: any,
  messageTrans: any,
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

  const getColumnSearchTagProps = (dataIndex: string, tags?: TagType[]) => ({
    ellipsis: true,
    filterDropdown: ({ confirm }) => {
      return (
        <div style={{ padding: 8 }}>
          {dataIndex.includes('tags') ? (
            <WrapperSelect
              mode="tags"
              placeholder={`${t(
                messageTrans.filterInputPlaceholder(),
              )} ${dataIndex}`}
              size="large"
              value={selectedKeys[dataIndex]}
              onChange={e => {
                setSelectedKeys(prevState => ({
                  ...prevState,
                  [dataIndex]: e ? e : null,
                }));
              }}
              tagRender={props => (
                <TagOption color="blue" style={{ padding: '6px 6px' }}>
                  {props.label}
                  {<Link onClick={() => props.onClose()}>x</Link>}
                </TagOption>
              )}
            >
              {tags &&
                tags.map((tag: TagType) => (
                  <Option key={tag.id} value={tag.name}>
                    {tag.name}
                  </Option>
                ))}
            </WrapperSelect>
          ) : (
            <Input
              placeholder={`${t(
                messageTrans.filterInputPlaceholder(),
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
          )}
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

const WrapperSelect = styled(Select)`
  display: block;
  margin-bottom: 10px;
  span {
    align-items: center;
  }

  .ant-select-selection-overflow {
    align-content: start;
    height: 80px;
    width: 280px;
    overflow-y: auto;
    overflow-x: hidden;
  }
`;

const TagOption = styled(Tag)`
  padding: 6px 12px;
  margin: 5px;

  a {
    margin: 0px 2px 0px 5px !important;
    padding: 0 !important;
    color: black;
  }
`;
