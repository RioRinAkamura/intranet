/**
 *
 * UserDetailPage
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { Button, Col, Divider, Form, Input, Row } from 'antd';
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

interface Props {}
interface LocationState {
  edit: boolean;
}

export function UserDetailPage(props: Props) {
  const { id } = useParams<Record<string, string>>();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const location = useLocation<LocationState>();
  const history = useHistory();

  const { user } = useGetUserDetail(id);
  const { update, loading } = useUpdateUserDetail();

  const [isCreate, setIsCreate] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);

  const dateFormat = 'YYYY-MM-DD';

  React.useEffect(() => {
    if (user) {
      form.setFieldsValue({
        ...user,
        id: user.id,
        dob: user.dob && moment(user.dob, dateFormat),
        issued_date: user.issued_date && moment(user.issued_date, dateFormat),
      });
    }
  }, [form, user]);

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

  const isView = isCreate || isEdit ? false : true;

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async values => {
        values.dob = moment(values.dob).format(dateFormat);
        values.issued_date = moment(values.issued_date).format(dateFormat);
        if (isEdit) {
          delete values.email;
          const response = await update(values);
          if (response) {
            setIsEdit(false);
          }
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
            ? 'Edit Employess'
            : 'Create Employee'}
        </PageTitle>
      </WrapperTitlePage>
      <Form form={form} labelAlign="left">
        <Form.Item hidden name="id">
          <Input hidden />
        </Form.Item>
        <WrapperMainItem>
          {isView ? (
            <>
              <Row gutter={[32, 32]}>
                <LeftScreen md={5}>
                  <AvatarPath
                    user={user}
                    isView={isView}
                    isEdit={isEdit}
                    form={form}
                  />
                  <IdCardInfo isView={isView} isEdit={isEdit} />
                </LeftScreen>
                <RightScreen isView={isView} md={19}>
                  <ProfileInfo isView={isView} isEdit={isEdit} />
                  <BankAccounts isView={isView} isEdit={isEdit} form={form} />
                </RightScreen>
              </Row>
            </>
          ) : (
            <>
              <Row gutter={[32, 32]}>
                <LeftScreen md={5}>
                  <AvatarPath
                    user={user}
                    isView={isView}
                    isEdit={isEdit}
                    form={form}
                  />
                  <WrapperAddBank>
                    <AddBankModal isView={isView} form={form} />
                  </WrapperAddBank>
                </LeftScreen>
                <RightScreen md={19}>
                  <ProfileInfo isView={isView} isEdit={isEdit} />
                </RightScreen>
              </Row>
              <BankAccounts isView={isView} isEdit={isEdit} form={form} />
              <Divider />
              <IdCardInfo isView={isView} isEdit={isEdit} />
            </>
          )}
        </WrapperMainItem>
        <Row gutter={[64, 32]}>
          <Col span={isView ? 12 : 8}>
            <WrapperItem>
              <JobInfo isView={isView} />
            </WrapperItem>
          </Col>
          <Col span={isView ? 12 : 16}>
            <WrapperItem>
              <SocialNetwork isView={isView} />
            </WrapperItem>
          </Col>
        </Row>
      </Form>
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
    </>
  );
}

interface ScreenProps {
  isView?: boolean;
}

const LeftScreen = styled(Col)``;

const RightScreen = styled(Col)`
  padding-left: ${(props: ScreenProps) =>
    props.isView ? '5em !important' : '0'};
`;

const WrapperMainItem = styled.div`
  margin-top: 2em;
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
