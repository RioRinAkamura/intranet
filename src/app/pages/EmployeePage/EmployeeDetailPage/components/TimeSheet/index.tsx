import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { EmployeeTimesheet } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/timeSheet/models';
import {
  Button,
  DatePicker,
  Form,
  FormInstance,
  Popover,
  Select,
  Table,
  Tooltip,
} from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { ActionIcon } from 'app/components/ActionIcon';
import { IconButton } from 'app/components/Button';
import { DeleteModal } from 'app/components/DeleteModal';
import { DialogModal } from 'app/components/DialogModal';
import { UsersMessages } from 'app/pages/EmployeePage/EmployeeListPage/messages';
import config from 'config';
import moment from 'moment';
import React, { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components/macro';
import { Wrapper } from 'styles/StyledCommon';
import { PrivatePath } from 'utils/url.const';
import Report from './components/Report';
import TimeSheetModal from './components/TimeSheetModal';
import { useEmployeeTimesheetSlice } from './slice';
import { selectEmployeeTimesheetParams } from './slice/selectors';
import { useHandleEmployeeTimesheets } from './useHandleTimesheet';

const { Option } = Select;

interface FormProps {
  form: FormInstance;
  devices?: any;
}

interface TimeSheetProps {
  employeeId: string;
}

export const TimeSheet = memo((props: TimeSheetProps) => {
  const { employeeId } = props;
  const [form] = Form.useForm();

  const [isView, setIsView] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);

  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState<any>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState<any>();
  const { id } = useParams<Record<string, string>>();

  const history = useHistory();
  const { t } = useTranslation();

  const DATE_FORMAT = config.DATE_FORMAT;
  const disabledDate = (current: moment.Moment) => {
    return current > moment().endOf('day');
  };
  const today = new Date();
  const { actions } = useEmployeeTimesheetSlice();
  const dispatch = useDispatch();
  const params = useSelector(selectEmployeeTimesheetParams);

  const {
    employeeTimesheets,
    fetchEmployeeTimesheets,
    loading,
    addEmployeeTimesheet,
    editEmployeeTimesheet,
    deleteEmployeeTimesheet,
  } = useHandleEmployeeTimesheets();

  useEffect(() => {
    fetchEmployeeTimesheets(employeeId);
  }, [fetchEmployeeTimesheets]);

  const showDeleteModal = () => {
    setIsDelete(true);
  };

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
              setIsView(true);
            }}
          />
        </Tooltip>
        <Tooltip title={t(UsersMessages.listEditTooltip())}>
          <IconButton
            shape="circle"
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setIsEdit(true);
              setSelectedTimesheet(record);
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
              setSelectedTimesheet(record.timessheet);
            }}
          />
        </Tooltip>
      </>
    );
  };

  const columns: ColumnProps<EmployeeTimesheet>[] = [
    {
      title: 'Date',
      dataIndex: 'date',
      width: 130,
      render: text => (text ? moment(text).format('MM-DD-YYYY') : ''),
    },
    {
      title: 'Work status',
      dataIndex: 'status',
      width: 130,
      render: text => text,
    },
    {
      title: 'Total hours',
      dataIndex: 'today_hour_total',
      width: 130,
      render: text => text,
    },
    {
      title: 'Creator',
      dataIndex: 'creator',
      width: 130,
      render: text => text.name,
    },
    {
      title: 'Approver',
      dataIndex: 'approver',
      width: 130,
      render: text => text.name,
    },
    {
      title: <ActionIcon />,
      dataIndex: 'id',
      width: 45,
      fixed: 'right',
      render: (text: string, record: EmployeeTimesheet, index: number) => {
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

  const handleConfirmDelete = () => {
    if (!selectedTimesheet) return;
    try {
      deleteEmployeeTimesheet(employeeId, selectedTimesheet.id);
      fetchEmployeeTimesheets(employeeId);
      setIsDelete(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCancelDelete = () => {
    setIsDelete(false);
  };

  const handleCancel = () => {
    setIsView(false);
    setIsCreate(false);
    setIsEdit(false);
    form.resetFields();
  };

  const handleSubmit = () => {
    form.validateFields().then(async values => {
      const mapValue = {
        ...values,
        date: moment(values.date).format('YYYY-MM-DD'),
      };
      console.log('mapValue', mapValue);
    });
  };

  const handleDecline = () => {
    console.log('decline');
  };
  const handleApprove = () => {
    console.log('approve');
  };

  const handleToggle = () => {
    setIsView(!isView);
  };

  return (
    <Wrapper>
      <Header>
        <StyledButton
          type="primary"
          icon={<PlusCircleOutlined />}
          onClick={() => {
            setIsCreate(true);
            form.resetFields();
          }}
          size="middle"
        >
          Create
        </StyledButton>
      </Header>
      <Table
        bordered
        dataSource={employeeTimesheets.results}
        columns={columns}
        rowKey="id"
        loading={false}
        scroll={{ x: 1100 }}
      />
      <DialogModal
        isOpen={isCreate || isEdit || isView}
        title={
          isView
            ? 'Employee Timesheet'
            : isEdit
            ? 'Update Employee Timesheet'
            : isCreate
            ? 'Create Employee Timesheet'
            : ''
        }
        handleCancel={handleCancel}
        loading={loading}
        width={920}
      >
        {/* <TimeSheetModal
          employeeId={id}
          isCreate={isCreate}
          isEdit={isEdit}
          isView={isView}
        /> */}

        <Report
          employeeId={id}
          isCreate={isCreate}
          isEdit={isEdit}
          form={form}
        />
      </DialogModal>
      <DeleteModal
        open={isDelete}
        handleDelete={handleConfirmDelete}
        handleCancel={handleCancelDelete}
        content="Are you sure you want to delete this information?"
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

const StyledDatePicker = styled(DatePicker)`
  margin-bottom: 12px;
`;

const WrapperReport = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.15);
  padding: 16px;
`;

const ModalContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
