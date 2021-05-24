import * as React from 'react';
import { has } from 'lodash';
import {
  Button,
  Checkbox,
  CheckboxOptionType,
  Col,
  Input,
  Row,
  Space,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import Highlighter from 'react-highlight-words';
import { TagsInput } from 'app/components/Tags';
import { TableStateProps } from 'app/pages/UserPage/UserListPage/useHandleDataTable';
import { MessageTranslate, TagType } from './types';
import styled from 'styled-components/macro';
import { FilterColumns } from 'app/pages/UserPage/UserListPage/slice/types';

interface useTableProps {
  getColumnSorterProps: (dataIndex: string, columnPriority: number) => {};
  getColumnSearchInputProps: (dataIndex: string[], filterIndex?: number) => {};
  getColumnSearchTagProps: (dataIndex: string, tags?: TagType[]) => {};
  getColumnSearchCheckboxProps: (
    dataIndex: string[],
    options: CheckboxOptionType[],
    filterIndex?: number,
  ) => {};
  getColumnSearchCheckboxFromToProps: (
    dataIndex: string[],
    options: CheckboxOptionType[],
    range: string,
    filterIndex?: number,
  ) => {};
}

export const useTableConfig = (
  state: TableStateProps,
  messageTrans: MessageTranslate,
  setFilterText: (value: FilterColumns) => void,
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
        <Wrapper>
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
        </Wrapper>
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
    setFilterText({ [dataIndex]: selectedKeys[dataIndex] });
    confirm();
  };

  const handleReset = (dataIndex: string, confirm: () => void) => {
    setSelectedKeys(prevState => ({
      ...prevState,
      [dataIndex]: undefined,
    }));
    setFilterText({ [dataIndex]: undefined });
    confirm();
  };

  const handleFromToSearch = (
    dataIndex: string,
    range: string,
    confirm: () => void,
  ) => {
    if (selectedKeys[dataIndex] === '1') {
      setFilterText({ to: range, from: undefined });
    } else if (selectedKeys[dataIndex] === '2') {
      setFilterText({ from: range, to: range });
    } else {
      setFilterText({ from: range, to: undefined });
    }
    confirm();
  };

  const handleFromToReset = (confirm: () => void) => {
    setSelectedKeys(prevState => ({
      ...prevState,
      from: undefined,
      to: undefined,
    }));
    setFilterText({ from: undefined, to: undefined });
    confirm();
  };

  const getColumnSearchTagProps = (dataIndex: string) => ({
    filterDropdown: ({ confirm }) => {
      return (
        <Wrapper>
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
        </Wrapper>
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

  const getColumnSearchCheckboxProps = (
    dataIndex: string[],
    options: CheckboxOptionType[],
    filterIndex?: number,
  ) => ({
    filterDropdown: ({ confirm }) => {
      return (
        <Wrapper>
          <WrapperCheckbox>
            <Checkbox.Group
              value={selectedKeys[dataIndex[filterIndex || 0]]}
              options={options}
              onChange={e => {
                setSelectedKeys(prevState => ({
                  ...prevState,
                  [dataIndex[filterIndex || 0]]: e ? e : null,
                }));
              }}
            />
          </WrapperCheckbox>
          <Row gutter={[8, 0]}>
            <Col>
              <Button
                type="primary"
                onClick={() =>
                  handleSearch(dataIndex[filterIndex || 0], confirm)
                }
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
                loading={state.loading}
              >
                {t(messageTrans.filterSearchButton())}
              </Button>
            </Col>
            <Col>
              <Button
                onClick={() =>
                  handleReset(dataIndex[filterIndex || 0], confirm)
                }
                size="small"
                loading={state.loading}
                style={{ width: 90 }}
              >
                {t(messageTrans.filterResetButton())}
              </Button>
            </Col>
          </Row>
        </Wrapper>
      );
    },
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
            state.filterColumns![dataIndex[filterIndex || 0]]?.includes(text) &&
              options.find(option => option.value === Number(text))?.label,
            state.params.search &&
              state.params.search.length > 0 &&
              state.params.search,
          ]}
          autoEscape
          textToHighlight={
            text
              ? options.find(option => option.value === Number(dataText))?.label
              : ''
          }
        />
      ) : (
        options.find(option => option.value === Number(dataText))?.label
      );
    },
  });

  const getColumnSearchCheckboxFromToProps = (
    dataIndex: string[],
    options: CheckboxOptionType[],
    range: string,
    filterIndex?: number,
  ) => ({
    filterDropdown: ({ confirm }) => {
      return (
        <Wrapper>
          <WrapperCheckbox>
            <Checkbox.Group
              value={selectedKeys[dataIndex[filterIndex || 0]]}
              options={options}
              onChange={e => {
                setSelectedKeys(prevState => ({
                  ...prevState,
                  [dataIndex[filterIndex || 0]]: e.toString()
                    ? e.toString()
                    : null,
                }));
              }}
            />
          </WrapperCheckbox>
          <Row gutter={[8, 0]}>
            <Col>
              <Button
                type="primary"
                onClick={() =>
                  handleFromToSearch(
                    dataIndex[filterIndex || 0],
                    range,
                    confirm,
                  )
                }
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
                loading={state.loading}
              >
                {t(messageTrans.filterSearchButton())}
              </Button>
            </Col>
            <Col>
              <Button
                onClick={() => handleFromToReset(confirm)}
                size="small"
                loading={state.loading}
                style={{ width: 90 }}
              >
                {t(messageTrans.filterResetButton())}
              </Button>
            </Col>
          </Row>
        </Wrapper>
      );
    },
    onFilter: (value, record) =>
      record[dataIndex[filterIndex || 0]]
        ? record[dataIndex[filterIndex || 0]]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
  });

  return {
    getColumnSorterProps,
    getColumnSearchInputProps,
    getColumnSearchTagProps,
    getColumnSearchCheckboxProps,
    getColumnSearchCheckboxFromToProps,
  };
};

const Wrapper = styled.div`
  padding: 8px;
`;

const WrapperCheckbox = styled.div`
  .ant-checkbox-group {
    display: grid;
  }

  border-bottom: 1px solid #d5d4d5;
  padding-bottom: 7px;
  margin-bottom: 7px;
`;
