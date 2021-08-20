import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import PageTitle from 'app/components/PageTitle';
import { SettingOutlined } from '@ant-design/icons';
import { FORM_RULES, HEALTH_STATUS } from 'constants/deviceManager';
import { DeviceCategory } from '../DeviceCategory';
import { useDispatch, useSelector } from 'react-redux';
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
import { useBreadCrumbContext } from 'app/components/Breadcrumbs/context';
import { useDeviceManagePage } from '../DeviceListPage/slice';
import { selectState } from '../DeviceListPage/slice/selectors';
import { PrivatePath } from 'utils/url.const';

const { Option } = Select;

interface LocationState {
  edit: boolean;
}

enum TabKeys {
  'details' = 'details',
  'history' = 'history',
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
  const { setBreadCrumb } = useBreadCrumbContext();
  const dispatch = useDispatch();
  const { actions } = useDeviceManagePage();
  const deviceState = useSelector(selectState);

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
        const response: any = await detail(id);
        setData(response);
        setBreadCrumb('Devices / ' + response.code);
      })();
    } else {
      setIsCreate(true);
      setBreadCrumb('Devices / Create');
    }
  }, [id, detail, setBreadCrumb]);

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
    if (key === TabKeys.details) {
      history.push(`${PrivatePath.DEVICES}/${id}`);
      setIsDetailTab(true);
    } else {
      history.push(`${PrivatePath.DEVICES}/${id}/history`);
      setIsDetailTab(false);
    }
  };

  const handleCloseModal = () => {
    setVisible(false);
  };

  const getDefaultTab = React.useMemo(() => {
    if (history.location.pathname.includes('history')) {
      return `${TabKeys.history}`;
    }
    return `${TabKeys.details}`;
  }, [history.location.pathname]);

  useEffect(() => {
    if (location.state) {
      const edit = location.state.edit;
      if (edit) {
        setIsEdit(true);
        history.replace(location.pathname, {});
      }
    }
  }, [history, location]);

  useEffect(() => {
    dispatch(actions.fetchIdentity());
  }, [actions, dispatch]);

  useEffect(() => {
    if (deviceState.identity && !isEdit) {
      form.setFieldsValue({ code: deviceState.identity });
    }
  }, [deviceState, form, isEdit]);

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
      {isView ? (
        <StyledTabs defaultActiveKey={getDefaultTab} onChange={handleTabChange}>
          <TabPane
            tab={isEdit || isView ? ' Detail ' : 'Create'}
            key={TabKeys.details}
          >
            <CardLayout
              padding="3rem"
              style={isView ? { margin: '0 auto' } : {}}
            >
              <StyledWrapperDiv>
                <StyledTitle>Device Code</StyledTitle>
                <StyledData>{data?.code || 'N/A'}</StyledData>
              </StyledWrapperDiv>

              <StyledWrapperDiv>
                <StyledTitle>Category</StyledTitle>
                <StyledData>{data?.category_name || 'N/A'}</StyledData>
              </StyledWrapperDiv>

              <StyledWrapperDiv>
                <StyledTitle>Since</StyledTitle>
                <StyledData>{data?.since || 'N/A'}</StyledData>
              </StyledWrapperDiv>

              <StyledWrapperDiv>
                <StyledTitle>Health Status</StyledTitle>
                <StyledData>{data?.health_status || 'N/A'}</StyledData>
              </StyledWrapperDiv>

              <StyledWrapperDiv>
                <StyledTitle>Description</StyledTitle>
                <StyledData>{data?.description || 'N/A'}</StyledData>
              </StyledWrapperDiv>
            </CardLayout>
          </TabPane>
          <TabPane tab="History" key={TabKeys.history}>
            <DeviceHistoryTab />
          </TabPane>
        </StyledTabs>
      ) : (
        <CardLayout padding="3rem">
          <Form form={form} labelAlign="left">
            <Form.Item hidden name="id">
              <Input hidden />
            </Form.Item>
            <Row gutter={[32, 32]}>
              <Col span={12}>
                <FormItem
                  name="code"
                  rules={FORM_RULES.CODE}
                  label="Device Code"
                >
                  <Input
                    {...(isView ? inputViewProps : {})}
                    placeholder="Device Code"
                    size="large"
                    disabled={isEdit}
                  />
                </FormItem>
              </Col>
              <Col span={12}>
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
              </Col>
            </Row>
            <Row gutter={[32, 32]}>
              <Col span={12}>
                <FormItem rules={FORM_RULES.SINCE} name="since" label="Since">
                  <StyledDatePicker
                    {...(isView ? datePickerViewProps : {})}
                    picker="year"
                    size="large"
                    format="YYYY"
                  />
                </FormItem>
              </Col>
              <Col span={12}>
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
              </Col>
            </Row>
            <FormItem name="description" label="Description">
              <Input.TextArea
                {...(isView ? textareaViewProps : {})}
                placeholder="Descriptions"
                size="large"
              />
            </FormItem>
          </Form>
        </CardLayout>
      )}

      {isDetailTab && (
        <WrapperButton>
          <Row gutter={[8, 8]} justify="end">
            <Col>
              <Button
                block
                shape="round"
                onClick={() =>
                  isEdit ? setIsEdit(false) : history.push(PrivatePath.DEVICES)
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

const FormItem = styled(Form.Item)`
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

const StyledWrapperDiv = styled.div`
  display: flex;
`;

const StyledDiv = styled.div`
  border: 1px solid lightgrey;
  padding: 10px;
  margin-bottom: -1px;
  margin-left: -1px;
`;

const StyledTitle = styled(StyledDiv)`
  width: 250px;
  background-color: #f2f2f2;
  opacity: 0.7;
`;

const StyledData = styled(StyledDiv)`
  width: 100%;
  font-weight: 500;
  padding-left: 20px;
  font-size: 16px;
`;

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
`;
