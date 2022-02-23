/**
 *
 * SocialNetwork
 *
 */
import { Employee } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';
import { Col, Form, Row } from 'antd';
import Button from 'app/components/Button';
import moment from 'moment';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components/macro';
import { PrivatePath } from 'utils/url.const';
import { UserDetailMessages } from '../../messages';
import { useHandleEmployeeDetail } from '../../useHandleEmployeeDetail';
import { DetailForm } from '../DetailForm';
import { ProfileInfoDetail } from './components/ProfileInfoDetail';

interface ProfileInfoProps {
  employeeId: string;
}

export const ProfileInfo = (props: ProfileInfoProps) => {
  const { employeeId } = props;
  const { t } = useTranslation();
  const { id } = useParams<Record<string, string>>();
  const history = useHistory();
  const [isEdit, setIsEdit] = React.useState(false);
  const isView = !isEdit;
  const [form] = Form.useForm();
  const [data, setData] = React.useState<Employee>();
  const { getDetail, user, loading } = useHandleEmployeeDetail();

  React.useEffect(() => {
    if (employeeId) {
      getDetail(employeeId);
    }
  }, [employeeId, getDetail]);

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
        dob: data.dob && moment(data.dob),
        starting_date: data.starting_date && moment(data.starting_date),
      });
    }
  }, [data, form]);

  return (
    <>
      <DetailForm
        form={form}
        data={data}
        isEdit={isEdit}
        isView={isView}
        leftScreenItems={<></>}
        rightScreenItems={
          <ProfileInfoDetail isView={isView} isEdit={isEdit} form={form} />
        }
      />
      <WrapperButton>
        <Row gutter={[8, 8]} justify="end">
          <Col>
            {isEdit && (
              <Button
                block
                onClick={() => {
                  if (isEdit) {
                    setIsEdit(false);
                    history.push(`${PrivatePath.EMPLOYEES}/${id}`);
                  } else if (isView) {
                    history.push(`${PrivatePath.EMPLOYEES}/${id}`);
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                {t(UserDetailMessages.formBackButton())}
              </Button>
            )}
          </Col>
          <Col>
            <Button
              loading={loading}
              block
              type="primary"
              onClick={() => {
                history.push(`${PrivatePath.EMPLOYEES}/${id}/edit`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              {t(UserDetailMessages.formEditButton())}
            </Button>
          </Col>
        </Row>
      </WrapperButton>
    </>
  );
};

const WrapperButton = styled.div`
  margin-top: 3em;
  padding: 10px;
  height: 100%;
`;
