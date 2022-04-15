import { SearchOutlined } from '@ant-design/icons';
import { Employee } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';
import {
  Button,
  Checkbox,
  CheckboxOptionType,
  Col,
  DatePicker,
  Input,
  Modal,
  Row,
  Select,
  Space,
} from 'antd';
import { Avatar } from 'app/components/Avatar';
import { PhoneNumber } from 'app/components/PhoneNumber';
import { SkillTagsInput } from 'app/components/SkillTag';
import { TagsInput } from 'app/components/Tags';
import { FilterColumns } from 'app/pages/EmployeePage/EmployeeListPage/slice/types';
import { TableStateProps } from 'app/pages/EmployeePage/EmployeeListPage/useHandleDataTable';
import { useProjectDetail } from 'app/pages/ProjectPage/ProjectDetailPage/useProjectDetail';
import config from 'config';
import { has } from 'lodash';
import moment from 'moment';
import * as React from 'react';
import Highlighter from 'react-highlight-words';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { MessageTranslate, SkillType, TagType } from './types';

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
  getColumnSearchSkillsProps: (dataIndex: string, skills?: SkillType[]) => {};
  getColumnSearchPhoneProps: (dataIndex: string) => {};
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
  getColumnSearchInputCheckboxAvatarProps: (
    dataIndex: Employee[],
    options: CheckboxOptionType[],
    filterIndex?: number,
    filterOptions?: CheckboxOptionType[],
  ) => {};
  getColumnSearchCheckboxFromToProps: (
    dataIndex: string[],
    options: CheckboxOptionType[],
    range: string,
    filterIndex?: number,
    type?: number,
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
  const [searchOptions, setSearchOptions] = React.useState<any[]>([]);
  const [searchData, setSearch] = React.useState<any[]>([]);
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
              format={DATE_FORMAT}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
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

  const handleSearchAvatar = (dataIndex: string, confirm: () => void) => {
    setFilterText({ employee_id: selectedKeys[dataIndex] });
    confirm();
  };

  const handleResetAvatar = (dataIndex: string, confirm: () => void) => {
    setSelectedKeys(prevState => ({
      ...prevState,
      [dataIndex]: undefined,
    }));
    setFilterText({ employee_id: undefined });
    confirm();
  };

  const handleSearchInput = e => {
    const newOptions = [...searchData].filter((item: any) => {
      return item.label.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setSearchOptions(newOptions);
  };

  const handleAvatarSearchInput = e => {
    const newOptions = [...searchData].filter((item: any) => {
      return item.name.toLowerCase().includes(e.target.value.toLowerCase());
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
      setFilterText({ from: undefined, exact: undefined, to: range });
    } else if (selectedKeys[dataIndex] === '2') {
      setFilterText({ from: undefined, exact: range, to: undefined });
    } else if (selectedKeys[dataIndex] === '3') {
      setFilterText({ from: range, exact: undefined, to: undefined });
    } else {
      setFilterText({ from: undefined, exact: undefined, to: undefined });
    }
    confirm();
  };
  const handleAllocableFilter = (dataIndex: string, confirm: () => void) => {
    setFilterText({ allocable: selectedKeys[dataIndex] });
    confirm();
  };
  const handleFromToReset = (
    dataIndex: string,
    confirm: () => void,
    type: string,
  ) => {
    if (type === 'isAllocable') {
      setSelectedKeys(prevState => ({
        ...prevState,
        allocable: undefined,
      }));
      setFilterText({ allocable: undefined });
    } else {
      setSelectedKeys(prevState => ({
        ...prevState,
        [dataIndex]: undefined,
        from: undefined,
        exact: undefined,
        to: undefined,
      }));
      setFilterText({ from: undefined, exact: undefined, to: undefined });
    }
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

  const getColumnSearchPhoneProps = (dataIndex: string) => ({
    filterDropdown: ({ confirm }) => {
      return (
        <Wrapper>
          <PhoneNumber
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

  const getColumnSearchSkillsProps = (dataIndex: string) => ({
    filterDropdown: ({ confirm }) => {
      return (
        <Wrapper>
          <SkillTagsInput
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
          value={defaultValue.length > 0 ? defaultValue : text}
          style={{ width: '100%' }}
        >
          {options.map(option => {
            return (
              <Option key={`${option.value}`} value={`${option.value}`}>
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
          value={defaultValue.length > 0 ? defaultValue : text}
          style={{ width: '100%' }}
        >
          {options.map((option, i) => (
            <Option key={i} value={`${option.value}`}>
              {option.label}
            </Option>
          ))}
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

  const getColumnSearchInputCheckboxAvatarProps = (
    dataIndex: Employee[],
    options: CheckboxOptionType[],
    filterIndex?: number,
    filterOptions?: CheckboxOptionType[],
  ) => ({
    filterDropdown: ({ confirm }) => {
      if (searchData.length === 0) {
        setSearchOptions(dataIndex as any);
        setSearch(dataIndex as any);
      }
      return (
        <Wrapper>
          <Search
            onChange={handleAvatarSearchInput}
            placeholder="Search"
            style={{ margin: '0 0 10px 0' }}
          />
          <WrapperCheckbox>
            {dataIndex && (
              <Checkbox.Group
                value={
                  selectedKeys[dataIndex.map(data => data.id)[filterIndex || 0]]
                }
                onChange={e => {
                  setSelectedKeys(prevState => ({
                    ...prevState,
                    [dataIndex.map(data => data.id)[filterIndex || 0]]: e
                      ? e
                      : null,
                  }));
                }}
              >
                {searchOptions.map(data => (
                  <Row key={data.id}>
                    <Checkbox value={data.id}>
                      <Avatar
                        size={30}
                        src={data.avatar}
                        name={data.first_name + ' ' + data.last_name}
                      />{' '}
                      {`${data.first_name} ${data.last_name}`}
                    </Checkbox>
                  </Row>
                ))}
              </Checkbox.Group>
            )}
          </WrapperCheckbox>
          <Row gutter={[8, 0]}>
            <Col>
              <Button
                type="primary"
                onClick={() =>
                  handleSearchAvatar(
                    dataIndex.map(index => index.id)[filterIndex || 0],
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
                  handleResetAvatar(
                    dataIndex.map(data => data.id)[filterIndex || 0],
                    confirm,
                  )
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
      record[dataIndex.map((data, index) => index)[filterIndex || 0]]
        ? record[dataIndex.map(data => data.id)[filterIndex || 0]]
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
    type?: number,
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
                  // is Hours per week else Allocable
                  type !== 1
                    ? handleFromToSearch(
                        dataIndex[filterIndex || 0],
                        range,
                        confirm,
                      )
                    : handleAllocableFilter(
                        dataIndex[filterIndex || 0],
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
                  handleFromToReset(
                    dataIndex[filterIndex || 0],
                    confirm,
                    // is Hours per week else Allocable
                    type !== 1 ? '' : 'isAllocable',
                  )
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
    getColumnSearchSkillsProps,
    getColumnSearchPhoneProps,
    getColumnSearchCheckboxProps,
    getColumnSearchCheckboxFromToProps,
    getColumnSearchSelectProps,
    ConfirmModal,
    getColumnSearchInputCheckboxProps,
    getCustomColumnSearchInputCheckboxProps,
    getColumnSearchInputCheckboxAvatarProps,
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
