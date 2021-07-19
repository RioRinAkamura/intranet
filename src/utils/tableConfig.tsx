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
  Select,
  Modal,
  DatePicker,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import Highlighter from 'react-highlight-words';
import { TagsInput } from 'app/components/Tags';
import { TableStateProps } from 'app/pages/EmployeePage/EmployeeListPage/useHandleDataTable';
import { MessageTranslate, TagType } from './types';
import styled from 'styled-components/macro';
import { FilterColumns } from 'app/pages/EmployeePage/EmployeeListPage/slice/types';
import { useProjectDetail } from 'app/pages/ProjectPage/ProjectDetailPage/useProjectDetail';
import moment from 'moment';
import config from 'config';

const DATE_FORMAT = config.DATE_FORMAT;

const { Search } = Input;

interface useTableProps {
  getColumnSorterProps: (dataIndex: string, columnPriority: number) => {};
  getColumnSearchInputProps: (
    dataIndex: string[],
    filterIndex?: number,
    type?: string,
  ) => {};
  getColumnSearchTagProps: (dataIndex: string, tags?: TagType[]) => {};
  getColumnSearchCheckboxProps: (
    dataIndex: string[],
    options: CheckboxOptionType[],
    filterIndex?: number,
    filterOptions?: CheckboxOptionType[],
    callback?: (form) => void,
  ) => {};
  getColumnSearchInputCheckboxProps: (
    dataIndex: string[],
    options: CheckboxOptionType[],
    filterIndex?: number,
    filterOptions?: CheckboxOptionType[],
  ) => {};
  getCustomColumnSearchInputCheckboxProps: (
    dataIndex: string[],
    options: CheckboxOptionType[],
    filterIndex?: number,
    filterOptions?: CheckboxOptionType[],
  ) => {};
  getColumnSearchCheckboxFromToProps: (
    dataIndex: string[],
    options: CheckboxOptionType[],
    range: string,
    filterIndex?: number,
  ) => {};
  getColumnSearchSelectProps: (
    dataIndex: string,
    options,
    placeholder?: string,
    filterIndex?: number,
  ) => {};
  ConfirmModal: () => JSX.Element;
}

const { Option } = Select;

