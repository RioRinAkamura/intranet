import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { models } from '@hdwebsoft/intranet-api-sdk';
import {
  CreateEmployeeSkillQueryParam,
  EmployeeSkill,
  UpdateEmployeeSkillQueryParam,
} from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';
import {
  Checkbox,
  Col,
  DatePicker,
  Form,
  Popover,
  Rate,
  Row,
  Select,
  Table,
  TablePaginationConfig,
  Tooltip,
} from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { FilterValue, SorterResult } from 'antd/lib/table/interface';
import { ActionIcon } from 'app/components/ActionIcon';
import AddSkillModal from 'app/components/AddSkillModal';
import { Avatar } from 'app/components/Avatar/Loadable';
import { useBreadCrumbContext } from 'app/components/Breadcrumbs/context';
import Button, { IconButton } from 'app/components/Button';
import { CardLayout } from 'app/components/CardLayout';
import CopyToClipboard from 'app/components/CopyToClipboard';
import { DeleteConfirmModal } from 'app/components/DeleteConfirmModal';
import { DeleteModal } from 'app/components/DeleteModal';
import { DialogModal } from 'app/components/DialogModal';
import PageTitle from 'app/components/PageTitle';
import { useGetSkills } from 'app/components/Skills/useGetSkill';
import { TagComponent } from 'app/components/Tags/components/Tag';
import { ToastMessageType, useNotify } from 'app/components/ToastNotification';
import { TotalSearchForm } from 'app/components/TotalSearchForm';
import { ProjectsMessages } from 'app/pages/ProjectPage/ProjectListPage/messages';
import { useSkillDetails } from 'app/pages/SkillManagePage/useSkillDetails';
import config from 'config';
import moment from 'moment';
import { parse } from 'query-string';
import { stringify } from 'querystring';
import React, { Key, useCallback, useEffect, useState } from 'react';
import { isMobileOnly } from 'react-device-detect';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import styled from 'styled-components/macro';
import { StyledLink } from 'styles/StyledCommon';
import { RootState } from 'types';
import { api } from 'utils/api';
import { phoneFormat } from 'utils/phoneFormat';
import { useTableConfig } from 'utils/tableConfig';
import { PrivatePath } from 'utils/url.const';
import { useHandleEmployeeDetail } from '../EmployeeDetailPage/useHandleEmployeeDetail';
import { EmployeeList } from './components/EmployeeList/Loadable';
import { HeaderButton } from './components/HeaderButton/Loadable';
import { UsersMessages } from './messages';
import { useUserspageSlice } from './slice';
import {
  selectUserspage,
  selectUserspageIsFilter,
  selectUserspageParams,
} from './slice/selectors';
import { useHandleDataTable } from './useHandleDataTable';

type Employee = models.hr.Employee;

const { Option } = Select;

