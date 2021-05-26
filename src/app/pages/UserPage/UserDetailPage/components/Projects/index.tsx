/**
 *
 * Projects
 *
 */
import React, { memo, useState, useCallback, useEffect, Key } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { Button, Popover, Table, TablePaginationConfig, Tooltip } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  ProjectOutlined,
} from '@ant-design/icons';
import { UsersMessages } from 'app/pages/UserPage/UserListPage/messages';
import { useHistory, useParams } from 'react-router-dom';
import { ProjectModal } from '../ProjectModal';
import { useHandleDataTable } from 'app/pages/UserPage/UserListPage/useHandleDataTable';
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

export const Projects = memo(() => {
  const { t } = useTranslation();
  const { id } = useParams<Record<string, string>>();
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

  const { getColumnSorterProps } = useTableConfig(
    getEmployeeProjectState,
    ProjectsMessages,
    setFilterText,
  );

  const fetchEmployeeProject = useCallback(() => {
    if (!isFilter) {
      dispatch(actions.fetchEmployeeProject({ id: id, params: params }));
    }
  }, [actions, dispatch, id, isFilter, params]);

  useEffect(() => {
    fetchEmployeeProject();
  }, [fetchEmployeeProject]);

  const moreButton = (text: string, record) => (
    <>
      <Tooltip title={t(UsersMessages.listViewTooltip())}>
        <IconButton
          type="primary"
          shape="circle"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            history.push(`/projects/${text}`);
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

  const columns: any = [
    {
      title: 'Project Name',
      dataIndex: ['project', 'name'],
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
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      render: (text, record, index: number) => {
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
          size="large"
          type="primary"
          icon={<ProjectOutlined />}
          onClick={() => setOpen(true)}
        >
          Add Project
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
        id={id}
        open={open}
        setOpen={setOpen}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
      />
    </Wrapper>
  );
});

const Wrapper = styled.div`
  background-color: white;
  padding: 1rem;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
  border-radius: 12px;
`;

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

const IconButton = styled(Button)`
  margin: 5px;
  span {
    position: absolute !important;
    width: 100%;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
`;
