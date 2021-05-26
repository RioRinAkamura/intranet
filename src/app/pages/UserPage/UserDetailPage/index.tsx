/**
 *
 * UserDetailPage
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { Button, Col, Form, Row, Tabs } from 'antd';
import { useHistory, useLocation, useParams } from 'react-router';
import { ProfileInfo } from './components/ProfileInfo/Loadable';
import { BankAccounts } from './components/BankAccounts/Loadable';
import { UserDetailMessages } from './messages';
import { useGetUserDetail } from './useGetUserDetail';
import moment from 'moment';
import { useUpdateUserDetail } from './useUpdateUserDetail';
import { PageTitle } from 'app/components/PageTitle';
import { IdCardInfo } from './components/IdCardInfo/Loadable';
import { AddBankModal } from './components/AddBankModal/Loadable';
import { WrapperTitlePage } from 'app/components/WrapperTitlePage';
import { models } from '@hdwebsoft/boilerplate-api-sdk';
import { config } from 'config';
import { Notes } from './components/Notes/Loadable';
import { DetailForm } from './components/DetailForm/Loadable';
import { Projects } from './components/Projects/Loadable';

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
}

export function UserDetailPage(props: Props) {
  const { id } = useParams<Record<string, string>>();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const location = useLocation<LocationState>();
  const history = useHistory();

  const { user } = useGetUserDetail(id);
  const { create, update, loading } = useUpdateUserDetail();

  const [data, setData] = React.useState<Employee>();
  const [isCreate, setIsCreate] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);

  const isView = isCreate || isEdit ? false : true;

  const { TabPane } = Tabs;
  const [isDetailTab, setIsDetailTab] = React.useState(true);

  const onChangeTab = (key: string) => {
    if (key === TabKeys.notes) {
      setIsDetailTab(false);
      history.push(`/employees/${id}/notes`);
    } else if (key === TabKeys.projects) {
      setIsDetailTab(false);
      history.push(`/employees/${id}/projects`);
    } else {
      setIsDetailTab(true);
      history.push(`/employees/${id}`);
    }
  };

  const getDefaultTab = React.useMemo(() => {
    if (history.location.pathname.includes('notes')) {
      return `${TabKeys.notes}`;
    }
    if (history.location.pathname.includes('projects')) {
      return `${TabKeys.projects}`;
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
    }
  }, [data, form, isEdit]);

  React.useEffect(() => {
    if (history.location.pathname.includes('create')) {
      setIsCreate(true);
    } else {
      setIsCreate(false);
    }
    if (history.location.pathname.includes('notes')) {
      setIsDetailTab(false);
    } else if (history.location.pathname.includes('projects')) {
      setIsDetailTab(false);
    }
  }, [history.location.pathname]);

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
      <WrapperTitlePage>
        <PageTitle>
          {isView
            ? 'Employee Details'
            : isEdit
            ? 'Edit Employee'
            : 'Create Employee'}
        </PageTitle>
      </WrapperTitlePage>
      {isView ? (
        <StyledTabs defaultActiveKey={getDefaultTab} onChange={onChangeTab}>
          <TabPane tab="Details" key={TabKeys.details}>
            <DetailForm
              form={form}
              data={data}
              isEdit={isEdit}
              isView={isView}
              leftScreenItems={<IdCardInfo isView={isView} isEdit={isEdit} />}
              rightScreenItems={
                <>
                  <ProfileInfo isView={isView} isEdit={isEdit} />
                  <BankAccounts isView={isView} isEdit={isEdit} form={form} />
                </>
              }
            />
          </TabPane>
          <TabPane tab="Notes" key={TabKeys.notes}>
            <Notes />
          </TabPane>
          <TabPane tab="Projects" key={TabKeys.projects}>
            <Projects data={data} />
          </TabPane>
        </StyledTabs>
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
          rightScreenItems={<ProfileInfo isView={isView} isEdit={isEdit} />}
        />
      )}
      {isDetailTab && (
        <WrapperButton>
          <Row gutter={[8, 8]} justify="end">
            <Col>
              <PageButton
                block
                size="large"
                shape="round"
                onClick={() => {
                  if (isEdit) {
                    setIsEdit(false);
                  } else if (isView) {
                    history.push('/employees');
                  } else if (isCreate) {
                    history.push('/employees');
                  }
                }}
              >
                {t(UserDetailMessages.formBackButton())}
              </PageButton>
            </Col>
            <Col>
              <PageButton
                loading={loading}
                block
                size="large"
                shape="round"
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
              </PageButton>
            </Col>
          </Row>
        </WrapperButton>
      )}
    </>
  );
}

const WrapperButton = styled.div`
  margin-top: 3em;
  padding: 10px;
  height: 100%;
`;

const PageButton = styled(Button)`
  width: 120px;
`;

const WrapperAddBank = styled.div`
  margin-top: 2em;
`;

const StyledTabs = styled(Tabs)`
  margin-top: 10px;
  .ant-tabs-content-holder {
    padding: 5px;
  }
`;
