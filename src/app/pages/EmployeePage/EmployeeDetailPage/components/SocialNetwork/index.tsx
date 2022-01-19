/**
 *
 * SocialNetwork
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { Col, Form, Input, InputProps, Row } from 'antd';
import {
  FacebookFilled,
  GithubFilled,
  GitlabFilled,
  LinkedinFilled,
  SkypeFilled,
  TwitterCircleFilled,
} from '@ant-design/icons';
import { UserDetailMessages } from '../../messages';
import { TitlePath } from '../TitlePath';
import Button from 'app/components/Button';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { PrivatePath } from 'utils/url.const';
import { useHandleEmployeeDetail } from '../../useHandleEmployeeDetail';
import { Employee } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';
import { DetailForm } from '../DetailForm';
import { SocialNetworkDetail } from './components/SocialNetworkDetail';
import { LocationState } from '../..';

interface SocialNetworkProps {
  isView?: boolean;
  isEdit?: boolean;
  employeeId?: string
}

const inputProps: InputProps = {
  bordered: false,
  readOnly: true,
};

export const SocialNetwork = (props: SocialNetworkProps) => {
  const {employeeId} = props
  const { t } = useTranslation();
  const { id } = useParams<Record<string, string>>();
  const history = useHistory();
  const location = useLocation<LocationState>()
  const [isEdit, setIsEdit] = React.useState(false);
  const isView = !isEdit;
  const [form] = Form.useForm();
  const [data, setData] = React.useState<Employee>();
  const {
    update,
    getDetail,
    user,
    loading,
  } = useHandleEmployeeDetail();

  React.useEffect(()=> {
    if(employeeId) {
      getDetail(employeeId)
    }
  }, [employeeId, getDetail])

  React.useEffect(()=>{
    if(user) {
      setData(user)
    }
  },[user]);

  React.useEffect(()=>{
    if(location.state){
      const edit = location.state.edit;
      if(edit){
        setIsEdit(true);
        history.replace(location.pathname, {});
      }
    }
  }, [history, location])

  React.useEffect(()=>{
    if(data){
      form.setFieldsValue({
        ...data,
        id: data.id,
      });
    }
  },[data, form])

  const handleSocialAccountstEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (isEdit) {
        const response = await update(values);
        if (response) {
          setData(response);
          setIsEdit(false);
          history.push(`${PrivatePath.EMPLOYEES}/${id}/social-accounts`);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <DetailForm
          form={form}
          data={data}
          isEdit={isEdit}
          isView={isView}
          leftScreenItems={<></>}
          rightScreenItems={<SocialNetworkDetail isView={isView} isEdit={isEdit} />}
        />
      <WrapperButton>
          <Row gutter={[8, 8]} justify="end">
            <Col>
              <Button
                block
                onClick={() => {
                  if (isEdit) {
                    setIsEdit(false);
                    history.push(`${PrivatePath.EMPLOYEES}/${id}/social-accounts`);
                  } else if (isView) {
                    history.push(`${PrivatePath.EMPLOYEES}/${id}/social-accounts`);
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
                    console.log('isView', isView);

                    history.push(
                      `${PrivatePath.EMPLOYEES}/${id}/social-accounts/edit`,
                    );
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    handleSocialAccountstEditSubmit();
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
    </>
  );
};

interface ScreenProps {
  isView?: boolean;
}

const FormItem = styled(Form.Item)`
  margin-bottom: ${(props: ScreenProps) => (props.isView ? '0' : '24px')};
  div {
    width: 100%;
  }
  label {
    font-weight: 500;
  }
`;

const WrapperButton = styled.div`
  margin-top: 3em;
  padding: 10px;
  height: 100%;
`;
