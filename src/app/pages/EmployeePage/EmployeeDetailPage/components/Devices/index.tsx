import React, { memo, useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import {
  Table,
  Popover,
  Tooltip,
  Form,
  DatePicker,
  FormInstance,
  Select,
} from 'antd';
import {
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import moment from 'moment';

import { DialogModal } from 'app/components/DialogModal';
import { EMPLOYEE_DEVICE_STATUS, FORM_RULES } from 'constants/deviceManager';
import { ColumnProps } from 'antd/lib/table';
import { DeleteModal } from 'app/components/DeleteModal';
import Button, { IconButton } from 'app/components/Button';
import { Wrapper } from 'styles/StyledCommon';
import { api } from 'utils/api';
import { EmployeeDevice } from '@hdwebsoft/boilerplate-api-sdk/libs/api/hr/models';
import { useHandleEmployeeDevices } from './useHandleEmployeeDevices';
import { EmployeeDeviceStatus } from 'utils/types';

const { Option } = Select;

interface Devices {
  code: string;
  id: string;
}

interface FormProps {
  form: FormInstance;
  devices?: any;
  isView?: boolean;
  deviceUpdate?: EmployeeDevice;
}

interface DeviceProps {
  employeeId: string;
}
const WrapperForm: React.FC<FormProps> = ({
  form,
  devices,
  isView,
  deviceUpdate,
}) => {
  const [deviceItem, setDeviceItem] = useState<Devices>();
  const fetchDevice = async id => {
    const response: any = await api.hr.device.get(id);
    setDeviceItem(response);
  };
  useEffect(() => {
    if (deviceUpdate) {
      form.setFieldsValue({
        ...deviceUpdate,
        device: deviceUpdate.device.id,
        started_using_at: moment(deviceUpdate.started_using_at || undefined),
        stopped_using_at: moment(deviceUpdate.stopped_using_at || undefined),
      });
    }
  }, [form, deviceUpdate, isView]);

  useEffect(() => {
    if (deviceUpdate) {
      fetchDevice(deviceUpdate.device.id);
    }
  }, [deviceUpdate]);

  return (
    <Form layout="vertical" form={form}>
      <Form.Item rules={FORM_RULES.DEVICE} name="device" label="Device">
        {/* <Input size="large" placeholder="Type" disabled={isView} /> */}
        <Select placeholder="Device" disabled={isView} size="large">
          {deviceUpdate && deviceItem && (
            <Option value={deviceItem?.id}>{deviceItem?.code}</Option>
          )}
          {devices.map(device => (
            <Option value={device.id}>{device.code}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        rules={FORM_RULES.STATUS}
        initialValue={'Assigned'}
        name="status"
        label="Status"
      >
        {/* <Input size="large" placeholder="Summary" disabled={isView} /> */}
        <Select placeholder="Status" size="large">
          {EMPLOYEE_DEVICE_STATUS.map(status => (
            <Option value={status.value}>{status.label}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        rules={FORM_RULES.STATED_DATE}
        name="started_using_at"
        label="Started Using Date"
      >
        <StyledDatePicker size="large" />
      </Form.Item>
      <Form.Item name="stopped_using_at" label="Stopped Using At">
        <StyledDatePicker size="large" />
      </Form.Item>
    </Form>
  );
};

export const Device = memo((props: DeviceProps) => {
  const { employeeId } = props;
  const [form] = Form.useForm();
  const [isView, setIsView] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [deviceUpdate, setDeviceUpdate] = useState<EmployeeDevice>();
  const [deviceDelete, setDeviceDelete] = useState<EmployeeDevice>();
  const {
    loading,
    devices,
    employeeDevices,
    fetchDevices,
    fetchEmployeeDevices,
    addEmployeeDevice,
    editEmployeeDevice,
    deleteEmployeeDevice,
  } = useHandleEmployeeDevices();

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeDevices(employeeId);
      fetchDevices();
    }
  }, [employeeId, fetchDevices, fetchEmployeeDevices]);

  const moreButton = (text: string, record: EmployeeDevice) => (
    <>
      {record.status !== EmployeeDeviceStatus.Returned && (
        <Tooltip title="Edit">
          <IconButton
            shape="circle"
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setIsUpdate(true);
              setDeviceUpdate(record);
            }}
          />
        </Tooltip>
      )}
      <Tooltip title="Delete">
        <IconButton
          danger
          shape="circle"
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => {
            setIsDelete(true);
            setDeviceDelete(record);
          }}
        />
      </Tooltip>
    </>
  );

  const columns: ColumnProps<EmployeeDevice>[] = [
    {
      title: 'Device',
      dataIndex: 'device',
      width: 130,
      render: value => {
        return value ? value.code : '';
      },
    },
    {
      title: 'Started using at',
      dataIndex: 'started_using_at',
      width: 130,
      render: text => text,
    },
    {
      title: 'Stopped using at',
      dataIndex: 'stopped_using_at',
      width: 130,
      render: text => text,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 130,
      render: text => text,
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      width: 45,
      fixed: 'right',
      render: (text: string, record: EmployeeDevice, index: number) => {
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

  const handleConfirmDelete = async () => {
    if (!deviceDelete) return;
    try {
      deleteEmployeeDevice(employeeId, deviceDelete.device.id);
      fetchEmployeeDevices(employeeId);
      fetchDevices();
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
    setIsUpdate(false);
    form.resetFields();
  };

  const handleSubmit = () => {
    form.validateFields().then(async values => {
      const mapValue = {
        ...values,
        started_using_at: moment(values.started_using_at).format('YYYY-MM-DD'),
        stopped_using_at: values.stopped_using_at
          ? moment(values.stopped_using_at).format('YYYY-MM-DD')
          : undefined,
      };

      if (isCreate) {
        addEmployeeDevice(employeeId, {
          ...mapValue,
          device_id: mapValue.device,
          employee: employeeId,
        });
        setIsCreate(false);
        fetchEmployeeDevices(employeeId);
        fetchDevices();
      }
      if (isUpdate) {
        if (!deviceUpdate) return;
        const _values = {
          device_id: mapValue.device,
          status: mapValue.status,
          started_using_at: mapValue.started_using_at,
          stopped_using_at: mapValue.stopped_using_at,
        };
        editEmployeeDevice(employeeId, _values);
        setIsUpdate(false);
        fetchEmployeeDevices(employeeId);
        fetchDevices();
      }
    });
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
          Add device
        </StyledButton>
      </Header>
      <Table
        bordered
        dataSource={employeeDevices.results}
        columns={columns}
        rowKey="id"
        loading={loading}
        scroll={{ x: 1100 }}
      />
      <DialogModal
        isOpen={isCreate || isUpdate}
        cancelText={'Cancel'}
        okText={isUpdate || isCreate ? 'Submit' : 'Edit'}
        title={isUpdate ? 'Update Employee Device' : 'Create Employee Device'}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        loading={loading}
      >
        <WrapperForm
          form={form}
          devices={devices}
          deviceUpdate={!isCreate ? deviceUpdate : undefined}
          isView={!isCreate ? isView || isUpdate : false}
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
  width: 100%;
`;
