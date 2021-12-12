/**
 *
 * UserList
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { Col, List, Row, Spin } from 'antd';
import { Avatar } from 'app/components/Avatar/Loadable';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  LoadingOutlined,
  MailFilled,
  PhoneFilled,
} from '@ant-design/icons';
import { useHistory } from 'react-router';
import { models } from '@hdwebsoft/intranet-api-sdk';
import { CardLayout } from 'app/components/CardLayout';
import { IconButton } from 'app/components/Button';

type Employee = models.hr.Employee;
interface Props {
  loading: boolean;
  data: Employee[];
  isMore: boolean;
  moreLoading: boolean;
  onDelete: (id: string, user: Employee) => void;
}

export const ProjectList = React.memo((props: Props) => {
  const { loading, data, isMore, moreLoading, onDelete } = props;
  const history = useHistory();
  return (
    <CardLayout>
      <List
        className="demo-loadmore-list"
        loading={loading}
        itemLayout="vertical"
        dataSource={data}
        renderItem={(user: Employee, index: number) => (
          <ListItem key={index}>
            <Row gutter={[8, 8]}>
              <Col style={{ textAlign: 'center' }} span={10}>
                <Avatar
                  size={90}
                  src={user.avatar}
                  alt={user.first_name + ' ' + user.last_name}
                  name={user.first_name + ' ' + user.last_name}
                />
              </Col>
              <Col span={14}>
                <h2>{user.first_name + ' ' + user.last_name}</h2>
                <ProfileDescription gutter={[8, 8]}>
                  <Col span={4}>
                    <PhoneFilled />
                  </Col>
                  <Col span={20}>{user.phone}</Col>
                  <Col span={4}>
                    <MailFilled />
                  </Col>
                  <Col span={20}>{user.email}</Col>
                </ProfileDescription>
              </Col>
            </Row>
            <Row gutter={[8, 8]}>
              <Col offset={10} span={14}>
                <Row gutter={[8, 8]}>
                  <Col span={8}>
                    <IconButton
                      type="primary"
                      shape="circle"
                      icon={<EyeOutlined />}
                      onClick={() => {
                        history.push('/users/' + user.id);
                      }}
                    />
                  </Col>
                  <Col span={8}>
                    <IconButton
                      shape="circle"
                      icon={<EditOutlined />}
                      onClick={() => {
                        history.push({
                          pathname: '/users/' + user.id,
                          state: { edit: true },
                        });
                      }}
                    />
                  </Col>
                  <Col span={8}>
                    <IconButton
                      danger
                      shape="circle"
                      icon={<DeleteOutlined />}
                      onClick={() => onDelete(user.id, user)}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </ListItem>
        )}
      />
      {isMore &&
        (moreLoading ? (
          <LoadMore>
            <Spin indicator={<LoadingOutlined />} size="large" />
          </LoadMore>
        ) : (
          <LoadMore></LoadMore>
        ))}
    </CardLayout>
  );
});

const ListItem = styled(List.Item)``;

const ProfileDescription = styled(Row)`
  color: gray;
`;

const LoadMore = styled.div`
  height: 100px;
  width: 100%;
  text-align: center;

  div {
    font-size: xxx-large;
  }
`;
