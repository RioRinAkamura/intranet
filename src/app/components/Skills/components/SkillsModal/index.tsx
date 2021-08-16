import React, { memo, useState, useEffect } from 'react';
import { Modal, Input, Button, Tag, Popover, Tooltip } from 'antd';
import styled from 'styled-components/macro';
import {
  EllipsisOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
// import fakeAPI from 'utils/fakeAPI';
import { api } from 'utils/api';
import { useGetSkills } from '../../useGetSkill';
import { models } from '@hdwebsoft/boilerplate-api-sdk';

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
const { confirm } = Modal;
export const SkillsModal = memo((props: skillModalProps) => {
  const { data } = useGetSkills();
  const [pickedSkill, setPickedSkill] = useState<any>([]);
  const [customSkill, setCustomSkill] = useState<string>('');

  const { isVisibility, onCancel, onOk, currentSkills } = props;
  const [suggestSkills, setSuggestSkill] = useState<any>([]);

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

  const handleRemoveSkill = (skill: Skill) => {
    //  remove skill from picked list
    const newPickedList = [...pickedSkill].filter(item => item.id !== skill.id);
    setPickedSkill(newPickedList);

    //add skill to picked list
    setSuggestSkill([...suggestSkills, skill]);
  };

  const handleAddCustomSkill = async e => {
    // trigger event when enter
    if (e.keyCode === 13) {
      //add custom skill to default arr
      try {
        const newSkill = {
          name: customSkill,
          type: models.hr.SkillType.ENGINEERING,
        };
        // const response = await fakeAPI.post('/hr/skills/', newSkill);
        const response = await api.hr.skill.create(newSkill);
        setPickedSkill([...pickedSkill, response]);
        setCustomSkill('');
      } catch (e) {
        console.log(e);
      }
    }
  };

  //handle cancel
  const handleCancelSkillModal = () => {
    onCancel();
  };

  //handle ok modal
  const handleOkModal = () => {
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
            handleDeleteSkill(id);
          }}
        />
      </Tooltip>
    );
  };

  // handle delete skill
  const handleDeleteSkill = (id: string) => {
    confirm({
      title: 'Do you Want to delete this item?',
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        await api.hr.skill.delete(id);
        const newSuggesteSkills = [...suggestSkills].filter(
          (item: Skill) => item.id !== id,
        );
        setSuggestSkill(newSuggesteSkills);
      },
    });
  };

  return (
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
          <CustomTag
            key={skill.id}
            closable
            onClose={() => handleRemoveSkill(skill)}
          >
            {skill.name}{' '}
          </CustomTag>
        ))}
      </FlexWrapper>

      <ModalHelpText>Suggested skills:</ModalHelpText>

      <FlexWrapper>
        {suggestSkills &&
          suggestSkills.map((skill, index: number) => {
            return (
              <ButtonIcon
                style={{ margin: '5px 5px 5px 0' }}
                onClick={e => {
                  handleAddSkill(skill);
                }}
                shape={'round'}
                key={skill.id}
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
const CustomTag = styled(Tag)`
  display: flex;
  align-items: center;
`;
