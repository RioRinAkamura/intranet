import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import PageTitle from 'app/components/PageTitle';
import {
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { FORM_RULES } from 'constants/deviceManager';
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
  Spin,
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
  const {
    detail,
    categories,
    loading,
    loadingCat,
    healthStatuses,
    fetchDetail,
    fetchCategories,
    create,
    createCategory,
    update,
    deleteCategory,
    fetchHealthStatuses,
  } = useDeviceDetail();
  const location = useLocation<LocationState>();
  const history = useHistory();
  const isView = isCreate || isEdit ? false : true;
  const { setBreadCrumb } = useBreadCrumbContext();
  const dispatch = useDispatch();
  const { actions } = useDeviceManagePage();
  const deviceState = useSelector(selectState);

  const [description, setDes] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);
  const [isCreateCategory, setIsCreateCategory] = React.useState<boolean>(
    false,
  );

  useEffect(() => {
    fetchHealthStatuses();
  }, [fetchHealthStatuses]);

  useEffect(() => {
    if (detail) {
      setDes(detail.description);
      form.setFieldsValue({
        ...detail,
        category_id: detail.category?.id,
        since: detail.since && moment().set({ year: detail.since }),
      });
    }
  }, [detail, form, isEdit]);

  useEffect(() => {
    if (id) {
      fetchDetail(id);
    }
  }, [id, fetchDetail]);

  useEffect(() => {
    if (detail) {
      setIsCreate(false);
      setBreadCrumb('Devices / ' + detail.code);
    } else {
      setIsCreate(true);
      setBreadCrumb('Devices / Create');
    }
  }, [detail, setBreadCrumb]);

  // form handler
  const handleSubmit = () => {
    form.validateFields().then(async values => {
      const mapValues = {
        ...values,
        since: Number(moment(values.since).format('yyyy')),
      };

      try {
        if (isCreate) {
          delete mapValues.id;
          await create(mapValues);
        }

        if (isEdit) {
          const data = await update(mapValues);
          if (data) {
            setIsEdit(false);
          }
        }
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
    const response = await createCategory(name);
    if (response) {
      form.resetFields(['category_name']);
      form.setFieldsValue({ category_id: response.id });
      setIsCreateCategory(false);
    }
  };

  const handleDeleteCategory = (id: string) => {
    setVisible(true);
    setCategoryId(id);
  };

  const onDeleteCategory = async () => {
    const isDeleted = await deleteCategory(categoryId);
    if (isDeleted) {
      setVisible(false);
      form.resetFields(['category_name']);
      form.setFieldsValue({ category_id: null });
    }
  };

  const deviceDetails = () => (
    <CardForm isView={isView} onCancel={onCancel} onSubmit={onSubmit}>
      <StyledWrapperDiv>
        <StyledTitle>Device Code</StyledTitle>
        <StyledData>{detail?.code || 'N/A'}</StyledData>
      </StyledWrapperDiv>

      <StyledWrapperDiv>
        <StyledTitle>Category</StyledTitle>
        <StyledData>{detail?.category?.name || 'N/A'}</StyledData>
      </StyledWrapperDiv>

      <StyledWrapperDiv>
        <StyledTitle>Since</StyledTitle>
        <StyledData>{detail?.since || 'N/A'}</StyledData>
      </StyledWrapperDiv>

      <StyledWrapperDiv>
        <StyledTitle>Health Status</StyledTitle>
        <StyledData>{detail?.health_status || 'N/A'}</StyledData>
      </StyledWrapperDiv>

      <StyledWrapperDiv>
        <StyledTitle>Description</StyledTitle>
        <StyledData>{detail?.description || 'N/A'}</StyledData>
      </StyledWrapperDiv>
    </CardForm>
  );

  useEffect(() => {
    if (!isView) fetchCategories();
  }, [fetchCategories, isView]);

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
                          loading={loadingCat}
                        >
                          {categories &&
                            categories.map(category => {
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
                        {loadingCat ? (
                          <Spin />
                        ) : (
                          <>
                            <StyledCheckCircleOutlined
                              onClick={onCreateCategory}
                            />
                            <StyledCloseCircleOutlined
                              onClick={() => setIsCreateCategory(false)}
                            />
                          </>
                        )}
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
                      {healthStatuses?.map(item => (
                        <Option key={item.value} value={item.value}>
                          {item.label}
                        </Option>
                      ))}
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              <FormItem
                rules={FORM_RULES.DESCRIPTION}
                name="description"
                label="Description"
              >
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
        loading={loadingCat}
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
