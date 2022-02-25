/**
 *
 * UserDetailPage
 *
 */
import { models } from '@hdwebsoft/intranet-api-sdk';
import { Form, Tabs } from 'antd';
import { useBreadCrumbContext } from 'app/components/Breadcrumbs/context';
import PageTitle from 'app/components/PageTitle';
import { TotalSearchForm } from 'app/components/TotalSearchForm';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components/macro';
import { PrivatePath } from 'utils/url.const';
import { EmployeeEditPage } from '../EmployeeEdit/Loadable';
import { useHandleDataTable } from '../EmployeeListPage/useHandleDataTable';
import { BankAccounts } from './components/BankAccounts/Loadable';
import { ChangeLogs } from './components/ChangeLogs';
import { Device } from './components/Devices/Loadable';
import { IdCardInfo } from './components/IdCardInfo/Loadable';
import { JobInfo } from './components/JobInfo';
import { Notes } from './components/Notes/Loadable';
import { useNotesSlice } from './components/Notes/slice';
import { selectEmployeeNotes } from './components/Notes/slice/selectors';
import { ProfileInfo } from './components/ProfileInfo/Loadable';
import { Projects } from './components/Projects/Loadable';
import { Skills } from './components/Skills/Loadable';
import { SocialNetwork } from './components/SocialNetwork';
import { useUserDetailsSlice } from './slice';
import { useHandleEmployeeDetail } from './useHandleEmployeeDetail';

interface Props {}

export interface LocationState {
  edit: boolean;
}

type Employee = models.hr.Employee;

enum TabKeys {
  'details' = 'details',
  'notes' = 'notes',
  'projects' = 'projects',
  'devices' = 'devices',
  'changeLogs' = 'changeLogs',
  'contract' = 'contract',
  'bankAccounts' = 'bankAccounts',
  'citizenInfo' = 'citizenInfo',
  'skills' = 'skills',
  'socialAccounts' = 'socialAccounts',
  'timeSheet' = 'timeSheet',
}

