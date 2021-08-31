import React, { memo, useState, useEffect, useCallback } from 'react';
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
import { DeviceStatus } from '@hdwebsoft/boilerplate-api-sdk/libs/api/hr/models';

const { Option } = Select;
interface DeviceResponse {
  device: any;
  started_using_at: string;
  stopped_using_at: string;
  status: string;
  id: string;
  employee_name: string;
}

interface Devices {
  code: string;
  id: string;
}

interface FormProps {
  form: FormInstance;
  devices?: any;
  isView?: boolean;
  deviceUpdate?: DeviceResponse;
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
        started_using_at: moment(deviceUpdate.started_using_at),
        stopped_using_at: moment(deviceUpdate.stopped_using_at),
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
        <Select disabled={isView} placeholder="Status" size="large">
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
        <StyledDatePicker size="large" disabled={isView} />
      </Form.Item>
      <Form.Item name="stopped_using_at" label="Stopped Using At">
        <StyledDatePicker size="large" disabled={isView} />
      </Form.Item>
    </Form>
  );
};

export const Device = memo((props: DeviceProps) => {
  const { employeeId } = props;
  const [form] = Form.useForm();
  const [employeeDevices, setEmployeeDevices] = useState([]);
  const [devices, setDevices] = useState<Devices[]>([]);
  const [loading, setLoading] = useState(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [deviceUpdate, setDeviceUpdate] = useState<DeviceResponse>();
  const [deviceDelete, setDeviceDelete] = useState<DeviceResponse>();

  const fetchEmployeeDevices = useCallback(async () => {
    setLoading(true);
    try {
      const response: any = await api.hr.employee.device.list(employeeId);
      setEmployeeDevices(response.results);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  const fetchDevices = async () => {
    try {
      const response: any = await api.hr.device.list();
      const mapDevice = [...response.results].filter(
        (device: any) => device.status === 'Available',
      );
      setDevices(mapDevice);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchEmployeeDevices();
    fetchDevices();
  }, [fetchEmployeeDevices]);

  const moreButton = (text: string, record: DeviceResponse) => (
    <>
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

  const columns: ColumnProps<DeviceResponse>[] = [
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
      render: (text: string, record: DeviceResponse, index: number) => {
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
      await api.hr.employee.device.delete(employeeId, deviceDelete.device.id);
      fetchEmployeeDevices();
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

      try {
        setLoading(true);

        if (isCreate) {
          await api.hr.employee.device.create(employeeId, {
            ...mapValue,
            device_id: mapValue.device,
            employee: employeeId,
          });
          setIsCreate(false);
          fetchEmployeeDevices();
          fetchDevices();
        }
        if (isUpdate) {
          if (!deviceUpdate) return;

          const device = await api.hr.device.get(deviceUpdate.device);

          if (mapValue.device !== deviceUpdate.device) {
            await api.hr.device.update({
              ...device,
              employee: '',
              status: DeviceStatus.AVAILABLE,
            });

            await api.hr.device.history.create({
              device: deviceUpdate.device,
              employee: employeeId,
              note: `Unassign device from employee ${deviceUpdate.employee_name}`,
            });
          }

          await api.hr.employee.device.update(employeeId, {
            id: deviceUpdate.id,
            ...mapValue,
          });

          setIsUpdate(false);
          fetchEmployeeDevices();
          fetchDevices();
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
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
        dataSource={employeeDevices}
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
          isView={!isCreate ? isView : false}
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
