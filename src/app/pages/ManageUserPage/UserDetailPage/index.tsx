import React, { useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import { Button } from 'antd';
import PageTitle from 'app/components/PageTitle';
import { DetailForm } from './components/DetailForm';
import { CardLayout } from 'app/components/CardLayout';
import { useBreadCrumbContext } from 'app/components/Breadcrumbs/context';
import { User } from '@hdwebsoft/boilerplate-api-sdk/libs/api/user/models';
import { api } from 'utils/api';

interface LocationState {
  edit: boolean;
}

export const UserManageDetailPage = props => {
  const { setBreadCrumb } = useBreadCrumbContext();
  const { id } = useParams<Record<string, string>>();
  const location = useLocation<LocationState>();
  const history = useHistory();

  const [isCreate, setIsCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const isView = isCreate || isEdit ? false : true;
  const [data, setData] = useState<User>();

  const getUserName = () => {
    if (data) return `${data.first_name} ${data.last_name}`;

    return 'Unknown';
  };

  React.useEffect(() => {
    (async () => {
      try {
        const response = await api.user.getUserById(id);
        setData(response);
        setBreadCrumb(`Users / ${response.first_name}`);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [id, setBreadCrumb, isEdit]);

  React.useEffect(() => {
    if (history.location.pathname.includes('create')) {
      setIsCreate(true);
      setBreadCrumb(`Users / Create`);
    } else {
      setIsCreate(false);
    }
  }, [history.location.pathname, setBreadCrumb]);

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
        title={isView ? getUserName() : isEdit ? 'Edit User' : 'Create User'}
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