export function EmployeeDetailPage(props: Props) {
  const { id } = useParams<Record<string, string>>();
  const location = useLocation<LocationState>();
  const history = useHistory();
  const { setBreadCrumb } = useBreadCrumbContext();

  const { user, getDetail } = useHandleEmployeeDetail();

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

  const handleSearch = (isDelete: boolean) => {
    setSearchText(searchForm.getFieldValue('search'), isDelete);
  };

  const resetSearchValue = () => {
    searchForm.setFieldsValue({ search: undefined });
    resetSearch();
  };

  const { TabPane } = Tabs;

  const onChangeTab = (key: string) => {
    if (key === TabKeys.contract) {
      history.push(`${PrivatePath.EMPLOYEES}/${id}/contract`);
    } else if (key === TabKeys.bankAccounts) {
      history.push(`${PrivatePath.EMPLOYEES}/${id}/bank-accounts`);
    } else if (key === TabKeys.citizenInfo) {
      history.push(`${PrivatePath.EMPLOYEES}/${id}/citizen-info`);
    } else if (key === TabKeys.skills) {
      history.push(`${PrivatePath.EMPLOYEES}/${id}/skills`);
    } else if (key === TabKeys.socialAccounts) {
      history.push(`${PrivatePath.EMPLOYEES}/${id}/social-accounts`);
    } else if (key === TabKeys.projects) {
      history.push(`${PrivatePath.EMPLOYEES}/${id}/projects`);
    } else if (key === TabKeys.timeSheet) {
      history.push(`${PrivatePath.EMPLOYEES}/${id}/time-sheet`);
    } else if (key === TabKeys.notes) {
      history.push(`${PrivatePath.EMPLOYEES}/${id}/notes`);
    } else if (key === TabKeys.devices) {
      history.push(`${PrivatePath.EMPLOYEES}/${id}/devices`);
    } else if (key === TabKeys.changeLogs) {
      history.push(`${PrivatePath.EMPLOYEES}/${id}/change-logs`);
    } else if (key === TabKeys.details) {
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
    if (history.location.pathname.includes('timeSheet')) {
      return `${TabKeys.timeSheet}`;
    }
    if (history.location.pathname.includes('devices')) {
      return `${TabKeys.devices}`;
    }
    if (history.location.pathname.includes('contract')) {
      return `${TabKeys.contract}`;
    }
    if (history.location.pathname.includes('bank-accounts')) {
      return `${TabKeys.bankAccounts}`;
    }
    if (history.location.pathname.includes('citizen-info')) {
      return `${TabKeys.citizenInfo}`;
    }
    if (history.location.pathname.includes('skills')) {
      return `${TabKeys.skills}`;
    }
    if (history.location.pathname.includes('social-accounts')) {
      return `${TabKeys.socialAccounts}`;
    }
    if (history.location.pathname.includes('change-logs')) {
      return `${TabKeys.changeLogs}`;
    }
    if (history.location.pathname) {
      return `${TabKeys.details}`;
    }
  }, [history.location.pathname]);

  React.useEffect(() => {
    if (id) {
      getDetail(id);
    }
  }, [id, getDetail]);

  React.useEffect(() => {
    if (user) {
      setData(user);
    }
  }, [user]);

  React.useEffect(() => {
    if (data) {
      setBreadCrumb('Employees / ' + data.code);
    }
  }, [data, setBreadCrumb]);

  React.useEffect(() => {
    if (history.location.pathname.includes('create')) {
      setIsCreate(true);
      setBreadCrumb('Employees / Create');
    } else {
      setIsCreate(false);
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
    if (
      location.pathname.split('/').findIndex(local => local === 'edit') !== -1
    ) {
      setIsEdit(true);
    } else {
      setIsEdit(false);
    }
  }, [history, location]);

  React.useEffect(() => {
    if (!id || getDefaultTab !== TabKeys.details) return;

    dispatch(userDetailsSlice.actions.fetchEmployeeSkills(id));
  }, [dispatch, getDefaultTab, id, userDetailsSlice.actions]);

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
      <>
        <StyledTabs defaultActiveKey={getDefaultTab} onChange={onChangeTab}>
          <TabPane tab="Details" key={TabKeys.details} />
          <TabPane tab="Contract" key={TabKeys.contract} />
          <TabPane tab="Bank Accounts" key={TabKeys.bankAccounts} />
          <TabPane tab="Citizen Info" key={TabKeys.citizenInfo} />
          <TabPane tab="Skills" key={TabKeys.skills} />
          <TabPane tab="Social Accounts" key={TabKeys.socialAccounts} />
          <TabPane tab="Projects" key={TabKeys.projects} />
          <TabPane tab="Time Sheet" key={TabKeys.timeSheet} />
          <TabPane tab="Notes" key={TabKeys.notes} />
          <TabPane tab="Devices" key={TabKeys.devices} />
          <TabPane tab="Change Logs" key={TabKeys.changeLogs} />
        </StyledTabs>

        <Switch>
          <Route path={PrivatePath.EMPLOYEES_ID_CHANGELOGS}>
            <ChangeLogs employeeId={id} />
          </Route>
          <Route path={PrivatePath.EMPLOYEES_ID_DEVICES}>
            <Device employeeId={id} />
          </Route>
          <Route path={PrivatePath.EMPLOYEES_ID_NOTES}>
            <Notes employeeId={id} />
          </Route>
          <Route path={PrivatePath.EMPLOYEES_ID_PROJECTS}>
            <Projects employeeId={id} />
          </Route>
          <Route path={PrivatePath.EMPLOYEES_ID_TIMESHEET}>
            time sheet here
          </Route>
          <Route path={PrivatePath.EMPLOYEES_ID_SOCIAL_ACCOUNTS}>
            <SocialNetwork employeeId={id} />
          </Route>
          <Route path={PrivatePath.EMPLOYEES_ID_SKILLS}>
            <Skills employeeId={id} />
          </Route>
          <Route path={PrivatePath.EMPLOYEES_ID_CONTRACT}>
            <JobInfo employeeId={id} />
          </Route>
          <Route path={PrivatePath.EMPLOYEES_ID_BANK_ACCOUNTS}>
            <BankAccounts employeeId={id} />
          </Route>
          <Route path={PrivatePath.EMPLOYEES_ID_CITIZEN_INFO}>
            <IdCardInfo employeeId={id} />
          </Route>
          <Route path={PrivatePath.EMPLOYEES_ID} exact>
            <ProfileInfo employeeId={id} />
          </Route>
          <Route path={PrivatePath.EMPLOYEES_ID_EDIT}>
            <EmployeeEditPage employeeId={id} />
          </Route>
        </Switch>
      </>
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

const StyledTabs = styled(Tabs)`
  margin-top: 10px;
`;
