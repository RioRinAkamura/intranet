/**
 *
 * UserDetailPage
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Col,
  Divider,
  Form,
  FormInstance,
  Input,
  Row,
  Tabs,
} from 'antd';
import { useHistory, useLocation, useParams } from 'react-router';
import { ProfileInfo } from './components/ProfileInfo/Loadable';
import { JobInfo } from './components/JobInfo/Loadable';
import { BankAccounts } from './components/BankAccounts/Loadable';
import { SocialNetwork } from './components/SocialNetwork/Loadable';
import { UserDetailMessages } from './messages';
import { useGetUserDetail } from './useGetUserDetail';
import moment from 'moment';
import { useUpdateUserDetail } from './useUpdateUserDetail';
import { PageTitle } from 'app/components/PageTitle';
import { AvatarPath } from './components/AvatarPath/Loadable';
import { IdCardInfo } from './components/IdCardInfo/Loadable';
import { AddBankModal } from './components/AddBankModal/Loadable';
import { WrapperTitlePage } from 'app/components/WrapperTitlePage';
import { models } from '@hdwebsoft/boilerplate-api-sdk';
import { config } from 'config';
import { Notes } from './components/Notes/Loadable';

interface Props {}

interface FormProps {
  form: FormInstance;
  isView: boolean;
  isEdit: boolean;
  data?: Employee;
  leftScreenItems?: React.ReactNode;
  rightScreenItems?: React.ReactNode;
}

interface LocationState {
  edit: boolean;
}

type Employee = models.hr.Employee;

const DATE_FORMAT = config.DATE_FORMAT;

enum TabKeys {
  'details' = 'details',
  'notes' = 'notes',
}

const WrapperForm: React.FC<FormProps> = ({
  form,
  isView,
  isEdit,
  data,
  leftScreenItems,
  rightScreenItems,
}) => {
  return (
    <Form form={form} labelAlign="left">
      <Form.Item hidden name="id">
        <Input hidden />
      </Form.Item>
      <WrapperMainItem isView={isView}>
        <Row gutter={[32, 32]}>
          <LeftScreen md={5}>
            <AvatarPath
              user={data}
              isView={isView}
              isEdit={isEdit}
              form={form}
            />
            {leftScreenItems}
          </LeftScreen>
          <RightScreen isView={isView} md={19}>
            {rightScreenItems}
          </RightScreen>
        </Row>
        {!isView && (
          <>
            <BankAccounts isView={isView} isEdit={isEdit} form={form} />
            <Divider />
            <IdCardInfo isView={isView} isEdit={isEdit} />
          </>
        )}
      </WrapperMainItem>
      <Row gutter={[64, 32]}>
        <Col span={isView ? 12 : 8}>
          <WrapperItem>
            <JobInfo form={form} isView={isView} />
          </WrapperItem>
        </Col>
        <Col span={isView ? 12 : 16}>
          <WrapperItem>
            <SocialNetwork isView={isView} />
          </WrapperItem>
        </Col>
      </Row>
    </Form>
  );
};

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
  const [isNotesTab, setIsNotesTab] = React.useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isNotesLocation = () => history.location.pathname.includes('notes');

  const onChangeTab = (key: string) => {
    if (key === TabKeys.notes) {
      setIsNotesTab(true);
      history.push(`/employees/${id}/notes`);
    } else {
      setIsNotesTab(false);
      history.push(`/employees/${id}`);
    }
  };

  const getDefaultTab = () => {
    if (isNotesLocation()) {
      return `${TabKeys.notes}`;
    }
    return `${TabKeys.details}`;
  };

  React.useEffect(() => {
    if (isNotesLocation()) {
      setIsNotesTab(true);
    }
  }, [history.location.pathname, isNotesLocation, isNotesTab]);

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
    if (!history.location.pathname.includes('create')) {
      setIsCreate(false);
    } else {
      setIsCreate(true);
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
        <StyledTabs defaultActiveKey={getDefaultTab()} onChange={onChangeTab}>
          <TabPane tab="Details" key={TabKeys.details}>
            <WrapperForm
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
        </StyledTabs>
      ) : (
        <WrapperForm
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
      {!isNotesTab && (
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

interface ScreenProps {
  isView?: boolean;
}

const LeftScreen = styled(Col)``;

const RightScreen = styled(Col)<ScreenProps>`
  padding-left: ${props => (props.isView ? '5em !important' : '0')};
`;

const WrapperMainItem = styled.div<ScreenProps>`
  margin-top: ${props => (props.isView ? 'auto' : '2rem')};
  padding: 3em;
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
`;
const WrapperItem = styled.div`
  margin-top: 2em;
  padding: 3em 3em 0 3em;
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
`;

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
