import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import PageTitle from 'app/components/PageTitle';
import {
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { FORM_RULES, HEALTH_STATUS } from 'constants/deviceManager';
import { useDispatch, useSelector } from 'react-redux';
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
import { inputViewProps, datePickerViewProps } from 'utils/types';
import { DeviceHistoryTab } from '../DeviceHistory/Loadable';
import { useBreadCrumbContext } from 'app/components/Breadcrumbs/context';
import { useDeviceManagePage } from '../DeviceListPage/slice';
import { selectState } from '../DeviceListPage/slice/selectors';
import { PrivatePath } from 'utils/url.const';
import { CardForm } from 'app/components/CardForm';
import { Route, Switch } from 'react-router-dom';
import { RichEditor } from 'app/components/RichEditor/Loadable';
import { api } from 'utils/api';
import { DeviceCategory } from '@hdwebsoft/boilerplate-api-sdk/libs/api/hr/models';
import { useNotify, ToastMessageType } from 'app/components/ToastNotification';
import { DeleteModal } from 'app/components/DeleteModal';

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
  const [form] = Form.useForm();
  const { id } = useParams<Record<string, string>>();
  const [isCreate, setIsCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [data, setData] = useState<any>();
  const { detail, loading, create, update } = useDeviceDetail();
  const location = useLocation<LocationState>();
  const history = useHistory();
  const isView = isCreate || isEdit ? false : true;
  const { setBreadCrumb } = useBreadCrumbContext();
  const dispatch = useDispatch();
  const { actions } = useDeviceManagePage();
  const deviceState = useSelector(selectState);

  const { notify } = useNotify();
  const [description, setDes] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);
  const [isCreateCategory, setIsCreateCategory] = React.useState<boolean>(
    false,
  );
  const [categoryList, setCategoryList] = React.useState<DeviceCategory[]>([]);

  useEffect(() => {
    if (data) {
      setDes(data.description);
      form.setFieldsValue({
        ...data,
        category_id: data.category?.id,
        since: data.since && moment().set({ year: data.since }),
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
    } else {
      history.push(`${PrivatePath.DEVICES}/${id}/history`);
    }
  };

  const onCancel = () => {
    if (isEdit) {
      setIsEdit(false);
      history.push(`${PrivatePath.DEVICES}/${id}`);
    } else {
      history.push(PrivatePath.DEVICES);
    }
  };

  const onSubmit = () => {
    if (isEdit) {
      handleSubmit();
    } else if (isView) {
      setIsEdit(true);
      history.push(`${PrivatePath.DEVICES}/${id}/edit`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (isCreate) {
      handleSubmit();
    }
  };

  const onCreateCategory = async () => {
    const name = form.getFieldValue('category_name');

    try {
      const category = await api.hr.device.category.create({ name });

      setCategoryList([...categoryList, category]);
      form.resetFields(['category_name']);
      form.setFieldsValue({ category_id: category.id });
      setIsCreateCategory(false);
    } catch (error) {
      notify({
        type: ToastMessageType.Error,
        message: 'Create Failed',
        duration: 2,
      });
    }
  };

  const handleDeleteCategory = (id: string) => {
    setVisible(true);
    setCategoryId(id);
  };

  const onDeleteCategory = async () => {
    try {
      await api.hr.device.category.delete(categoryId);
      history.push(PrivatePath.DEVICES);

      notify({
        type: ToastMessageType.Info,
        message: 'Delete Successfully',
        duration: 2,
      });
    } catch (error) {
      notify({
        type: ToastMessageType.Error,
        message: 'Delete Failed',
        duration: 2,
      });
    }
  };

  const deviceDetails = () => (
    <CardForm isView={isView} onCancel={onCancel} onSubmit={onSubmit}>
      <StyledWrapperDiv>
        <StyledTitle>Device Code</StyledTitle>
        <StyledData>{data?.code || 'N/A'}</StyledData>
      </StyledWrapperDiv>

      <StyledWrapperDiv>
        <StyledTitle>Category</StyledTitle>
        <StyledData>{data?.category?.name || 'N/A'}</StyledData>
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
    </CardForm>
  );

  const getDeviceCategories = async () => {
    const categories = await api.hr.device.category.list();
    setCategoryList(categories.results);
  };

  useEffect(() => {
    if (!isView) getDeviceCategories();
  }, [isView]);

  const getDefaultTab = React.useMemo(() => {
    if (history.location.pathname.includes('history')) {
      return `${TabKeys.history}`;
    }
    return `${TabKeys.details}`;
  }, [history.location.pathname]);

  useEffect(() => {
    if (location.pathname.includes('edit')) {
      setIsEdit(true);
      history.replace(location.pathname, {});
    }
  }, [history, location.pathname]);

  useEffect(() => {
    if (!isView && !isEdit) {
      dispatch(actions.fetchIdentity());
    }
  }, [actions, dispatch, isEdit, isView]);

  useEffect(() => {
    if (deviceState.identity && !isEdit) {
      form.setFieldsValue({ code: deviceState.identity });
    }
  }, [deviceState, form, isEdit]);

  return (
    <>
      <PageTitle
        title={
          isView ? 'Device Detail' : isEdit ? 'Edit Device' : 'Create Device'
        }
        className="no-responsive"
      />
      {isView ? (
        <>
          <StyledTabs
            defaultActiveKey={getDefaultTab}
            onChange={handleTabChange}
          >
            <TabPane
              tab={isEdit || isView ? ' Detail ' : 'Create'}
              key={TabKeys.details}
            />
            <TabPane tab="History" key={TabKeys.history} />
          </StyledTabs>

          <Switch>
            <Route
              exact
              path={PrivatePath.DEVICES_ID}
              component={() => deviceDetails()}
            />
            <Route path={PrivatePath.DEVICES_ID_HISTORY}>
              <DeviceHistoryTab device_id={id} />
            </Route>
            <Route
              path={PrivatePath.DEVICES_EDIT}
              component={() => deviceDetails()}
            />
          </Switch>
        </>
      ) : (
        <StyledWrapperForm>
          <CardForm
            isView={isView}
            onCancel={onCancel}
            onSubmit={onSubmit}
            loading={loading}
          >
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
                  <StyledWrapperCategory>
                    {isCreateCategory ? (
                      <FormItem name="category_name" label="Category">
                        <Input
                          size="large"
                          placeholder="Enter category"
                          onPressEnter={onCreateCategory}
                        />
                      </FormItem>
                    ) : (
                      <FormItem
                        rules={FORM_RULES.CATEGORY}
                        name="category_id"
                        label="Category"
                      >
                        <StyledSelect
                          placeholder="Category"
                          {...(isView ? selectProps : {})}
                          size="large"
                          onChange={a => console.log(a)}
                        >
                          {categoryList.map(category => {
                            return (
                              <Option key={category.id} value={category.id}>
                                <div style={{ float: 'left' }}>
                                  {category.name}
                                </div>
                                <StyledDeleteOutlined
                                  onClick={() =>
                                    handleDeleteCategory(category.id)
                                  }
                                />
                              </Option>
                            );
                          })}
                        </StyledSelect>
                      </FormItem>
                    )}

                    {isCreateCategory ? (
                      <>
                        <StyledCheckCircleOutlined onClick={onCreateCategory} />
                        <StyledCloseCircleOutlined
                          onClick={() => setIsCreateCategory(false)}
                        />
                      </>
                    ) : (
                      <StyledPlusCircleOutlined
                        onClick={() => setIsCreateCategory(true)}
                      />
                    )}
                  </StyledWrapperCategory>
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
                <RichEditor
                  width="100%"
                  data={description}
                  placeholder={isView ? '' : 'Descriptions'}
                  callback={e => {
                    form.setFieldsValue({ description: e });
                  }}
                />
              </FormItem>
            </Form>
          </CardForm>
        </StyledWrapperForm>
      )}

      <DeleteModal
        open={visible}
        handleDelete={onDeleteCategory}
        handleCancel={() => setVisible(false)}
        content="All devices with this category will be deleted. Are you sure?"
      />
    </>
  );
};

const FormItem = styled(Form.Item)`
  label {
    font-weight: 500;
    min-width: 150px;
  }
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

const StyledWrapperForm = styled.div`
  margin-top: 2rem;
`;

const StyledWrapperCategory = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  .ant-row.ant-form-item {
    width: 100%;
    margin-bottom: 0;
  }
`;

const StyledPlusCircleOutlined = styled(PlusCircleOutlined)`
  cursor: pointer;
  font-size: 1rem;
  margin-left: 0.5rem;
  color: blue;
`;

const StyledCheckCircleOutlined = styled(CheckCircleOutlined)`
  cursor: pointer;
  font-size: 1rem;
  margin: 0 0.5rem;
  color: green;
`;

const StyledCloseCircleOutlined = styled(CloseCircleOutlined)`
  cursor: pointer;
  font-size: 1rem;
  color: red;
`;

const StyledSelect = styled(Select)`
  cursor: pointer;
  width: 100%;

  .ant-select-selection-item .anticon.anticon-delete {
    display: none;
  }
`;

const StyledDeleteOutlined = styled(DeleteOutlined)`
  float: right;
  margin-top: 5px;
  color: red;
`;
