import { Form, Input, Tabs } from 'antd';
import { useBreadCrumbContext } from 'app/components/Breadcrumbs/context';
import { CardForm } from 'app/components/CardForm';
import PageTitle from 'app/components/PageTitle';
import { config } from 'config';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components/macro';
import { PrivatePath } from 'utils/url.const';
import { ChangeLogs } from './components/ChangeLogs';
import { Employees } from './components/Employees';
import { Notes } from './components/Notes';
import { ProjectInfo } from './components/ProjectInfo';
// import { TeamMembers } from './components/TeamMembers';
import { ProjectDetailMessages } from './messages';
import { useProjectDetail } from './useProjectDetail';

interface Props {}
interface LocationState {
  edit: boolean;
}

const DATE_FORMAT = config.DATE_FORMAT;

enum TabKeys {
  'details' = 'details',
  'notes' = 'notes',
  'changeLogs' = 'changeLogs',
  'employees' = 'employees',
}

export const ProjectDetailPage = (props: Props) => {
  const { TabPane } = Tabs;

  const { setBreadCrumb } = useBreadCrumbContext();
  const { id } = useParams<Record<string, string>>();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const location = useLocation<LocationState>();
  const history = useHistory();

  const { fetchId, create, update, loading } = useProjectDetail();

  const [data, setData] = useState<any>();
  const [isCreate, setIsCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isView = isCreate || isEdit ? false : true;

  const getDefaultTab = React.useMemo(() => {
    if (history.location.pathname.includes('notes')) {
      return `${TabKeys.notes}`;
    } else if (history.location.pathname.includes('change-logs')) {
      return `${TabKeys.changeLogs}`;
    } else if (history.location.pathname.includes('employees')) {
      return `${TabKeys.employees}`;
    }
    return `${TabKeys.details}`;
  }, [history.location.pathname]);

  const onChangeTab = (key: string) => {
    if (key === TabKeys.notes) {
      history.push(`${PrivatePath.PROJECTS}/${id}/notes`);
    } else if (key === TabKeys.changeLogs) {
      history.push(`${PrivatePath.PROJECTS}/${id}/change-logs`);
    } else if (key === TabKeys.employees) {
      history.push(`${PrivatePath.PROJECTS}/${id}/employees`);
    } else {
      history.push(`${PrivatePath.PROJECTS}/${id}`);
    }
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
        started: data.started && moment(data.started, DATE_FORMAT),
      });
    }
  }, [data, form, isEdit]);

  useEffect(() => {
    if (id) {
      setIsCreate(false);
      (async () => {
        try {
          const response = await fetchId(id);
          if (response) {
            setData(response);
            setBreadCrumb(`Projects / ${response.name}`);
          }
        } catch (error) {}
      })();
    } else {
      setIsCreate(true);
      setBreadCrumb(`Projects / Add Project`);
    }
  }, [id, fetchId, setBreadCrumb]);

  useEffect(() => {
    if (location.state) {
      const edit = location.state.edit;
      if (edit) {
        setIsEdit(true);
        history.replace(location.pathname, {});
      }
    }
  }, [history, location]);

  const onCancel = () => {
    if (isEdit) {
      setIsEdit(false);
    } else {
      history.push(PrivatePath.PROJECTS);
    }
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async values => {
        values.started = moment(values.started).format(DATE_FORMAT);
        if (isEdit) {
          const response = await update(values);
          if (response) {
            delete response.members;
            setData(prev => ({ ...prev, ...response }));
            setIsEdit(false);
          }
        }
        if (isCreate) {
          create(values);
        }
      })
      .catch(err => console.log(err));
  };

  const onSubmit = () => {
    if (isEdit) {
      handleSubmit();
    } else if (isView) {
      setIsEdit(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (isCreate) {
      handleSubmit();
    }
  };

  const projectDetailForm = () => (
    <CardForm
      isView={isView}
      onCancel={onCancel}
      onSubmit={onSubmit}
      loading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item hidden name="id">
          <Input hidden />
        </Form.Item>
        <ProjectInfo
          isView={isView}
          form={form}
          data={data}
          isEdit={isEdit}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </Form>
    </CardForm>
  );

  return (
    <>
      <PageTitle
        title={
          isView
            ? isLoading
              ? ''
              : `${data?.name || 'Unknown'}`
            : isEdit
            ? t(ProjectDetailMessages.editTitle())
            : t(ProjectDetailMessages.createTitle())
        }
      />
      {isView ? (
        <>
          <StyledTabs defaultActiveKey={getDefaultTab} onChange={onChangeTab}>
            <TabPane tab="Details" key={TabKeys.details} />
            <TabPane tab="Members" key={TabKeys.employees} />
            <TabPane tab="Notes" key={TabKeys.notes} />
            <TabPane tab="Change Log" key={TabKeys.changeLogs} />
          </StyledTabs>

          <Switch>
            <Route
              exact
              path={PrivatePath.PROJECTS_ID}
              component={() => projectDetailForm()}
            />
            <Route
              path={PrivatePath.PROJECTS_ID_EMPLOYEES}
              component={() => <Employees />}
            />
            <Route
              exact
              path={PrivatePath.PROJECTS_ID_NOTES}
              component={() => <Notes projectId={id} />}
            />
            <Route
              path={PrivatePath.PROJECTS_ID_CHANGELOGS}
              component={() => <ChangeLogs project_id={id} />}
            />
          </Switch>
        </>
      ) : (
        <StyledWrapperForm>{projectDetailForm()}</StyledWrapperForm>
      )}
    </>
  );
};

const StyledTabs = styled(Tabs)`
  margin-top: 10px;
`;

const StyledWrapperForm = styled.div`
  margin-top: 2rem;
  > div > div:last-child {
    margin-top: 0;
  }
`;
