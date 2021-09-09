/**
 *
 * UserDetailPage
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { Col, Form, Row, Tabs, Divider } from 'antd';
import { useHistory, useLocation, useParams } from 'react-router';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';

import { config } from 'config';
import PageTitle from 'app/components/PageTitle';
import Button from 'app/components/Button';
import { TotalSearchForm } from 'app/components/TotalSearchForm';
import { models } from '@hdwebsoft/boilerplate-api-sdk';
import { ProfileInfo } from './components/ProfileInfo/Loadable';
import { BankAccounts } from './components/BankAccounts/Loadable';
import { IdCardInfo } from './components/IdCardInfo/Loadable';

import { UserDetailMessages } from './messages';
import { useGetUserDetail } from './useGetUserDetail';
import { useUpdateUserDetail } from './useUpdateUserDetail';
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
import { Route, Switch } from 'react-router-dom';
import { useUserDetailsSlice } from './slice';
import { omit } from 'lodash';
import { EmployeeEditPage } from '../EmployeeEdit/Loadable';

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

  const [isCreate, setIsCreate] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);

  const isView = isCreate || isEdit ? false : true;

  const [searchForm] = Form.useForm();

  const dispatch = useDispatch();

  const { actions } = useNotesSlice();
  const userDetailsSlice = useUserDetailsSlice();

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
        bank_accounts:
          data.bank_accounts && data.bank_accounts.length
            ? data.bank_accounts
            : [
                {
                  bank_name: '',
                  number: '',
                  branch: '',
                },
              ],
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

  React.useEffect(() => {
    if (!id) return;

    dispatch(userDetailsSlice.actions.fetchEmployeeSkills(id));
  }, [dispatch, id, userDetailsSlice.actions]);

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
            history.push(`${PrivatePath.EMPLOYEES}/${id}`);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
        if (isCreate) {
          values = {
            bank_accounts: [
              {
                bank_name: values.bank_name,
                number: values.number,
                branch: values.number,
              },
            ],

            ...omit(values, ['bank_name', 'number', 'branch']),
          };
          create(values);
        }
      })
      .catch(err => console.log(err));
  };

  const employeeDetailForm = () => (
    <DetailForm
      form={form}
      data={data}
      isEdit={isEdit}
      isView={isView}
      leftScreenItems={<></>}
      rightScreenItems={
        <>
          <ProfileInfo isView={isView} isEdit={isEdit} />
          <BankAccounts isView={isView} form={form} isEdit={isEdit} />
          {isView && (
            <>
              <Divider />
              <Form form={form}>
                <Row gutter={[128, 0]} align="middle">
                  <Col md={24} xs={24}>
                    <IdCardInfo isView={isView} isEdit={isEdit} form={form} />
                  </Col>
                </Row>
              </Form>
            </>
          )}
        </>
      }
    />
  );

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
            <Route exact path={PrivatePath.EMPLOYEES_ID}>
              {employeeDetailForm()}
            </Route>
            <Route path={PrivatePath.EMPLOYEES_ID_NOTES}>
              <Notes employeeId={id} />
            </Route>
            <Route path={PrivatePath.EMPLOYEES_ID_PROJECTS}>
              <Projects employeeId={id} />
            </Route>
            <Route path={PrivatePath.EMPLOYEES_ID_DEVICES}>
              <Device employeeId={id} />
            </Route>
            <Route path={PrivatePath.EMPLOYEES_ID_CHANGELOGS}>
              <ChangeLogs employeeId={id} />
            </Route>
            <Route path={PrivatePath.EMPLOYEES_EDIT}>
              <EmployeeEditPage />
            </Route>
          </Switch>
        </>
      ) : (
        <DetailForm
          form={form}
          data={data}
          isEdit={isEdit}
          isView={isView}
          leftScreenItems={<></>}
          rightScreenItems={<ProfileInfo isView={isView} isEdit={isEdit} />}
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
                    history.push(PrivatePath.EMPLOYEES);
                  } else if (isView) {
                    history.push(PrivatePath.EMPLOYEES);
                  } else if (isCreate) {
                    history.push(PrivatePath.EMPLOYEES);
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
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
                  if (isView) {
                    setIsEdit(true);
                    history.push(`${PrivatePath.EMPLOYEES}/${id}/edit`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
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

const StyledTabs = styled(Tabs)`
  margin-top: 10px;
`;
