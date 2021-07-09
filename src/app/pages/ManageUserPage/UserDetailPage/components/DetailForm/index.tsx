import React, { memo, useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { Col, Form, Input, Row, InputProps } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { User } from '@hdwebsoft/boilerplate-api-sdk/libs/api/user/models';
import fakeAPI from 'utils/fakeAPI';
import { omit } from 'lodash';
import { useHistory } from 'react-router';
import { AvatarPath } from 'app/pages/EmployeePage/EmployeeDetailPage/components/AvatarPath';
import { ToastMessageType, useNotify } from 'app/components/ToastNotification';
import Button from 'app/components/Button';

interface FormProps {
  isView: boolean;
  isEdit: boolean;
  isCreate: boolean;
  user?: any;
  callback: () => void;
}

const inputProps: InputProps = {
  bordered: false,
  readOnly: true,
};
interface UserForm {
  first_name?: string;
  last_name?: string;
  bio?: string;
  avatar?: string;
  display_name?: string;
  email?: string;
  phone?: string;
}

export const DetailForm = memo((props: FormProps) => {
  const [isEditPass, setEditPass] = useState(false);
  const { notify } = useNotify();
  const { isView, isEdit, user, callback, isCreate } = props;
  const [currentUserForm, setCurrentUserForm] = useState<UserForm>();
  const [userForm] = Form.useForm();
  const history = useHistory();

  useEffect(() => {
    if (user) {
      userForm.setFieldsValue({
        ...user,
        id: user.id,
      });
      setCurrentUserForm({ ...user });
    }
  }, [user, userForm, isEdit]);

  useEffect(() => {
    if (isCreate) {
      setEditPass(true);
    } else {
      setEditPass(false);
    }
  }, [isCreate]);

  // submit form
  const handleSubmitForm = async (value: User) => {
    try {
      if (!isEdit) {
        const newUser = omit(value, ['id', 'password2']);

        const response = await fakeAPI.post('/users/', newUser);

        notify({
          type: ToastMessageType.Info,
          message: `Add User Success`,
          className: 'label-cancel-user',
          duration: 2,
        });

        const userResponse: any = { ...response };

        history.push(`/users/${userResponse.id}`);
      } else {
        let updateUser = isEditPass
          ? omit(value, ['password2'])
          : omit(value, ['password', 'password2']);

        if (currentUserForm && currentUserForm.email === value.email) {
          updateUser = omit(updateUser, ['email']);
        } else {
          setCurrentUserForm({ ...currentUserForm, email: value.email });
        }

        if (currentUserForm && currentUserForm.phone === value.phone) {
          updateUser = omit(updateUser, ['phone']);
        } else {
          setCurrentUserForm({ ...currentUserForm, phone: value.phone });
        }
        const response = await fakeAPI.patch(
          `users/${updateUser.id}/`,
          updateUser,
        );

        const userResponse: any = { ...response };

        history.push(`/users/${userResponse.id}`);

        notify({
          type: ToastMessageType.Info,
          message: `Update User Success`,
          className: 'label-cancel-user',
          duration: 2,
        });

        callback();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleEditPassword = () => {
    setEditPass(!isEditPass);
    if (isEditPass) {
      userForm.resetFields(['password', 'password2']);
    }
  };

  return (
    <Form form={userForm} onFinish={handleSubmitForm}>
      <Form.Item hidden name="id">
        <Input hidden />
      </Form.Item>
      <Row gutter={12}>
        <LeftScreen md={6}>
          <Col span={24}>
            <AvatarPath
              user={user}
              isView={isView}
              isEdit={isEdit}
              form={userForm}
              hidden={true}
            />
          </Col>
        </LeftScreen>
        <RightScreen isView={isView} md={18}>
          <TitlePath>
            <b>User information</b>
          </TitlePath>
          <Row gutter={16} align="top">
            <Col
              md={12}
              xs={24}
              // style={isView ? { borderRight: '1px solid #c5c4c5' } : {}}
            >
              <Row gutter={[0, 12]} align="middle">
                <Col md={isView ? 8 : 24} xs={24}>
                  FirstName
                </Col>
                <Col md={isView ? 16 : 24} xs={24}>
                  <FormItem
                    isView={isView}
                    name="first_name"
                    rules={
                      isView
                        ? []
                        : [
                            {
                              required: true,
                              message: 'Please Enter User First Name!',
                            },
                          ]
                    }
                  >
                    <Input
                      {...(isView ? inputProps : {})}
                      size="large"
                      placeholder={isView ? '' : 'firstName'}
                    />
                  </FormItem>
                </Col>
                <Col md={isView ? 8 : 24} xs={24}>
                  User Email
                </Col>
                <Col md={isView ? 16 : 24} xs={24}>
                  {' '}
                  <FormItem
                    isView={isView}
                    name="email"
                    rules={
                      isView
                        ? []
                        : [
                            {
                              required: true,
                              message: 'Please Enter User Email',
                            },
                            {
                              type: 'email',
                              message: 'Please Enter Valid Email',
                            },
                          ]
                    }
                  >
                    <Input
                      {...(isView ? inputProps : {})}
                      size="large"
                      placeholder={isView ? '' : 'Email'}
                    />
                  </FormItem>
                </Col>

                <Col md={isView ? 8 : 24} xs={24}>
                  Bio
                </Col>
                <Col md={isView ? 16 : 24} xs={24}>
                  {' '}
                  <FormItem
                    isView={isView}
                    name="bio"
                    rules={
                      isView
                        ? []
                        : [
                            {
                              required: true,
                              message: 'Please Enter User Bio',
                            },
                          ]
                    }
                  >
                    <Input
                      {...(isView ? inputProps : {})}
                      size="large"
                      placeholder={isView ? '' : 'Bio'}
                    />
                  </FormItem>
                </Col>

                {!isView && (
                  <>
                    <Col md={isView ? 8 : 24} xs={24}>
                      Password
                    </Col>
                    <Col md={isView ? 16 : 24} xs={24}>
                      {' '}
                      <FormItem
                        isView={isView}
                        name="password"
                        rules={
                          isView || !isEditPass
                            ? []
                            : [
                                {
                                  required: true,
                                  message: 'Please Enter User New Password',
                                },
                              ]
                        }
                      >
                        <Input.Password
                          {...(isView ? inputProps : {})}
                          disabled={!isEditPass}
                          size="large"
                          placeholder={isView ? '' : 'Password'}
                          iconRender={visible =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                          }
                        />
                      </FormItem>
                      {!isCreate && (
                        <EditPasswordButton onClick={handleEditPassword}>
                          {isEditPass
                            ? 'Use current password'
                            : 'Edit user password'}
                        </EditPasswordButton>
                      )}
                    </Col>
                  </>
                )}
              </Row>
            </Col>
            <Col
              md={12}
              xs={24}
              // style={isView ? { borderLeft: '1px solid #c5c4c5' } : {}}
            >
              <Row gutter={[0, 12]} align="middle">
                <Col md={isView ? 8 : 24} xs={24}>
                  Last Name
                </Col>
                <Col md={isView ? 16 : 24} xs={24}>
                  <FormItem
                    isView={isView}
                    name="last_name"
                    rules={
                      isView
                        ? []
                        : [
                            {
                              required: true,
                              message: 'Please enter lastname',
                            },
                          ]
                    }
                  >
                    <Input
                      {...(isView ? inputProps : {})}
                      size="large"
                      placeholder={isView ? '' : 'Lastname'}
                    />
                  </FormItem>
                </Col>
                <Col md={isView ? 8 : 24} xs={24}>
                  Display Name
                </Col>
                <Col md={isView ? 16 : 24} xs={24}>
                  <FormItem
                    isView={isView}
                    name="username"
                    rules={
                      isView
                        ? []
                        : [
                            {
                              required: true,
                              message: 'Please Enter Display Name',
                            },
                          ]
                    }
                  >
                    <Input
                      {...(isView ? inputProps : {})}
                      size="large"
                      placeholder={isView ? '' : 'Display Name'}
                    />
                  </FormItem>
                </Col>
                <Col md={isView ? 8 : 24} xs={24}>
                  Phone Number
                </Col>
                <Col md={isView ? 16 : 24} xs={24}>
                  <FormItem
                    isView={isView}
                    name="phone"
                    rules={
                      isView
                        ? []
                        : [
                            {
                              required: true,
                              message: 'Please Enter Form Number',
                            },
                          ]
                    }
                  >
                    <Input
                      {...(isView ? inputProps : {})}
                      size="large"
                      placeholder={isView ? '' : 'Phone Number'}
                    />
                  </FormItem>
                </Col>
                {!isView && (
                  <>
                    <Col md={isView ? 8 : 24} xs={24}>
                      Confirm Password
                    </Col>
                    <Col md={isView ? 16 : 24} xs={24}>
                      {' '}
                      <FormItem
                        isView={isView}
                        name="password2"
                        dependencies={['password']}
                        rules={
                          isView || !isEditPass
                            ? []
                            : [
                                {
                                  required: true,
                                  message: 'Please Enter Confirm Password',
                                },
                                ({ getFieldValue }) => ({
                                  validator(_, value) {
                                    if (
                                      !value ||
                                      getFieldValue('password') === value
                                    ) {
                                      return Promise.resolve();
                                    }
                                    return Promise.reject(
                                      new Error(
                                        'The two passwords that you entered do not match!',
                                      ),
                                    );
                                  },
                                }),
                              ]
                        }
                      >
                        <Input.Password
                          {...(isView ? inputProps : {})}
                          disabled={!isEditPass}
                          size="large"
                          placeholder={isView ? '' : 'Confirm Password'}
                          iconRender={visible =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                          }
                        />
                      </FormItem>
                    </Col>
                  </>
                )}
              </Row>
            </Col>
          </Row>
        </RightScreen>
      </Row>
      {!isView && (
        <Row justify="end">
          <Col>
            <Form.Item>
              <Button block type="primary" htmlType="submit">
                Save
              </Button>
            </Form.Item>
          </Col>
        </Row>
      )}
    </Form>
  );
});

interface ScreenProps {
  isView?: boolean;
}

const LeftScreen = styled(Col)``;

const EditPasswordButton = styled.p`
  font-size: 12px;
  cursor: pointer;
  color: #8c8a89;
`;

const RightScreen = styled(Col)<ScreenProps>`
  padding-left: ${props => (props.isView ? '5em !important' : '0')};
`;

export const TitlePath = styled.div`
  color: #1890ff;
  margin-bottom: 24px;
`;

const FormItem = styled(Form.Item)`
  align-items: center;
  margin-bottom: ${(props: ScreenProps) => (props.isView ? '0px' : '12px')};
  div {
    width: 100%;
  }
  label {
    font-weight: 500;
  }
  input {
    font-weight: ${(props: ScreenProps) => props.isView && 500};
  }
  #gender {
    label {
      margin-right: 5em;
    }
  }

  #status {
    label {
      margin-right: 10em;
    }
  }
`;
