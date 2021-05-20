import {
  MailOutlined,
  MinusCircleOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import { Button, Col, Form, FormInstance, Popover, Row, Tag } from 'antd';
import { Avatar } from 'app/components/Avatar/Loadable';
import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { antColours } from 'utils/types';
import { AddMemberModal } from '../AddMemberModal/Loadable';
import { useHandleMember } from '../AddMemberModal/useHandleMember';

interface Props {
  isView?: boolean;
  isEdit?: boolean;
  form: FormInstance;
}

export const TeamMembers = (props: Props) => {
  const { isView, isEdit, form } = props;
  const [openModal, setOpenModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>();
  const { deleteMember } = useHandleMember();

  const MemberCover = ({ member }) => {
    return (
      <Row gutter={[20, 12]} align="middle">
        <Col span={6} style={{ textAlign: 'center' }}>
          <Avatar
            size={60}
            src={member.avatar}
            alt={member.first_name + ' ' + member.last_name}
            name={member.first_name + ' ' + member.last_name}
          />
        </Col>
        <Col span={18}>
          <h2>
            <LinkTo
              href={`/employees/${member.id}`}
              target="_blank"
              rel="noreferrer"
            >
              {member.first_name + ' ' + member.last_name}
            </LinkTo>
          </h2>
          <ProfileDescription gutter={[4, 12]}>
            <Col span={2}>
              <MailOutlined />
            </Col>
            <Col span={22}>{member.email}</Col>
            <Col span={2}>
              <PhoneOutlined />
            </Col>
            <Col span={22}>{member.phone}</Col>
          </ProfileDescription>
        </Col>
      </Row>
    );
  };

  const memberInfo = (info, remove) => (
    <MemberInfoCover>
      <Popover
        content={<MemberCover member={info.employee} />}
        placement="topLeft"
      >
        <span
          onClick={() => {
            if (isEdit) {
              setOpenModal(true);
              setSelectedMember(info);
            } else {
              window.open(
                `/employees/${info.employee.id}`,
                '_blank',
                'noopener,noreferrer',
              );
            }
          }}
        >
          <Avatar
            src={info.employee.avatar}
            name={info.employee.first_name + ' ' + info.employee.last_name}
            size={30}
          />
          {` ${info.employee.first_name} ${info.employee.last_name} `}
          <Tag color={antColours[Math.floor(info.allocation)]}>
            {info.allocation}
          </Tag>
        </span>
      </Popover>
      {isEdit && (
        <MinusCircleOutlined
          onClick={async () => {
            const id = form.getFieldValue('id');
            const response = await deleteMember(id, info.employee.id);
            if (response) {
              remove(info.index);
            }
          }}
          style={{ color: 'red' }}
        />
      )}
    </MemberInfoCover>
  );

  return (
    <>
      {(isEdit || isView) && (
        <>
          <Row gutter={[12, 12]} align="middle" style={{ marginBottom: 12 }}>
            <Col>
              <h3>Team Members</h3>
            </Col>
            <Col>
              {!isView && (
                <>
                  <Button
                    type="primary"
                    block
                    size="large"
                    onClick={() => setOpenModal(true)}
                  >
                    Add Member
                  </Button>
                </>
              )}
              <AddMemberModal
                open={openModal}
                setOpen={setOpenModal}
                selectedMember={selectedMember}
                setSelectedMember={setSelectedMember}
                form={form}
              />
            </Col>
          </Row>
          <Form.List name="members">
            {(fields, { add, remove }) => {
              console.log(form.getFieldValue('members'));
              const members = form
                .getFieldValue('members')
                ?.map((member, index: number) => {
                  member.index = index;
                  return member;
                });
              const pms = members?.filter(
                member => member.project_role === 'PM',
              );
              const tls = members?.filter(
                member => member.project_role === 'TL',
              );
              const qcs = members?.filter(
                member => member.project_role === 'QC',
              );
              const devs = members?.filter(
                member => member.project_role === 'DEV',
              );
              const others = members?.filter(
                member => member.project_role === 'OTHER',
              );
              return (
                <Row gutter={[32, 16]}>
                  {(pms || tls) && (
                    <Col span={24}>
                      <Row gutter={[12, 12]}>
                        {pms && pms.length > 0 && (
                          <Col span={12}>
                            <h3>Project Manager</h3>
                            {pms.map(pm => memberInfo(pm, remove))}
                          </Col>
                        )}
                        {tls && tls.length > 0 && (
                          <Col span={12}>
                            <h3>Leader</h3>
                            {tls.map(tl => memberInfo(tl, remove))}
                          </Col>
                        )}
                      </Row>
                    </Col>
                  )}
                  {(qcs || devs || others) && (
                    <Col span={24}>
                      <Row gutter={[12, 12]}>
                        {qcs && qcs.length > 0 && (
                          <Col span={8}>
                            <h3>Quality Controller</h3>
                            {qcs.map(qc => memberInfo(qc, remove))}
                          </Col>
                        )}
                        {devs && devs.length > 0 && (
                          <Col span={8}>
                            <h3>Developer</h3>
                            {devs.map(dev => memberInfo(dev, remove))}
                          </Col>
                        )}
                        {others && others.length > 0 && (
                          <Col span={8}>
                            <h3>Other</h3>
                            {others.map(other => memberInfo(other, remove))}
                          </Col>
                        )}
                      </Row>
                    </Col>
                  )}
                </Row>
              );
            }}
          </Form.List>
        </>
      )}
    </>
  );
};

const MemberInfoCover = styled.div`
  span {
    :hover {
      cursor: pointer;
    }
  }
  margin-bottom: 8px;
`;

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
