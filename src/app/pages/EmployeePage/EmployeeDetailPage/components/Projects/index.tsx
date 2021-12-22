/**
 *
 * Projects
 *
 */
import React, { memo, useState, useCallback, useEffect, Key } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { Popover, Table, TablePaginationConfig, Tooltip } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { UsersMessages } from 'app/pages/EmployeePage/EmployeeListPage/messages';
import { useHistory } from 'react-router-dom';
import { ProjectModal } from '../ProjectModal';
import { useHandleDataTable } from 'app/pages/EmployeePage/EmployeeListPage/useHandleDataTable';
import { useTableConfig } from 'utils/tableConfig';
import { useEmployeeProjectSlice } from './slice';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectEmployeeProject,
  selectEmployeeProjectIsFilter,
  selectEmployeeProjectParams,
} from './slice/selectors';
import { ProjectsMessages } from 'app/pages/ProjectPage/ProjectListPage/messages';
import { FilterValue, SorterResult } from 'antd/lib/table/interface';
import Button, { IconButton } from 'app/components/Button';
import { PrivatePath } from 'utils/url.const';
import { StyledLink, Wrapper } from 'styles/StyledCommon';
import moment from 'moment';
import { useProjectDetail } from 'app/pages/ProjectPage/ProjectDetailPage/useProjectDetail';
import { getSelectValues } from 'utils/variable';

interface ProjectsProps {
  employeeId: string;
}

export const Projects = memo(({ employeeId }: ProjectsProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<any>();

  const { actions } = useEmployeeProjectSlice();
  const dispatch = useDispatch();

  const params = useSelector(selectEmployeeProjectParams);
  const isFilter = useSelector(selectEmployeeProjectIsFilter);
  const getEmployeeProjectState = useSelector(selectEmployeeProject);

  const {
    setSelectedRows,
    setOrdering,
    setPagination,
    setFilterText,
  } = useHandleDataTable(getEmployeeProjectState, actions);

  const { getColumnSorterProps, getColumnSearchInputProps } = useTableConfig(
    getEmployeeProjectState,
    ProjectsMessages,
    setFilterText,
  );

  const { statuses, roles, getStatuses, getRoles } = useProjectDetail();

  const fetchEmployeeProject = useCallback(() => {
    if (!isFilter) {
      dispatch(
        actions.fetchEmployeeProject({ id: employeeId, params: params }),
      );
    }
  }, [actions, dispatch, employeeId, isFilter, params]);

  useEffect(() => {
    fetchEmployeeProject();
    getStatuses();
    getRoles();
  }, [fetchEmployeeProject, getStatuses, getRoles]);

  const moreButton = (value: any, record) => {
    return (
      <>
        <Tooltip title={t(UsersMessages.listViewTooltip())}>
          <IconButton
            type="primary"
            shape="circle"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              history.push(`${PrivatePath.PROJECTS}/${value.id}`);
            }}
          />
        </Tooltip>
        <Tooltip title={t(UsersMessages.listEditTooltip())}>
          <IconButton
            shape="circle"
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setOpen(true);
              setSelectedProject(record);
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
              // showDeleteModal();
              // setIdUserDelete(text);
              // setDeleteEmployee(record);
            }}
          />
        </Tooltip>
      </>
    );
  };

  const columns: any = [
    {
      title: 'Project Name',
      dataIndex: 'project',
      ...getColumnSorterProps('name', 1),
      ...getColumnSearchInputProps(['name']),
      render: (value, record) => {
        return (
          <StyledLink to={`${PrivatePath.PROJECTS}/${value.id}`}>
            {value.name}
          </StyledLink>
        );
      },
    },
    {
      title: 'Allocation',
      dataIndex: 'allocation',
      ...getColumnSorterProps('allocation', 2),
    },
    {
      title: 'Role',
      dataIndex: 'project_role',
      ...getColumnSorterProps('project_role', 3),
      render: value => getSelectValues(roles, value)?.label,
    },
    {
      title: 'Start Date',
      dataIndex: ['project', 'started'],
      render: text => (text ? moment(text).format('DD-MM-YYYY') : ''),
    },
    {
      title: 'Joined',
      dataIndex: 'joined_at',
      render: text => (text ? moment(text).format('DD-MM-YYYY') : ''),
    },
    {
      title: 'Status',
      dataIndex: ['project', 'status'],
      render: value => getSelectValues(statuses, value)?.label,
    },
    {
      title: 'Actions',
      dataIndex: 'project',
      render: (value, record, index: number) => {
        return (
          <>
            <Popover
              content={() => moreButton(value, record)}
              placement="bottom"
            >
              <IconButton shape="circle" size="small" icon={<MoreOutlined />} />
            </Popover>
          </>
        );
      },
    },
  ];

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[],
  ) => {
    setOrdering(sorter);
  };

  const handleSelectedRows = (selectedRowKeys: Key[], selectedRows: any[]) => {
    setSelectedRows(selectedRowKeys, selectedRows);
  };

  return (
    <Wrapper>
      <Header>
        <StyledButton
          type="primary"
          icon={<PlusCircleOutlined />}
          onClick={() => setOpen(true)}
          size="middle"
        >
          Add project
        </StyledButton>
      </Header>

      <Table
        rowSelection={{
          selectedRowKeys: getEmployeeProjectState.selectedRowKeys,
          onChange: handleSelectedRows,
        }}
        bordered
        columns={columns}
        rowKey="id"
        dataSource={getEmployeeProjectState.projects}
        pagination={{
          ...getEmployeeProjectState.pagination,
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
        loading={getEmployeeProjectState.loading}
        onChange={handleTableChange}
        scroll={{ x: 1100 }}
      />

      <ProjectModal
        id={employeeId}
        open={open}
        setOpen={setOpen}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
      />
    </Wrapper>
  );
});

const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-bottom: 20px;
`;

const StyledButton = styled(Button)`
  svg {
    vertical-align: baseline;
  }
`;
