import { MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Col, Row, Spin } from 'antd';
import { Avatar } from 'app/components/Avatar/Loadable';
import React, { memo, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { api } from 'utils/api';

export interface InitialState {
  [key: string]: any;
}

export const MentionContent = memo((props: any) => {
  const { id } = props;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<InitialState>();
  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const response = await api.hr.employee.get(id);
        setData(response);
      } catch (error) {
        setData(undefined);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <>
      {loading ? (
        <Spin size="large" />
      ) : data ? (
        <Row gutter={[20, 12]} align="middle">
          <Col span={6} style={{ textAlign: 'center' }}>
            <Avatar
              size={60}
              src={data.avatar}
              alt={data.first_name + ' ' + data.last_name}
              name={data.first_name + ' ' + data.last_name}
            />
          </Col>
          <Col span={18}>
            <h2>
              <LinkTo
                href={`/employees/${data.id}`}
                target="_blank"
                rel="noreferrer"
              >
                {data.first_name + ' ' + data.last_name}
              </LinkTo>
            </h2>
            <ProfileDescription gutter={[4, 12]}>
              <Col span={2}>
                <MailOutlined />
              </Col>
              <Col span={22}>{data.email}</Col>
              <Col span={2}>
                <PhoneOutlined />
              </Col>
              <Col span={22}>{data.phone}</Col>
            </ProfileDescription>
          </Col>
        </Row>
      ) : (
        <div>
          <b>This employee's information could not be found</b>
        </div>
      )}
    </>
  );
});

const ProfileDescription = styled(Row)`
  color: gray;
  div {
    display: flex;
    align-items: center;
  }
`;

const LinkTo = styled.a`
  color: black;
`;
