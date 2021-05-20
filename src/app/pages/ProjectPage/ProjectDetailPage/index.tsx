/**
 *
 * ProjectDetailPage
 *
 */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { Button, Col, Form, Input, Row } from 'antd';
import { useHistory, useLocation, useParams } from 'react-router';
import { UserDetailMessages } from './messages';
import moment from 'moment';
import { useProjectDetail } from './useProjectDetail';
import { PageTitle } from 'app/components/PageTitle';
import { WrapperTitlePage } from 'app/components/WrapperTitlePage';
import { config } from 'config';
import { ProjectInfo } from './components/ProjectInfo';
import { TeamMembers } from './components/TeamMembers';

interface Props {}
interface LocationState {
  edit: boolean;
}

const DATE_FORMAT = config.DATE_FORMAT;

export const ProjectDetailPage = (props: Props) => {
  const { id } = useParams<Record<string, string>>();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const location = useLocation<LocationState>();
  const history = useHistory();

  const { fetchId, create, update, loading } = useProjectDetail();

  const [data, setData] = useState<any>();
  const [isCreate, setIsCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const isView = isCreate || isEdit ? false : true;

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
        id: data.id,
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
          }
        } catch (error) {}
      })();
    } else {
      setIsCreate(true);
    }
  }, [id, fetchId]);

  useEffect(() => {
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
        values.started = moment(values.started).format(DATE_FORMAT);
        if (isEdit) {
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
            ? 'Project Details'
            : isEdit
            ? 'Edit Project'
            : 'Create Project'}
        </PageTitle>
      </WrapperTitlePage>
      <WrapperMainItem>
        <Form form={form} labelAlign="left">
          <Form.Item hidden name="id">
            <Input hidden />
          </Form.Item>
          <ProjectInfo isView={isView} form={form} data={data} />
          <TeamMembers isView={isView} isEdit={isEdit} form={form} />
        </Form>
      </WrapperMainItem>
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
};

const WrapperMainItem = styled.div`
  margin-top: 2em;
  padding: 3em;
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