export const EmployeeListPage: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const urlParams = parse(location.search, {
    sort: false,
  });
  const { setBreadCrumb } = useBreadCrumbContext();
  useEffect(() => {
    setBreadCrumb('Employees');
  }, [setBreadCrumb]);
  const [moreLoading, setMoreLoading] = useState(true);
  const [userList, setUserList] = useState<Employee[]>([]);
  const { categories, fetchAllCategory } = useSkillDetails();
  const [isMore, setIsMore] = useState(true);
  const { notify } = useNotify();
  const [searchForm] = Form.useForm();
  const [idUserDelete, setIdUserDelete] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalMultiDeleteVisible, setIsModalMultiDeleteVisible] = useState(
    false,
  );
  const [selectEmployee, setSelectEmployee] = useState<Employee>();
  const [selectEmployeeProject, setSelectEmployeeProject] = useState(
    urlParams.same_project ? urlParams.same_project : 'all',
  );
  const deleteModalState = useSelector(
    (state: RootState) => state.employeespage,
  );
  const { data: skills } = useGetSkills(true);

  const deleteSuccess = deleteModalState?.deleteSuccess;
  const deleteFailed = deleteModalState?.deleteFailed;
  const [textCopy, setTextCopy] = useState(false);
  const [imported, setImported] = useState(false);
  const [openCheckedModal, setOpenCheckedModal] = useState(false);
  const [openSkillsModal, setOpenSkillModal] = useState(false);
  let [recordValue, setRecordValue] = useState<Employee>();
  const [employeeSkills, setEmployeeSkills] = useState<any[]>([]);
  const [employeeRecord, setEmployeeRecord] = useState<any>();
  const [skillModalVisible, setSkillModalVisible] = useState<boolean>(false);
  const [skillChange, setSkillChange] = useState<boolean>(false);
  const { actions } = useUserspageSlice();
  const dispatch = useDispatch();

  const params = useSelector(selectUserspageParams);
  const isFilter = useSelector(selectUserspageIsFilter);
  const getUserListState = useSelector(selectUserspage);

  const { update, monitorings, getMonitorings } = useHandleEmployeeDetail();

  const {
    setSelectedRows,
    setSearchText,
    resetSearch,
    setOrdering,
    setPagination,
    setFilterText,
  } = useHandleDataTable(getUserListState, actions);

  const {
    getColumnSorterProps,
    getColumnSearchInputProps,
    getColumnSearchPhoneProps,
    getColumnSearchTagProps,
    getColumnSearchSkillsProps,
    getColumnSearchCheckboxFromToProps,
    getColumnSearchCheckboxProps,
  } = useTableConfig(getUserListState, UsersMessages, setFilterText);

  const fetchUsers = useCallback(() => {
    if (!isFilter) {
      dispatch(actions.fetchUsers({ params: params }));
    }
  }, [actions, dispatch, params, isFilter]);

  useEffect(() => {
    fetchUsers();
    getMonitorings();
  }, [fetchUsers, getMonitorings]);

  useEffect(() => {
    fetchAllCategory();
  }, [fetchAllCategory]);

  useEffect(() => {
    if (imported) {
      dispatch(actions.fetchUsers({ params: params }));
    }
  }, [actions, dispatch, imported, params]);

  const showDeleteModal = () => {
    setIsModalVisible(true);
  };

  const handleConfirmDelete = () => {
    setIsModalVisible(false);
    dispatch(actions.deleteUser(idUserDelete));
  };

  const handleCancelDeleteModal = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (deleteSuccess) {
      notify({
        type: ToastMessageType.Info,
        message: 'Delete successful',
        duration: 2,
      });
    } else if (deleteFailed) {
      notify({
        type: ToastMessageType.Error,
        message: 'Delete failed',
        duration: 2,
      });
    }
  }, [deleteFailed, deleteModalState, deleteSuccess, notify]);

  const descriptionDelete = (
    <p>
      You're about to permanently delete your employee{' '}
      <Tooltip
        title={<div>{textCopy ? 'Copied' : 'Click to copy'}</div>}
        onVisibleChange={visible => visible === true && setTextCopy(false)}
      >
        <strong
          id="deletedEmail"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            let copyText = document.getElementById('deletedEmail')?.innerText;
            if (copyText) {
              navigator.clipboard.writeText(copyText);
              setTextCopy(true);
            }
          }}
        >{`${selectEmployee?.email}`}</strong>
      </Tooltip>
      . This will also delete any references to your employee.
    </p>
  );

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[],
  ) => {
    setOrdering(sorter);
  };

  useEffect(() => {
    const users = getUserListState.employees;
    setUserList(prev => prev.concat(users ? users : []));
  }, [getUserListState.employees]);

  useEffect(() => {
    const handleLoadMore = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.scrollingElement?.scrollHeight
      ) {
        if (moreLoading) {
          if (getUserListState.pagination?.total !== userList.length) {
            setPagination({
              current:
                getUserListState.pagination?.current &&
                getUserListState.pagination.current + 1,
            });
          } else {
            setIsMore(false);
            setMoreLoading(false);
          }
        }
      }
    };
    if (isMobileOnly) {
      document.addEventListener('scroll', handleLoadMore);
      return () => {
        document.removeEventListener('scroll', handleLoadMore);
      };
    }
  }, [
    getUserListState.pagination,
    getUserListState.params.limit,
    isMore,
    moreLoading,
    setPagination,
    userList,
  ]);

  const totalSearch = checked => {
    const values = searchForm.getFieldValue('search');
    setSearchText(values, checked);
  };

  const resetTotalSearch = () => {
    searchForm.setFieldsValue({ search: undefined });
    resetSearch();
  };

  const handleSearchEmployeeProjectList = value => {
    setSelectEmployeeProject(value);
    if (value === 'all') {
      history.push(`${PrivatePath.EMPLOYEES}`);
      dispatch(actions.changeState({ ...params, same_projects: undefined }));
    } else if (value === 'active_projects') {
      history.replace({
        search: stringify({
          same_project: 'active_projects',
          ...urlParams,
        }),
      });
      dispatch(
        actions.changeState({ ...params, same_projects: 'active_projects' }),
      );
    } else if (value === 'achieved_projects') {
      history.replace({
        search: stringify({
          same_project: 'achieved_projects',
          ...urlParams,
        }),
      });
      dispatch(
        actions.changeState({ ...params, same_projects: 'achieved_projects' }),
      );
    }
    dispatch(actions.fetchUsers({ params: params }));
  };

  const handleSelectedRows = (
    selectedRowKeys: Key[],
    selectedRows: Employee[],
  ) => {
    setSelectedRows(selectedRowKeys, selectedRows);
  };

  const handleCopyEmployee = record => {
    const data = {
      ID: record.id,
      Name: record.first_name + ' ' + record.last_name,
      Email: record.email,
      Phone: record.phone,
      Tags: record.tags,
      Project: record.projects.map(pro => pro.name),
    };
    navigator.clipboard.writeText(JSON.stringify(data, null, '\t'));
    notify({
      type: ToastMessageType.Info,
      message: 'Copied',
      duration: 2,
    });
  };
  const moreButton = (text: string, record: Employee) => (
    <>
      <Tooltip title={t(UsersMessages.listCopyTooltip())}>
        <IconButton
          type="primary"
          shape="circle"
          size="small"
          icon={<CopyOutlined />}
          onClick={() => {
            handleCopyEmployee(record);
          }}
        />
      </Tooltip>
      <Tooltip title={t(UsersMessages.listViewTooltip())}>
        <IconButton
          type="primary"
          shape="circle"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            history.push(`${PrivatePath.EMPLOYEES}/${text}`);
          }}
        />
      </Tooltip>
      <Tooltip title={t(UsersMessages.listEditTooltip())}>
        <IconButton
          shape="circle"
          icon={<EditOutlined />}
          size="small"
          onClick={() => {
            history.push({
              pathname: `${PrivatePath.EMPLOYEES}/${text}/edit`,
              state: { edit: true },
            });
          }}
        />
      </Tooltip>
      <Tooltip title={t(UsersMessages.listDeleteTooltip())}>
        <IconButton
          danger
          shape="circle"
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => {
            showDeleteModal();
            setIdUserDelete(text);
            setSelectEmployee(record);
          }}
        />
      </Tooltip>
    </>
  );

  const handleSelectMonitorings = async (value, record: Employee) => {
    record = { ...record, monitoring: value };
    try {
      const response = await update(record);
      if (response) {
        dispatch(actions.fetchUsers({ params: params }));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const DATE_FORMAT = config.DATE_FORMAT;
  const todayPicker = moment(new Date());
  const todayFormat = todayPicker.format(DATE_FORMAT);
  const [newDateCheck, setNewDateCheck] = useState(false);
  const [todayCheck, setTodayCheck] = useState(false);
  const [dayPickerValue, setDayPickerValue] = useState<any>();

  const [checkedDate, setCheckedDate] = useState<string>();
  const disabledDate = (current: moment.Moment) => {
    return current < moment().startOf('day');
  };

  const handleCheckedButton = record => {
    setRecordValue(record);
    setOpenCheckedModal(true);
    setTodayCheck(true);
    setDayPickerValue(todayPicker);
  };

  const handleCheckNewReviewDate = () => {
    setNewDateCheck(!newDateCheck);
    setCheckedDate(todayFormat);
    setTodayCheck(false);
  };

  const handleNewDateCheck = date => {
    setDayPickerValue(date);
    setTodayCheck(false);
    const newDate = moment(date);
    const newDateFormat = moment(date).format(DATE_FORMAT);

    if (
      newDate.date() === todayPicker.date() &&
      newDate.month() === todayPicker.month() &&
      newDate.year() === todayPicker.year()
    ) {
      setCheckedDate(todayFormat);
    } else {
      setCheckedDate(newDateFormat);
    }
  };

  const handleSubmitCheckedModal = async () => {
    if (todayCheck && recordValue) {
      recordValue = { ...recordValue, monitored_at: todayFormat };
      try {
        delete recordValue.next_monitored_at;
        const response = await update(recordValue);
        if (response) {
          dispatch(actions.fetchUsers({ params: params }));
        }
      } catch (e) {
        console.log(e);
      }
    } else if (recordValue) {
      recordValue = {
        ...recordValue,
        monitored_at: todayFormat,
        next_monitored_at: checkedDate,
      };
      try {
        const response = await update(recordValue);
        if (response) {
          dispatch(actions.fetchUsers({ params: params }));
        }
      } catch (e) {
        console.log(e);
      }
    }
    setOpenCheckedModal(false);
    setNewDateCheck(false);
    setDayPickerValue(todayPicker);
  };

  const handleCancelCheckedModal = () => {
    setOpenCheckedModal(false);
    setNewDateCheck(false);
  };

  const handleCancelSkillModal = async () => {
    setOpenSkillModal(false);
    if (skillChange) {
      dispatch(actions.fetchUsers({ params: params }));
      setSkillChange(false);
    }
  };
  const calcMonitoringDate = date => {
    let calc = moment().diff(moment(date), 'days');
    if (calc < 1) {
      return 'Today';
    } else if (calc < 2) {
      return `${calc} day ago.`;
    } else {
      return `${calc} days ago.`;
    }
  };

  const handleClickedSkills = (value, record: Employee) => {
    setEmployeeSkills(() => [...value]);
    setEmployeeRecord(() => ({ ...record }));
    setOpenSkillModal(true);
  };

  const columns: ColumnProps<Employee>[] = [
    {
      dataIndex: 'avatar',
      width: 30,
      align: 'center',
      className: 'avatar',
      render: (text, record: Employee) => (
        <StyledLink to={`${PrivatePath.EMPLOYEES}/${record.id}`}>
          <Avatar
            size={40}
            src={text}
            alt={record.first_name + ' ' + record.last_name}
            name={record.first_name + ' ' + record.last_name}
          />
        </StyledLink>
      ),
    },
    {
      title: t(UsersMessages.listNameTitle()),
      dataIndex: 'first_name',
      width: 75,
      ...getColumnSorterProps('first_name', 1),
      ...getColumnSearchInputProps(['first_name', 'last_name']),
      render: (text, record: Employee) => (
        <StyledLink
          to={`${PrivatePath.EMPLOYEES}/${record.id}`}
          title={`${text} ${record.last_name}`}
        >
          {text} {record.last_name}
        </StyledLink>
      ),
    },
    {
      title: 'Code',
      dataIndex: 'code',
      width: 70,
      ...getColumnSorterProps('code', 2),
      ...getColumnSearchInputProps(['code']),
      render: (text, record: Employee) =>
        text ? (
          <StyledLink to={`${PrivatePath.EMPLOYEES}/${record.id}`} title={text}>
            {text}
          </StyledLink>
        ) : (
          ''
        ),
    },
    {
      title: t(UsersMessages.listEmailTitle()),
      dataIndex: 'email',
      ellipsis: false,
      width: 120,
      ...getColumnSorterProps('email', 3),
      ...getColumnSearchInputProps(['email']),
      render: (text, record: Employee) =>
        text ? (
          <>
            <span>{text}</span>
            <StyledCopyIcon>
              <CopyToClipboard text={text} />
            </StyledCopyIcon>
          </>
        ) : (
          ''
        ),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      width: 95,
      ...getColumnSorterProps('phone', 4),
      ...getColumnSearchPhoneProps('phone'),
      render: (text, record: Employee) => (
        <>
          <span>{phoneFormat(text)}</span>
          <StyledCopyIcon>
            <CopyToClipboard text={text} />
          </StyledCopyIcon>
        </>
      ),
    },
    {
      title: 'Position',
      dataIndex: 'position',
      width: 90,
      ...getColumnSorterProps('position', 5),
      ...getColumnSearchInputProps(['position']),
    },
    {
      title: 'Allocable',
      dataIndex: 'allocable',
      width: 90,
      ...getColumnSorterProps('allocable', 6),
      ...getColumnSearchCheckboxFromToProps(
        ['allocable'],
        [
          { label: 'Yes', value: true },
          { label: 'No', value: false },
        ],
        '',
        0,
        1, // isAllocableFilter
      ),
      render: (status: boolean) => <Checkbox checked={status} />,
    },
    {
      title: 'Skills',
      dataIndex: 'skills',
      width: 100,
      ...getColumnSearchSkillsProps('skills'),
      render: (value, record: Employee) => {
        const starArr = value.map(star => star.level);
        let totalStar = starArr.reduce((total, current) => {
          return total + current;
        }, 0);
        const averageStar = Number(
          (totalStar / (value.length ? value.length : 1)).toFixed(1),
        );
        const skillArr = [...value];
        const bestSkills = skillArr.sort((a, b) => b.level - a.level);
        const fiveBestSkills = bestSkills.slice(0, 5);

        return (
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => handleClickedSkills(value, record)}
          >
            <RateSkill
              disabled
              allowHalf
              value={averageStar}
              style={{ cursor: 'pointer' }}
            />
            {fiveBestSkills.map(skill => (
              <span key={skill.id} style={{ fontSize: '12px' }}>
                {skill.skill.name}({skill.level})&nbsp;
              </span>
            ))}
          </div>
        );
      },
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      width: 90,
      ...getColumnSearchTagProps('tags'),
      render: (text, record: Employee, index: number) => {
        return (
          <>
            {text.map(tag => {
              return <TagComponent tag={tag} key={tag} />;
            })}
          </>
        );
      },
    },

    {
      title: t(ProjectsMessages.listMonitoringTitle()),
      dataIndex: 'monitoring',
      width: 95,
      ...getColumnSorterProps('monitoring', 2),
      ...getColumnSearchCheckboxProps(['monitoring'], monitorings),
      render: (text, record: Employee) => (
        <>
          <SelectMonitorings
            onChange={value => handleSelectMonitorings(value, record)}
            defaultValue={text}
            style={{
              color:
                record.monitoring === '1'
                  ? 'green'
                  : record.monitoring === '2'
                  ? 'black'
                  : record.monitoring === '3'
                  ? '#d46b08'
                  : record.monitoring === '4'
                  ? 'red'
                  : '',
            }}
          >
            {monitorings &&
              monitorings.map((item, index: number) => (
                <Option
                  key={index}
                  value={item.value}
                  style={{
                    color:
                      item.label === 'Good'
                        ? 'green'
                        : item.label === 'Normal'
                        ? 'black'
                        : item.label === 'Concerned'
                        ? '#d46b08'
                        : item.label === 'Bad'
                        ? 'red'
                        : '',
                  }}
                >
                  {item.label}
                </Option>
              ))}
          </SelectMonitorings>
        </>
      ),
    },
    {
      title: 'Checked',
      dataIndex: '',
      width: 80,
      align: 'center',
      render: (text, record: Employee) => (
        <>
          <span>Last check: {calcMonitoringDate(record.monitored_at)}</span>
          <CheckedButton
            size="small"
            className={`${
              moment(todayFormat).diff(
                moment(record.next_monitored_at),
                'days',
              ) >= 0
                ? 'red'
                : 'color-grey'
            }`}
            onClick={() => handleCheckedButton(record)}
          >
            Check
          </CheckedButton>
        </>
      ),
    },

    {
      title: 'Hours per week',
      className: 'totalAllocated',
      dataIndex: 'total_active_project_allocated_hour_weekly',
      width: 90,
      ...getColumnSorterProps('total_active_project_allocated_hour_weekly', 7),
      ...getColumnSearchCheckboxFromToProps(
        ['total_active_project_allocated_hour_weekly'],
        [
          { label: '< 40h per week', value: 1 },
          { label: '40h per week', value: 2 },
          { label: '> 40h per week', value: 3 },
        ],
        '40.0',
      ),
      render: (text, record: Employee) =>
        text ? (
          <StyledLink
            to={`${PrivatePath.EMPLOYEES}/${record.id}/projects`}
            title={text}
          >
            {text}
          </StyledLink>
        ) : (
          ''
        ),
    },
    {
      title: <ActionIcon />,
      dataIndex: 'id',
      width: 40,
      fixed: 'right',
      align: 'center',
      render: (text, record: Employee, index: number) => {
        return (
          <>
            <Popover
              content={() => moreButton(text, record)}
              placement="bottom"
            >
              <IconButton shape="circle" size="small" icon={<MoreOutlined />} />
            </Popover>
          </>
        );
      },
    },
  ];

  const handleMultiDelete = async () => {
    try {
      await api.hr.employee.bulkDelete(
        (getUserListState?.selectedRowKeys as string[]) || [],
      );
      dispatch(actions.selectedRows({ selectedRowKeys: [], selectedRows: [] }));
      notify({
        type: ToastMessageType.Info,
        message: 'Delete successful',
        duration: 2,
      });
      dispatch(actions.fetchUsers({ params: params }));
    } catch (e) {
      notify({
        type: ToastMessageType.Error,
        message: 'Delete failed',
        duration: 2,
      });
    } finally {
      setIsModalMultiDeleteVisible(false);
      dispatch(actions.resetStateDeleteModal());
    }
  };

  const handleCancelMultiDeleteModal = () => {
    setIsModalMultiDeleteVisible(false);
  };

  const handleAddEmployeeSkill = async selectedSkills => {
    try {
      const arrPromise: any = await selectedSkills?.map(skillId => {
        const newSkill: CreateEmployeeSkillQueryParam = {
          skill_id: skillId as string,
          employee_id: employeeRecord?.id as string,
        };

        return api.hr.employee.skill.create(
          employeeRecord?.id as string,
          newSkill,
        );
      });

      Promise.all(arrPromise).then(values => {
        const newEmloyeeSkills = [...employeeSkills, ...values];
        setEmployeeSkills(newEmloyeeSkills);
        setEmployeeRecord(prevState => {
          return {
            ...prevState,
            skills: newEmloyeeSkills,
          };
        });
        setSkillModalVisible(false);
        notify({
          type: ToastMessageType.Info,
          message: 'Add skill successful',
          duration: 2,
        });
      });
    } catch (e) {
      console.log(e);
    }
  };

  const onEmployeeSkillChange = async (employeeSkill: EmployeeSkill, value) => {
    setEmployeeRecord(prevState => {
      const newSkill = [...prevState.skills].map(skill => {
        return {
          ...skill,
          level: skill.id === employeeSkill.id ? value : skill.level,
        };
      });
      return {
        ...prevState,
        skills: newSkill,
      };
    });
    setSkillChange(true);
    try {
      const updatedSkill: UpdateEmployeeSkillQueryParam = {
        id: employeeSkill.id,
        level: value,
        employee_id: employeeRecord?.id as string,
        skill_id: employeeSkill.skill.id,
      };
      await api.hr.employee.skill.update(
        employeeRecord?.id as string,
        updatedSkill,
      );
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t(UsersMessages.title())}</title>
        <meta name="description" content={t(UsersMessages.description())} />
      </Helmet>
      <PageTitle title={t(UsersMessages.title())}>
        <TotalSearchForm
          form={searchForm}
          value={getUserListState.params.search}
          loading={getUserListState.loading ? true : false}
          messageTrans={UsersMessages}
          onSearch={totalSearch}
          onReset={resetTotalSearch}
          searchDeleted={true}
          searchEmployeeProjects={selectEmployeeProject}
          searchEmployeeProjectList={handleSearchEmployeeProjectList}
        />
      </PageTitle>
      {isMobileOnly ? (
        <EmployeeList
          loading={getUserListState.loading ? true : false}
          data={userList}
          isMore={isMore}
          moreLoading={moreLoading}
          onDelete={(id: string, user: Employee) => {
            showDeleteModal();
            setIdUserDelete(id);
            setSelectEmployee(user);
          }}
        />
      ) : (
        <CardLayout>
          <Row>
            <Col span={8} style={{ marginBottom: '1em' }}>
              <Row style={{ height: '100%' }} justify="start" align="middle">
                {getUserListState.selectedRowKeys &&
                  getUserListState.selectedRowKeys.length > 0 && (
                    <Button
                      type="primary"
                      size="middle"
                      danger
                      disabled={
                        !getUserListState?.selectedRowKeys?.length ||
                        getUserListState?.selectedRowKeys?.length === 0
                      }
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        // handleMultiDelete();
                        setIsModalMultiDeleteVisible(true);
                      }}
                    />
                  )}
                <span style={{ marginLeft: '6px' }}>
                  Total: {getUserListState.pagination?.total}
                </span>
              </Row>
            </Col>
            <Col span={16}>
              <HeaderButton
                imported={imported}
                setImported={setImported}
                selectedRows={getUserListState.selectedRows}
              />
            </Col>
            <Col span={24}>
              <TableWrapper>
                <Table
                  rowSelection={{
                    columnWidth: 20,
                    selectedRowKeys: getUserListState.selectedRowKeys,
                    onChange: handleSelectedRows,
                  }}
                  columns={columns}
                  rowKey="id"
                  dataSource={getUserListState.employees}
                  pagination={{
                    ...getUserListState.pagination,
                    onChange: (page: number, pageSize?: number) => {
                      setPagination({ current: page, pageSize });
                    },
                    showTotal: (total, range) => (
                      <div>
                        Showing{' '}
                        <span>
                          {range[0]}-{range[1]}
                        </span>{' '}
                        of {total} items
                      </div>
                    ),
                    pageSizeOptions: ['10', '20', '50', '100'],
                    showSizeChanger: true,
                  }}
                  loading={getUserListState.loading}
                  onChange={handleTableChange}
                  scroll={{ x: 1450 }}
                />
              </TableWrapper>
            </Col>
          </Row>
        </CardLayout>
      )}
      <DeleteConfirmModal
        visible={isModalVisible}
        handleOk={handleConfirmDelete}
        handleCancel={handleCancelDeleteModal}
        title={`Remove ${selectEmployee?.first_name} ${selectEmployee?.last_name}`}
        description={descriptionDelete}
        answer={`${selectEmployee?.email}`}
      />
      <DeleteModal
        open={isModalMultiDeleteVisible}
        handleDelete={handleMultiDelete}
        handleCancel={handleCancelMultiDeleteModal}
        content="Are you sure you want to delete this information?"
      />
      <DialogModal
        isOpen={openCheckedModal}
        cancelText={'No'}
        okText={'Yes'}
        title={'Checked'}
        handleCancel={handleCancelCheckedModal}
        handleSubmit={handleSubmitCheckedModal}
      >
        <p>Are you sure you reviewed this employee status carefully today? </p>
        <Checkbox
          checked={newDateCheck}
          onChange={handleCheckNewReviewDate}
          style={{ margin: '12px 0px 12px 0px' }}
        >
          Set next review date
        </Checkbox>
        <DatePicker
          style={{ marginLeft: '16px' }}
          disabledDate={disabledDate}
          onChange={date => handleNewDateCheck(date)}
          value={dayPickerValue}
          disabled={!newDateCheck}
        ></DatePicker>
      </DialogModal>
      <DialogModal
        isOpen={openSkillsModal}
        okText={'Add'}
        title={
          employeeRecord?.first_name +
          ' ' +
          employeeRecord?.last_name +
          ' skills'
        }
        handleCancel={handleCancelSkillModal}
        handleSubmit={() => setSkillModalVisible(true)}
      >
        {employeeRecord &&
          employeeRecord?.skills.map((skill, index) => (
            <Row gutter={[8, 8]} key={index}>
              <Col span={6}>
                <span>
                  {index + 1}. {skill.skill.name}
                </span>
              </Col>
              <Col span={18}>
                <RateSkill
                  onChange={value => onEmployeeSkillChange(skill, value)}
                  value={skill.level}
                />
              </Col>
            </Row>
          ))}
      </DialogModal>
      <AddSkillModal
        skills={skills}
        categories={categories}
        onCancel={() => setSkillModalVisible(false)}
        isOpenSkilLModal={skillModalVisible}
        employeeSkills={employeeSkills}
        callback={handleAddEmployeeSkill}
      />
    </>
  );
};

const TableWrapper = styled.div`
  .avatar {
    padding: 1em 0;
  }

  .ant-pagination-options {
    order: -1;
    margin-right: 1em;
    margin-left: 0;
  }

  .ant-pagination-total-text {
    margin-inline-end: auto;
    span {
      color: blue;
    }
  }

  .totalAllocated {
    white-space: break-spaces;
  }
`;

const SelectMonitorings = styled(Select)`
  width: 100%;
`;

const CheckedButton = styled(Button)`
  width: 100%;
  &.color-grey {
    background-color: grey;
    border-color: grey;
    color: white;
  }
  &.red {
    background-color: #ff4d4f;
    border-color: #ff4d4f;
    color: white;
  }
`;

const RateSkill = styled(Rate)`
  font-size: 14px;
  li {
    padding: 0px 1px;
    margin-right: 2px !important;
  }
`;
const StyledCopyIcon = styled.div`
  width: fit-content;
  position: absolute;
  span {
    cursor: pointer;
  }
`;
