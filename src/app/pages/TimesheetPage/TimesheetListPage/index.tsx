import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  PlusCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {
  Button,
  Col,
  Row,
  Table,
  Tooltip,
  Popover,
  Form,
  TablePaginationConfig,
} from 'antd';
import { ProjectTimesheet } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/timesheet/models';
import { ColumnProps } from 'antd/lib/table';
import { ActionIcon } from 'app/components/ActionIcon';
import { Avatar } from 'app/components/Avatar';
import { useBreadCrumbContext } from 'app/components/Breadcrumbs/context';
import { IconButton } from 'app/components/Button';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHandleProjectTimesheets } from '../useHandleProjectTimesheet';
import { UsersMessages } from 'app/pages/ManageUserPage/message';
import { useNotify } from 'app/components/ToastNotification';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectProjectTimesheetState } from './slice/selectors';

export const TimesheetListPage = () => {
  const { setBreadCrumb } = useBreadCrumbContext();
  useEffect(() => {
    setBreadCrumb('Timesheets');
  }, [setBreadCrumb]);
  const { notify } = useNotify();
  const { id } = useParams<Record<string, string>>();
  const { t } = useTranslation();

  const {
    loading,
    fetchProjectTimesheets,
    projectTimesheets,
  } = useHandleProjectTimesheets();

  const state = useSelector(selectProjectTimesheetState);

  const [isDeleteMulti, setIsDeleteMulti] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isFollowers, setIsFollowers] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>('');
  const [timesheetSelected, setTimesheetSelected] = useState<
    ProjectTimesheet
  >();

  useEffect(() => {
    fetchProjectTimesheets();
  }, [fetchProjectTimesheets]);

  const onViewClick = record => {
    setTimesheetSelected(record);
    setIsView(true);
  };

  const moreButton = (text, record: ProjectTimesheet) => {
    return (
      <>
        <Tooltip title={t(UsersMessages.listViewTooltip())}>
          <IconButton
            type="primary"
            shape="circle"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => onViewClick(record)}
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
              // setSelectedTimesheet(record);
            }}
          />
        </Tooltip>
      </>
    );
  };

  const showDeleteModal = () => {
    setIsModalVisible(true);
  };

  const columns: ColumnProps<ProjectTimesheet>[] = [
    {
      title: 'Date',
      dataIndex: 'date',
      width: 100,
      render: text => text,
    },
    {
      title: 'Work Status',
      dataIndex: 'work_status',
      width: 100,
      render: value => value?.name,
    },
    {
      title: 'Assignee',
      dataIndex: 'assignee',
      width: 130,
      render: text => `${text.first_name} ${text.last_name}`,
    },
    {
      title: 'Total Hours',
      dataIndex: 'total_hours',
      width: 60,
      render: text => text,
    },
    {
      title: 'Creators',
      dataIndex: 'creators',
      width: 130,
    },
    {
      title: 'Approved',
      dataIndex: 'approved',
      width: 130,
    },

    {
      title: <ActionIcon />,
      dataIndex: 'id',
      width: 40,
      fixed: 'right',
      render: (text: string, record: ProjectTimesheet, index: number) => {
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

  return (
    <>
      <Wrapper>
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col sm={16} xs={24}>
            <PageTitle>Project Timesheets</PageTitle>
          </Col>
          <Col sm={8} xs={24}></Col>
        </Row>
      </Wrapper>
      <Wrapper>
        <Row>
          <Col span={8} style={{ marginBottom: '10px' }}>
            <Row justify="start" align="middle" style={{ height: '100%' }}>
              {state.selectedRowKeys && state.selectedRowKeys.length > 0 && (
                <StyledButton
                  type="primary"
                  danger
                  size="middle"
                  disabled={
                    !state?.selectedRowKeys?.length ||
                    state?.selectedRowKeys?.length === 0
                  }
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    showDeleteModal();
                    setIsDeleteMulti(true);
                  }}
                />
              )}
              <span style={{ marginLeft: '6px' }}>
                Total: {state.pagination?.total}
              </span>
            </Row>
          </Col>
          <Col span={16}>
            <Row justify="end">
              <Button
                shape="round"
                style={{
                  marginBottom: 10,
                  display: 'flex',
                  alignItems: 'center',
                }}
                type="primary"
                onClick={() => setIsCreate(true)}
                icon={<PlusCircleOutlined />}
              >
                Create
              </Button>
            </Row>
          </Col>
          <Col span={24}>
            <Table
              bordered
              dataSource={projectTimesheets.results}
              columns={columns}
              rowKey="id"
              loading={loading}
              scroll={{ x: 1000 }}
            />
          </Col>
        </Row>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  background-color: white;
  padding: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
  border-radius: 12px;
`;

export const PageTitle = styled.p`
  font-size: 25px;
  line-height: 30px;
  color: rgb(112 112 112);
  padding: 0;
  margin: 0;
`;

const FlexWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  svg {
    cursor: pointer;
  }
`;
const FollowersWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-flow: wrap;
  width: 80%;
`;
const StyledButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
`;
