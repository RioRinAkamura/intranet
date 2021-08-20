import {
  MailOutlined,
  MinusCircleOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import { Col, Form, FormInstance, Popover, Row, Tag, Tooltip } from 'antd';
import { Avatar } from 'app/components/Avatar/Loadable';
import { DeleteConfirmModal } from 'app/components/DeleteConfirmModal';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { antColours } from 'utils/types';
import { ProjectDetailMessages } from '../../messages';
import { MemberModal } from '../MemberModal/Loadable';
import { useHandleMember } from '../MemberModal/useHandleMember';
import Button from 'app/components/Button';
import { PrivatePath } from 'utils/url.const';

interface Props {
  isView?: boolean;
  isEdit?: boolean;
  form: FormInstance;
}

export const TeamMembers = (props: Props) => {
  const { isView, isEdit, form } = props;
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    remove: (index: number) => {},
  });
  const [selectedMemberDelete, setSelectedMemberDelete] = useState<any>();
  const [textCopy, setTextCopy] = useState(false);
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
              href={`${PrivatePath.EMPLOYEES}/${member.id}`}
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
    <MemberInfoCover key={info.employee.id}>
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
                `${PrivatePath.EMPLOYEES}/${info.employee.id}`,
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
      {!isView && (
        <MinusCircleOutlined
          onClick={async () => {
            if (form.getFieldValue('id')) {
              setDeleteModal({ open: true, remove: remove });
              setSelectedMemberDelete(info);
            } else {
              remove(info.index);
            }
          }}
          style={{ color: 'red' }}
        />
      )}
    </MemberInfoCover>
  );

  const handleConfirmDelete = async () => {
    setDeleteModal({ open: false, remove: () => {} });
    const id = form.getFieldValue('id');
    const response = await deleteMember(id, selectedMemberDelete.employee.id);
    if (response) {
      deleteModal.remove(selectedMemberDelete.index);
    }
  };

  const handleCancelDeleteModal = () => {
    setDeleteModal({ open: false, remove: () => {} });
  };

  const descriptionDelete = (
    <p>
      You're about to permanently delete this member{' '}
      <Tooltip
        title={<div>{textCopy ? 'Copied!' : 'Click to copy!'}</div>}
        onVisibleChange={visible => visible === true && setTextCopy(false)}
      >
        <strong
          id="deletedEmail"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            let copyText = document.getElementById('deletedEmail')?.innerText;
            if (copyText) {
              navigator.clipboard.writeText(copyText);
              setTextCopy(true);
            }
          }}
        >{`${selectedMemberDelete?.employee.email}`}</strong>
      </Tooltip>
      . This will also delete any references to your project.
    </p>
  );

  return (
    <>
      <>
        <Row gutter={[12, 12]} align="middle" style={{ marginBottom: 12 }}>
          <Col>{t(ProjectDetailMessages.memberTitle())}</Col>
          <Col>
            {!isView && (
              <>
                <Button type="primary" block onClick={() => setOpenModal(true)}>
                  {t(ProjectDetailMessages.addMember())}
                </Button>
              </>
            )}
            <MemberModal
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
            const members = form
              .getFieldValue('members')
              ?.map((member, index: number) => {
                member.index = index;
                return member;
              });
            const pms = members?.filter(member => member.project_role === 'PM');
            const tls = members?.filter(member => member.project_role === 'TL');
            const qcs = members?.filter(member => member.project_role === 'QC');
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
                          <h3>{t(ProjectDetailMessages.memberPM())}</h3>
                          {pms.map(pm => memberInfo(pm, remove))}
                        </Col>
                      )}
                      {tls && tls.length > 0 && (
                        <Col span={12}>
                          <h3>{t(ProjectDetailMessages.memberTL())}</h3>
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
                          <h3>{t(ProjectDetailMessages.memberQC())}</h3>
                          {qcs.map(qc => memberInfo(qc, remove))}
                        </Col>
                      )}
                      {devs && devs.length > 0 && (
                        <Col span={8}>
                          <h3>{t(ProjectDetailMessages.memberDEV())}</h3>
                          {devs.map(dev => memberInfo(dev, remove))}
                        </Col>
                      )}
                      {others && others.length > 0 && (
                        <Col span={8}>
                          <h3>{t(ProjectDetailMessages.memberOTHER())}</h3>
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
      <DeleteConfirmModal
        visible={deleteModal.open}
        handleOk={() => handleConfirmDelete()}
        handleCancel={handleCancelDeleteModal}
        title={`Remove ${selectedMemberDelete?.employee.first_name} ${selectedMemberDelete?.employee.last_name}`}
        description={descriptionDelete}
        answer={`${selectedMemberDelete?.employee.email}`}
      />
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
