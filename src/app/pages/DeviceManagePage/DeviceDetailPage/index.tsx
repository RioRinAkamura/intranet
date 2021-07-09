import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import PageTitle from 'app/components/PageTitle';
import { SettingOutlined } from '@ant-design/icons';
import { FORM_RULES, HEALTH_STATUS } from 'constants/deviceManager';
import { DeviceCategory } from '../DeviceCategory';
import { useSelector } from 'react-redux';
import { selectCategories } from '../DeviceCategory/slice/selectors';
import moment from 'moment';
import {
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  SelectProps,
  Tabs,
} from 'antd';
import { useHistory, useLocation, useParams } from 'react-router';
import { useDeviceDetail } from './useDeviceDetail';
import { SelectValue } from 'antd/lib/select';
import {
  inputViewProps,
  datePickerViewProps,
  textareaViewProps,
} from 'utils/types';
import { DeviceHistoryTab } from '../DeviceHistory/Loadable';
import { CardLayout } from 'app/components/CardLayout';
import Button from 'app/components/Button';

const { Option } = Select;

interface LocationState {
  edit: boolean;
}

const selectProps: SelectProps<SelectValue> = {
  autoClearSearchValue: false,
  bordered: false,
  dropdownStyle: { display: 'none' },
  removeIcon: null,
  showArrow: false,
  style: { pointerEvents: 'none' },
  placeholder: '',
};

const { TabPane } = Tabs;

export const DeviceDetailPage = props => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const categories = useSelector(selectCategories);
  const { id } = useParams<Record<string, string>>();
  const [isCreate, setIsCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [data, setData] = useState<any>();
  const [isDetailTab, setIsDetailTab] = useState(true);
  const { detail, loading, create, update } = useDeviceDetail();
  const location = useLocation<LocationState>();
  const history = useHistory();
  const isView = isCreate || isEdit ? false : true;

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
        since: data.since && moment(data.since),
      });
    }
  }, [data, form, isEdit]);

  useEffect(() => {
    if (id) {
      setIsCreate(false);
      (async () => {
        const response = await detail(id);
        setData(response);
      })();
    } else {
      setIsCreate(true);
    }
  }, [id, detail]);

  // form handler
  const handleSubmit = () => {
    form.validateFields().then(async values => {
      const mapValues = {
        // ...omit(values, ['id']),
        ...values,
        since: Number(moment(values.since).format('yyyy')),
      };

      try {
        if (isCreate) {
          delete mapValues.id;
          // const response = await fakeAPI.post('device-management/devices/', mapValues);
          await create(mapValues);

          // post employee device
        }

        if (isEdit) {
          const data = await update(mapValues);
          setData(data);
          setIsEdit(false);

          // update employee device
        }
        // console.log(response, 'res');
      } catch (e) {
        console.log(e);
      }
    });
  };

  // tab handler
  const handleTabChange = key => {
    if (key === 'detail') {
      setIsDetailTab(true);
    } else {
      setIsDetailTab(false);
    }
  };

  const handleCloseModal = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (location.state) {
      const edit = location.state.edit;
      if (edit) {
        setIsEdit(true);
        history.replace(location.pathname, {});
      }
    }
  }, [history, location]);

  return (
    <>
      <DeviceCategory visible={visible} onCancel={handleCloseModal} />
      <PageTitle
        title={
          isView ? 'Device Detail' : isEdit ? 'Edit Device' : 'Create Device'
        }
        className="no-responsive"
      >
        <SettingOutlined onClick={() => setVisible(true)} />
      </PageTitle>
      <StyledTabs defaultActiveKey="detail" onChange={handleTabChange}>
        <TabPane tab={isEdit || isView ? ' Detail ' : 'Create'} key="detail">
          <WrapperMainItem>
            <Form form={form} labelAlign="left">
              <Form.Item hidden name="id">
                <Input hidden />
              </Form.Item>
              <FormItem name="code" rules={FORM_RULES.CODE} label="Device Code">
                <Input
                  {...(isView ? inputViewProps : {})}
                  placeholder="Device Code"
                  size="large"
                ></Input>
              </FormItem>
              <FormItem
                rules={FORM_RULES.CATEGORY}
                name="category"
                label="Category"
              >
                <Select
                  placeholder="Category"
                  {...(isView ? selectProps : {})}
                  size="large"
                  style={{
                    width: '100%',
                    cursor: 'pointer',
                  }}
                >
                  {categories?.map(category => {
                    return (
                      <Option key={category.id} value={category.id}>
                        {category.name}
                      </Option>
                    );
                  })}
                </Select>
              </FormItem>
              <FormItem name="description" label="Description">
                <Input.TextArea
                  {...(isView ? textareaViewProps : {})}
                  placeholder="Descriptions"
                  size="large"
                ></Input.TextArea>
              </FormItem>
              <FormItem rules={FORM_RULES.SINCE} name="since" label="Since">
                <DatePicker
                  {...(isView ? datePickerViewProps : {})}
                  picker="year"
                  size="large"
                  format="YYYY"
                />
              </FormItem>

              <FormItem
                rules={FORM_RULES.HEALTH_STATUS}
                name="health_status"
                label="Health Status"
              >
                <Select
                  {...(isView ? selectProps : {})}
                  size="large"
                  placeholder="Select Health Status"
                >
                  {HEALTH_STATUS.map(i => (
                    <Option value={i.value}>{i.label}</Option>
                  ))}
                </Select>
              </FormItem>
              {/* </Col> */}
              {/* </Row> */}
            </Form>
          </WrapperMainItem>
        </TabPane>
        {(isEdit || isView) && (
          <TabPane tab="History" key="history">
            <WrapperMainItem>
              <DeviceHistoryTab />
            </WrapperMainItem>
          </TabPane>
        )}
      </StyledTabs>
      {isDetailTab && (
        <WrapperButton>
          <Row gutter={[8, 8]} justify="end">
            <Col>
              <Button
                block
                shape="round"
                onClick={() =>
                  isEdit ? setIsEdit(false) : history.push('/devices')
                }
              >
                Cancel
              </Button>
            </Col>
            <Col>
              <Button
                loading={loading}
                block
                type="primary"
                onClick={() => {
                  if (isEdit) {
                    handleSubmit();
                  } else if (isView) {
                    setIsEdit(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else if (isCreate) {
                    handleSubmit();
                  }
                }}
              >
                {isView ? 'Edit' : 'Submit'}
              </Button>
            </Col>
          </Row>
        </WrapperButton>
      )}
    </>
  );
};

const WrapperMainItem = styled(CardLayout)`
  padding: 3em;
  margin-top: 0;
`;

const FormItem = styled(Form.Item)`
  align-items: center;

  label {
    font-weight: 500;
    min-width: 150px;
  }
`;

const WrapperButton = styled.div`
  margin-top: 3em;
  padding: 10px;
  height: 100%;
`;

const StyledTabs = styled(Tabs)`
  margin-top: 10px;
  .ant-tabs-content-holder {
  }
`;
