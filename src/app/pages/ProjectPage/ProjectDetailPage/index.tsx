import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { Col, Form, Input, Row } from 'antd';
import { useHistory, useLocation, useParams } from 'react-router';
import moment from 'moment';
import { useProjectDetail } from './useProjectDetail';
import PageTitle from 'app/components/PageTitle';
import { CardLayout } from 'app/components/CardLayout';
import Button from 'app/components/Button';
import { config } from 'config';
import { ProjectInfo } from './components/ProjectInfo';
import { TeamMembers } from './components/TeamMembers';
import { ProjectDetailMessages } from './messages';

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
        status: Number(data.status),
        priority: Number(data.priority),
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

  return (
    <>
      <PageTitle
        title={
          isView
            ? t(ProjectDetailMessages.title())
            : isEdit
            ? t(ProjectDetailMessages.editTitle())
            : t(ProjectDetailMessages.createTitle())
        }
      />
      <CardLayout padding="3rem">
        <Form form={form} labelAlign="left">
          <Form.Item hidden name="id">
            <Input hidden />
          </Form.Item>
          <ProjectInfo isView={isView} form={form} data={data} />
          <TeamMembers isView={isView} isEdit={isEdit} form={form} />
        </Form>
      </CardLayout>
      <WrapperButton>
        <Row gutter={[8, 8]} justify="end">
          <Col>
            <Button
              block
              onClick={() => {
                if (isEdit) {
                  setIsEdit(false);
                } else {
                  history.push('/projects');
                }
              }}
            >
              {t(ProjectDetailMessages.buttonCancel())}
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
                ? t(ProjectDetailMessages.buttonEdit())
                : t(ProjectDetailMessages.buttonSubmit())}
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