export const useTableConfig = (
  state: TableStateProps,
  messageTrans: MessageTranslate,
  setFilterText: (value: FilterColumns) => void,
): useTableProps => {
  const { t } = useTranslation();
  const { update } = useProjectDetail();
  const [selectedKeys, setSelectedKeys] = React.useState([]);
  const [visible, setVisible] = React.useState(false);
  const [formValue, setFormValue] = React.useState({});
  const [searchOptions, setSearchOptions] = React.useState<
    CheckboxOptionType[]
  >([]);
  const [searchData, setSearch] = React.useState<CheckboxOptionType[]>([]);
  const [customSearchOptions, setCustomSearchOptions] = React.useState<
    CheckboxOptionType[]
  >([]);
  const [customSearchData, setCustomSearch] = React.useState<
    CheckboxOptionType[]
  >([]);

  React.useLayoutEffect(() => {
    if (state.filterColumns) {
      setSelectedKeys(prev => ({ ...prev, ...state.filterColumns }));
    }
  }, [state.filterColumns]);

  const handleOkConfirmModal = async () => {
    try {
      await update(formValue);
      setVisible(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCancelConfirmModal = () => {
    setVisible(false);
  };

  const ConfirmModal = () => (
    <Modal
      title="Confirm Modal"
      visible={visible}
      onOk={handleOkConfirmModal}
      onCancel={handleCancelConfirmModal}
      okText="Ok"
      cancelText="Cancel"
    >
      <p>Are you sure this project has been completed?</p>
    </Modal>
  );

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
    type?: string,
  ) => ({
    ellipsis: true,
    filterDropdown: ({ confirm }) => {
      return (
        <Wrapper>
          {type === 'date' ? (
            <DatePicker
              size="large"
              format={DATE_FORMAT}
              style={{ width: '100%', marginBottom: 10 }}
              onChange={e =>
                setSelectedKeys(prevState => ({
                  ...prevState,
                  [dataIndex[filterIndex || 0]]: e
                    ? moment(e).format(DATE_FORMAT)
                    : null,
                }))
              }
            />
          ) : (
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
          )}

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

  const handleSearchInput = e => {
    const newOptions = [...searchData].filter((item: any) => {
      return item.label.includes(e.target.value);
    });
    setSearchOptions(newOptions);
  };

  const handleCustomSearchInput = e => {
    const newOptions = [...customSearchData].filter((item: any) => {
      return item.label.includes(e.target.value);
    });
    setSearchOptions(newOptions);
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

  const handleFromToReset = (dataIndex: string, confirm: () => void) => {
    setSelectedKeys(prevState => ({
      ...prevState,
      [dataIndex]: undefined,
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
    filterOptions?: CheckboxOptionType[],
    callback?: (form) => void,
  ) => ({
    filterDropdown: ({ confirm }) => {
      return (
        <Wrapper>
          <WrapperCheckbox>
            <Checkbox.Group
              value={selectedKeys[dataIndex[filterIndex || 0]]}
              options={filterOptions ? filterOptions : options}
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
      const handleValueChange = async value => {
        const defaultForm = {
          ...record,
        };
        defaultForm[dataIndex[0]] = value;

        // hard code
        if (dataIndex[0] === 'status' && value === '4') {
          setVisible(true);
          setFormValue({ ...defaultForm });
          return;
        }

        try {
          if (callback) {
            callback(defaultForm);
            return;
          }
          await update(defaultForm);
        } catch (e) {
          console.log(e);
        }
      };
      let defaultValue: string = '';
      const findOption = options.find(
        option => option.value === Number(dataText),
      );
      defaultValue = findOption
        ? findOption.label
          ? findOption.label.toString()
          : ''
        : '';
      return has(state.filterColumns, dataIndex[filterIndex || 0]) ||
        (state.params.search && state.params.search.length > 0) ? (
        <Select
          onChange={handleValueChange}
          defaultValue={defaultValue.length > 0 ? defaultValue : text}
          style={{ width: '100%' }}
        >
          {options.map(option => {
            return (
              <Option value={`${option.value}`}>
                <Highlighter
                  highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                  searchWords={[
                    state.filterColumns![dataIndex[filterIndex || 0]]?.includes(
                      text,
                    ) &&
                      options.find(option => option.value === Number(text))
                        ?.label,
                    state.params.search &&
                      state.params.search.length > 0 &&
                      state.params.search,
                  ]}
                  autoEscape
                  textToHighlight={option.label}
                />
              </Option>
            );
          })}
        </Select>
      ) : (
        <Select
          onChange={handleValueChange}
          defaultValue={defaultValue.length > 0 ? defaultValue : text}
          style={{ width: '100%' }}
        >
          {options.map(option => {
            return <Option value={`${option.value}`}>{option.label}</Option>;
          })}
        </Select>
        // options.find(option => option.value === Number(dataText))?.label
      );
    },
  });
  const getColumnSearchInputCheckboxProps = (
    dataIndex: string[],
    options: CheckboxOptionType[],
    filterIndex?: number,
    filterOptions?: CheckboxOptionType[],
  ) => ({
    filterDropdown: ({ confirm }) => {
      if (searchData.length === 0) {
        setSearchOptions(options);
        setSearch(options);
      }
      return (
        <Wrapper>
          <Search
            onChange={handleSearchInput}
            placeholder="Search"
            style={{ margin: '0 0 10px 0' }}
          />
          <WrapperCheckbox>
            <Checkbox.Group
              value={selectedKeys[dataIndex[filterIndex || 0]]}
              options={searchOptions}
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
  });

  const getCustomColumnSearchInputCheckboxProps = (
    dataIndex: string[],
    options: CheckboxOptionType[],
    filterIndex?: number,
    filterOptions?: CheckboxOptionType[],
  ) => ({
    filterDropdown: ({ confirm }) => {
      if (customSearchData.length === 0) {
        setCustomSearchOptions(options);
        setCustomSearch(options);
      }
      return (
        <Wrapper>
          <Search
            onChange={handleCustomSearchInput}
            placeholder="Search"
            style={{ margin: '0 0 10px 0' }}
          />
          <WrapperCheckbox>
            <Checkbox.Group
              value={selectedKeys[dataIndex[filterIndex || 0]]}
              options={customSearchOptions}
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
                onClick={() =>
                  handleFromToReset(dataIndex[filterIndex || 0], confirm)
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
  });

  const getColumnSearchSelectProps = (
    dataIndex: string,
    options,
    placeholder?: string,
    filterIndex?: number,
  ) => ({
    filterDropdown: ({ confirm }) => {
      return (
        <Wrapper>
          <WrapperCheckbox>
            <Select
              value={selectedKeys[dataIndex[filterIndex || 0]]}
              options={options}
              placeholder={placeholder}
              onChange={e => {
                setSelectedKeys(prevState => ({
                  ...prevState,
                  [dataIndex]: e.toString() || null,
                }));
              }}
            />
          </WrapperCheckbox>
          <Row gutter={[8, 0]}>
            <Col>
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
            </Col>
            <Col>
              <Button
                onClick={() => handleReset(dataIndex, confirm)}
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
    getColumnSearchSelectProps,
    ConfirmModal,
    getColumnSearchInputCheckboxProps,
    getCustomColumnSearchInputCheckboxProps,
  };
};

const Wrapper = styled.div`
  padding: 8px;
`;

const WrapperCheckbox = styled.div`
  .ant-checkbox-group,
  .ant-select {
    display: grid;
    max-height: 300px;
    overflow-y: auto;
  }

  border-bottom: 1px solid #d5d4d5;
  padding-bottom: 7px;
  margin-bottom: 7px;
`;
