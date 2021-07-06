import React, { useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import { Button } from 'antd';
import PageTitle from 'app/components/PageTitle';
import { DetailForm } from './components/DetailForm';
import fakeAPI from 'utils/fakeAPI';
import { CardLayout } from 'app/components/CardLayout';

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
      <PageTitle
        title={isView ? 'User Name' : isEdit ? 'Edit User' : 'Create User'}
      />
      <CardLayout>
        <DetailForm
          isCreate={isCreate}
          callback={() => setIsEdit(false)}
          isEdit={isEdit}
          user={data}
          isView={isView}
        />
      </CardLayout>
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
