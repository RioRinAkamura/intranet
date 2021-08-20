/**
 *
 * UserDetailPage
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { Col, Form, Row, Tabs } from 'antd';
import { useHistory, useLocation, useParams } from 'react-router';
import moment from 'moment';
import { useSelector } from 'react-redux';

import { config } from 'config';
import PageTitle from 'app/components/PageTitle';
import Button from 'app/components/Button';
import { TotalSearchForm } from 'app/components/TotalSearchForm';
import { models } from '@hdwebsoft/boilerplate-api-sdk';
import fakeAPI from 'utils/fakeAPI';
import { ProfileInfo } from './components/ProfileInfo/Loadable';
import { BankAccounts } from './components/BankAccounts/Loadable';
import { UserDetailMessages } from './messages';
import { useGetUserDetail } from './useGetUserDetail';
import { useUpdateUserDetail } from './useUpdateUserDetail';
import { IdCardInfo } from './components/IdCardInfo/Loadable';
import { AddBankModal } from './components/AddBankModal/Loadable';
import { Notes } from './components/Notes/Loadable';
import { Device } from './components/Devices/Loadable';
import { DetailForm } from './components/DetailForm/Loadable';
import { Projects } from './components/Projects/Loadable';
import { useNotesSlice } from './components/Notes/slice';
import { useHandleDataTable } from '../EmployeeListPage/useHandleDataTable';
import { selectEmployeeNotes } from './components/Notes/slice/selectors';
import { useBreadCrumbContext } from 'app/components/Breadcrumbs/context';
import { ChangeLogs } from './components/ChangeLogs';
import { PrivatePath } from 'utils/url.const';
import { Switch } from 'react-router-dom';
import { PrivateRoute } from 'app/components/Auth/Route';
interface Props {}

interface LocationState {
  edit: boolean;
}

type Employee = models.hr.Employee;

const DATE_FORMAT = config.DATE_FORMAT;

enum TabKeys {
  'details' = 'details',
  'notes' = 'notes',
  'projects' = 'projects',
  'devices' = 'devices',
  'changeLogs' = 'changeLogs',
}

export function EmployeeDetailPage(props: Props) {
  const { id } = useParams<Record<string, string>>();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const location = useLocation<LocationState>();
  const history = useHistory();
  const { setBreadCrumb } = useBreadCrumbContext();

  const { user } = useGetUserDetail(id);
  const { create, update, loading } = useUpdateUserDetail();

  const [data, setData] = React.useState<Employee>();
  const [users, setUsers] = React.useState<any[]>([]);

  const [isCreate, setIsCreate] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);

  const isView = isCreate || isEdit ? false : true;

  const [searchForm] = Form.useForm();

  const { actions } = useNotesSlice();
  const employeeNoteState = useSelector(selectEmployeeNotes);
  const { setSearchText, resetSearch } = useHandleDataTable(
    employeeNoteState,
    actions,
  );

  const handleSearch = () => {
    setSearchText(searchForm.getFieldValue('search'));
  };
  const resetSearchValue = () => {
    searchForm.setFieldsValue({ search: undefined });
    resetSearch();
  };

  const { TabPane } = Tabs;
  const [isDetailTab, setIsDetailTab] = React.useState(true);

  const fetchUser = async () => {
    try {
      const users: any = await fakeAPI.get('/users');
      setUsers(users.results);
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    fetchUser();
  }, []);

  const onChangeTab = (key: string) => {
    if (key === TabKeys.notes) {
      setIsDetailTab(false);
      history.push(`${PrivatePath.EMPLOYEES}/${id}/notes`);
    } else if (key === TabKeys.projects) {
      setIsDetailTab(false);
      history.push(`${PrivatePath.EMPLOYEES}/${id}/projects`);
    } else if (key === TabKeys.devices) {
      setIsDetailTab(false);
      history.push(`${PrivatePath.EMPLOYEES}/${id}/devices`);
    } else if (key === TabKeys.changeLogs) {
      setIsDetailTab(false);
      history.push(`${PrivatePath.EMPLOYEES}/${id}/change-logs`);
    } else {
      setIsDetailTab(true);
      history.push(`${PrivatePath.EMPLOYEES}/${id}`);
    }
  };

  const getDefaultTab = React.useMemo(() => {
    if (history.location.pathname.includes('notes')) {
      return `${TabKeys.notes}`;
    }
    if (history.location.pathname.includes('projects')) {
      return `${TabKeys.projects}`;
    }
    if (history.location.pathname.includes('devices')) {
      return `${TabKeys.devices}`;
    }
    if (history.location.pathname.includes('change-logs')) {
      return `${TabKeys.changeLogs}`;
    }
    return `${TabKeys.details}`;
  }, [history.location.pathname]);

  React.useEffect(() => {
    if (user) {
      setData(user);
    }
  }, [user]);

  React.useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
        id: data.id,
        dob: data.dob && moment(data.dob, DATE_FORMAT),
        issued_date: data.issued_date && moment(data.issued_date, DATE_FORMAT),
      });
      setBreadCrumb('Employees / ' + data.code);
    }
  }, [data, form, isEdit, setBreadCrumb]);

  React.useEffect(() => {
    if (history.location.pathname.includes('create')) {
      setIsCreate(true);
      setBreadCrumb('Employees / Create');
    } else {
      setIsCreate(false);
    }
    if (history.location.pathname.includes('notes')) {
      setIsDetailTab(false);
    } else if (history.location.pathname.includes('projects')) {
      setIsDetailTab(false);
    }
  }, [history.location.pathname, setBreadCrumb]);

  React.useEffect(() => {
    if (location.state) {
      const edit = location.state.edit;
      if (edit) {
        setIsEdit(true);
        history.replace(location.pathname, {});
      }
    }
  }, [history, location]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async values => {
        values.dob = moment(values.dob).format(DATE_FORMAT);
        if (values.issued_date) {
          values.issued_date = moment(values.issued_date).format(DATE_FORMAT);
        }
        if (isEdit) {
          delete values.email;
          const response = await update(values);
          if (response) {
            setData(response);
            setIsEdit(false);
          }
        }
        if (isCreate) {
          create(values);
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <>
      <StyledPageTitle
        title={
          isView
            ? `${data ? data.first_name + ' ' + data.last_name : ''}`
            : isEdit
            ? 'Edit Employee'
            : 'Create Employee'
        }
        isNotesTab={getDefaultTab === TabKeys.notes}
      >
        {getDefaultTab === TabKeys.notes && (
          <TotalSearchForm
            form={searchForm}
            value={employeeNoteState.params.search}
            loading={employeeNoteState.loading ? true : false}
            onSearch={handleSearch}
            onReset={resetSearchValue}
          />
        )}
      </StyledPageTitle>
      {isView ? (
        <>
          <StyledTabs defaultActiveKey={getDefaultTab} onChange={onChangeTab}>
            <TabPane tab="Details" key={TabKeys.details} />
            <TabPane tab="Projects" key={TabKeys.projects} />
            <TabPane tab="Notes" key={TabKeys.notes} />
            <TabPane tab="Devices" key={TabKeys.devices} />
            <TabPane tab="Change Logs" key={TabKeys.changeLogs} />
          </StyledTabs>

          <Switch>
            <PrivateRoute
              exact
              path={PrivatePath.EMPLOYEES_ID}
              component={() => (
                <DetailForm
                  form={form}
                  data={data}
                  isEdit={isEdit}
                  isView={isView}
                  leftScreenItems={
                    <IdCardInfo isView={isView} isEdit={isEdit} />
                  }
                  rightScreenItems={
                    <>
                      <ProfileInfo
                        isView={isView}
                        isEdit={isEdit}
                        users={users}
                      />
                      <BankAccounts
                        isView={isView}
                        isEdit={isEdit}
                        form={form}
                      />
                    </>
                  }
                />
              )}
            />
            <PrivateRoute
              path={PrivatePath.EMPLOYEES_ID_NOTES}
              component={Notes}
            />
            <PrivateRoute
              path={PrivatePath.EMPLOYEES_ID_PROJECTS}
              component={Projects}
            />
            <PrivateRoute
              path={PrivatePath.EMPLOYEES_ID_DEVICES}
              component={() => <Device id={id} />}
            />
            <PrivateRoute
              path={PrivatePath.EMPLOYEES_ID_CHANGELOGS}
              component={ChangeLogs}
            />
          </Switch>
        </>
      ) : (
        <DetailForm
          form={form}
          data={data}
          isEdit={isEdit}
          isView={isView}
          leftScreenItems={
            <WrapperAddBank>
              <AddBankModal isView={isView} form={form} />
            </WrapperAddBank>
          }
          rightScreenItems={
            <ProfileInfo users={users} isView={isView} isEdit={isEdit} />
          }
        />
      )}
      {isDetailTab && (
        <WrapperButton>
          <Row gutter={[8, 8]} justify="end">
            <Col>
              <Button
                block
                onClick={() => {
                  if (isEdit) {
                    setIsEdit(false);
                  } else if (isView) {
                    history.push(PrivatePath.EMPLOYEES);
                  } else if (isCreate) {
                    history.push(PrivatePath.EMPLOYEES);
                  }
                }}
              >
                {t(UserDetailMessages.formBackButton())}
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
                {isView
                  ? t(UserDetailMessages.formEditButton())
                  : t(UserDetailMessages.formSubmitButton())}
              </Button>
            </Col>
          </Row>
        </WrapperButton>
      )}
    </>
  );
}

interface StyledProps {
  isNotesTab: boolean;
}

const StyledPageTitle = styled(PageTitle)`
  padding: ${({ isNotesTab }: StyledProps) => (isNotesTab ? '0 1rem' : '1rem')};

  > div {
    padding: ${({ isNotesTab }: StyledProps) => (isNotesTab ? '11px 0' : '')};
  }
`;

const WrapperButton = styled.div`
  margin-top: 3em;
  padding: 10px;
  height: 100%;
`;

const WrapperAddBank = styled.div`
  margin-top: 2em;
`;

const StyledTabs = styled(Tabs)`
  margin-top: 10px;
`;
