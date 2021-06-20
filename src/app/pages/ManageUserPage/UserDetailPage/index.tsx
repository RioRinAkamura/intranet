import React, { useState } from 'react';
import { WrapperTitlePage } from 'app/components/WrapperTitlePage';
import { useHistory, useLocation, useParams } from 'react-router';
import { Button, Col, Row } from 'antd';
import { PageTitle } from 'app/components/PageTitle';
import { DetailForm } from './components/DetailForm';
import styled from 'styled-components/macro';
import fakeAPI from 'utils/fakeAPI';

interface LocationState {
  edit: boolean;
}

export const UserManageDetailPage = props => {
  const { id } = useParams<Record<string, string>>();
  const location = useLocation<LocationState>();
  const history = useHistory();

  const [isCreate, setIsCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const isView = isCreate || isEdit ? false : true;
  const [data, setData] = useState({});

  React.useEffect(() => {
    (async () => {
      try {
        const response = await fakeAPI.get(`/users/${id}`);
        setData(response);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [id]);

  React.useEffect(() => {
    if (history.location.pathname.includes('create')) {
      setIsCreate(true);
    } else {
      setIsCreate(false);
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

  return (
    <>
      <WrapperTitlePage>
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col sm={16} xs={24}>
            <PageTitle>
              {isView ? 'User Name' : isEdit ? 'Edit User' : 'Create User'}
            </PageTitle>
          </Col>
        </Row>
      </WrapperTitlePage>
      <Wrapper>
        <DetailForm
          isCreate={isCreate}
          callback={() => setIsEdit(false)}
          isEdit={isEdit}
          user={data}
          isView={isView}
        />
      </Wrapper>
      {isView && (
        <Button
          style={{ marginLeft: 'auto', display: 'block' }}
          type="primary"
          size="large"
          shape="round"
          onClick={() => setIsEdit(true)}
        >
          Edit
        </Button>
      )}
    </>
  );
};

const Wrapper = styled.div`
  background-color: white;
  padding: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
  border-radius: 12px;
  margin-top: 2rem;
`;
