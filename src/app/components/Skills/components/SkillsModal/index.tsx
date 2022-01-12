import { DeleteOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Popover, Tag, Tooltip } from 'antd';
import { DeleteModal } from 'app/components/DeleteModal';
import React, { memo, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { api } from 'utils/api';
import { useGetSkills } from '../../useGetSkill';

interface skillModalProps {
  isVisibility: boolean;
  onCancel: () => void;
  onOk: (items: Skill[]) => Promise<void>;
  currentSkills: any[];
}

interface Skill {
  id: string;
  name: string;
  type: string;
  employeeSkillId: string;
}
export const SkillsModal = memo((props: skillModalProps) => {
  const { data } = useGetSkills(props.isVisibility);
  const [pickedSkill, setPickedSkill] = useState<any>([]);
  const [customSkill, setCustomSkill] = useState<string>('');

  const { isVisibility, onCancel, onOk, currentSkills } = props;
  const [suggestSkills, setSuggestSkill] = useState<any>([]);
  const [skillId, setSkillId] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    setSuggestSkill(data ? data.results : []);
    if (!currentSkills) {
      return;
    }
    const arrPickedId = [...currentSkills].map(skill => skill.skill.id);
    const newSuggestSkills = [...(data ? data.results : [])].filter(item => {
      return !arrPickedId.includes(item.id);
    });
    setSuggestSkill(newSuggestSkills);
  }, [data, currentSkills]);

  useEffect(() => {
    // map current skill to default skill
    const newPickedSkill = currentSkills
      ? [...currentSkills].map(item => {
          const objSkill = {
            ...item.skill,
            level: item.level,
            employeeSkillId: item.id,
          };
          return objSkill;
        })
      : [];
    setPickedSkill(newPickedSkill);
  }, [currentSkills]);

  const handleAddSkill = (skill: Skill) => {
    // remove skill from suggest skills
    const newSuggestSkill = [...suggestSkills].filter(
      item => item.id !== skill.id,
    );
    setSuggestSkill(newSuggestSkill);

    //  add skill to picked list
    setPickedSkill([...pickedSkill, skill]);
  };

  const handleAddCustomSkill = async e => {
    // trigger event when enter
    if (e.keyCode === 13 && customSkill.length > 0) {
      const newSkill = {
        name: customSkill,
      };
      try {
        const createdSkill = await api.hr.skill.create(newSkill);
        const response = await api.hr.skill.get(createdSkill.id);
        setPickedSkill([...pickedSkill, response]);
        setCustomSkill('');
      } catch (error) {
        console.log(error);
      }
    }
  };

  //handle cancel
  const handleCancelSkillModal = () => {
    onCancel();
  };

  //handle ok modal
  const handleOkModal = async () => {
    onOk(pickedSkill);
  };

  // more button
  const moreButtons = (id: string) => {
    return (
      <Tooltip title={'Delete'}>
        <ButtonIcon
          danger
          shape="circle"
          size="small"
          icon={<DeleteOutlined />}
          onClick={e => {
            e.stopPropagation();
            setVisible(true);
            setSkillId(id);
          }}
        />
      </Tooltip>
    );
  };

  // handle delete skill
  const handleDeleteSkill = async (id: string) => {
    await api.hr.skill.delete(id);
    const newSuggesteSkills = [...suggestSkills].filter(
      (item: Skill) => item.id !== id,
    );
    setSuggestSkill(newSuggesteSkills);
    setVisible(false);
  };

  return (
    <>
      <Modal
        width={600}
        visible={isVisibility}
        title={'Skill modal'}
        onCancel={handleCancelSkillModal}
        footer={[
          <Button
            key="back"
            shape="round"
            size="large"
            onClick={handleCancelSkillModal}
          >
            Cancel
          </Button>,
          <Button
            type="primary"
            shape="round"
            size="large"
            onClick={handleOkModal}
          >
            Submit
          </Button>,
        ]}
      >
        <Input
          placeholder={'Skill (ex: python)'}
          value={customSkill}
          onChange={e => setCustomSkill(e.target.value)}
          onKeyDown={handleAddCustomSkill}
        />

        <FlexWrapper className="mt-10">
          {pickedSkill.map((skill: Skill, index: number) => (
            <Tag key={index} closable color="#2db7f5">
              {skill.name}{' '}
            </Tag>
          ))}
        </FlexWrapper>

        <ModalHelpText>Suggested skills:</ModalHelpText>

        <FlexWrapper>
          {suggestSkills &&
            suggestSkills.map(skill => {
              return (
                <ButtonIcon
                  key={skill.id}
                  style={{ margin: '5px 5px 5px 0' }}
                  onClick={e => {
                    handleAddSkill(skill);
                  }}
                  shape={'round'}
                >
                  {skill.name}
                  <Popover
                    content={() => moreButtons(skill.id)}
                    placement="bottom"
                  >
                    <ButtonIcon
                      style={{ margin: '0 0 0 5px' }}
                      shape="circle"
                      icon={<EllipsisOutlined />}
                      size="small"
                    />
                  </Popover>
                </ButtonIcon>
              );
            })}
        </FlexWrapper>
      </Modal>

      <DeleteModal
        open={visible}
        handleCancel={() => setVisible(false)}
        handleDelete={() => handleDeleteSkill(skillId)}
        content="Do you want to delete this item?"
      />
    </>
  );
});

const ModalHelpText = styled.h2`
  margin-top: 24px;
  margin-bottom: 12px;
  font-size: 16px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.9);
`;

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  &.mt-10 {
    margin-top: 10px;
  }
`;

const ButtonIcon = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  /* margin: 0 5px 5px 0; */
`;
