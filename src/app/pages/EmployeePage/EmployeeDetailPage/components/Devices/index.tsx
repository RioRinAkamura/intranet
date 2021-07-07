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
  FormOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { DialogModal } from 'app/components/DialogModal';
import { EMPLOYEE_DEVICE_STATUS, FORM_RULES } from 'constants/deviceManager';
import fakeAPI from 'utils/fakeAPI';
import { ColumnProps } from 'antd/lib/table';
import { DeleteModal } from 'app/components/DeleteModal';
import { CardLayout } from 'app/components/CardLayout';
import { Button } from 'app/components/Button';

const { Option } = Select;
interface DeviceResponse {
  device: string;
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
  id: string;
}
const WrapperForm: React.FC<FormProps> = ({
  form,
  devices,
  isView,
  deviceUpdate,
}) => {
  const [deviceItem, setDeviceItem] = useState<Devices>();
  const fetchDevice = async id => {
    const response: any = await fakeAPI.get(`devices/${id}/`);
    setDeviceItem(response);
  };
  useEffect(() => {
    if (deviceUpdate) {
      form.setFieldsValue({
        ...deviceUpdate,
        started_using_at: moment(deviceUpdate.started_using_at),
        stopped_using_at: moment(deviceUpdate.stopped_using_at),
      });
    }
  }, [form, deviceUpdate, isView]);

  useEffect(() => {
    if (deviceUpdate) {
      fetchDevice(deviceUpdate.device);
    }
  }, [deviceUpdate]);
  return (
    <Form layout="vertical" form={form}>
      <Form.Item rules={FORM_RULES.DEVICE} name="device" label="Device">
        {/* <Input size="large" placeholder="Type" disabled={isView} /> */}
        <Select placeholder="device" disabled={isView}>
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
        initialValue={'assigned'}
        name="status"
        label="Status"
      >
        {/* <Input size="large" placeholder="Summary" disabled={isView} /> */}
        <Select disabled={isView} placeholder="Status">
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
  const { id } = props;
  const [form] = Form.useForm();
  const [employeeDevices, setEmployeeDevices] = useState([]);
  const [devices, setDevices] = useState<Devices[]>([]);
  const [loading, setLoading] = useState(false);
  const [deviceItems, setDeviceItems] = useState<Devices[]>([]);
  const [isView, setIsView] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [deviceUpdate, setDeviceUpdate] = useState<DeviceResponse>();
  const [deviceDelete, setDeviceDelete] = useState<DeviceResponse>();

  const fetchEmployeeDevices = useCallback(async () => {
    setLoading(true);
    try {
      const response: any = await fakeAPI.get(
        '/devices/employee-devices/',
        // {
        //   params: {
        //     employee: id,
        //   },
        // },
      );

      const mapResponse: any = [...response.results].filter(
        device => device.employee === id,
      );

      setEmployeeDevices(mapResponse);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchDevices = async () => {
    try {
      const response: any = await fakeAPI.get('/devices/');
      setDeviceItems(response.results);
      const mapDevice = [...response.results].filter(
        (device: any) => device.status === 'available',
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
      render: text => {
        const device: any = deviceItems.find(device => device.id === text);
        return device ? device.code : '';
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
      title: 'actions',
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
    try {
      await fakeAPI.patch(`devices/${deviceDelete?.device}/`, {
        status: 'available',
        employee: null,
      });

      await fakeAPI.post(`devices/histories/`, {
        device: deviceDelete?.device,
        employee: id,
        note: `Unassign device from employee ${deviceDelete?.employee_name}`,
      });

      await fakeAPI.delete(`devices/employee-devices/${deviceDelete?.id}`);
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
          await fakeAPI.post('/devices/employee-devices/', {
            ...mapValue,
            employee: id,
          });
          setIsCreate(false);
          fetchEmployeeDevices();
          fetchDevices();
        }
        if (isUpdate) {
          if (mapValue.device !== deviceUpdate?.device) {
            await fakeAPI.patch(`devices/${deviceUpdate?.device}/`, {
              status: 'available',
              employee: null,
            });

            await fakeAPI.post(`devices/histories/`, {
              device: deviceUpdate?.device,
              employee: id,
              note: `Unassign device from employee ${deviceUpdate?.employee_name}`,
            });
          }

          await fakeAPI.put(`devices/employee-devices/${deviceUpdate?.id}/`, {
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
          size="large"
          type="primary"
          icon={<FormOutlined />}
          onClick={() => {
            setIsCreate(true);
            form.resetFields();
          }}
        >
          Add Device
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

const Wrapper = styled(CardLayout)`
  margin-top: 0;
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

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
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
