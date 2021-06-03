import React, { memo, useState, useEffect } from 'react';
import { Modal, Input, Button, Tag } from 'antd';
import styled from 'styled-components/macro';
import { PlusOutlined  } from '@ant-design/icons';
import fakeAPI from 'utils/fakeAPI';
import { useGetSkills } from '../../useGetSkill'

interface skillModalProps {
  isVisibility: boolean,
  onCancel: () => void,
  onOk: (items) => void,
  pickedProp: any[],
  currentSkills: any[]
}  



export const SkillsModal = memo((props: skillModalProps) => {
  const { data } = useGetSkills();
  const [pickedSkill, setPickedSkill] = useState<any>([]);
  const [customSkill, setCustomSkill] = useState<string>('');

  const { isVisibility, onCancel, onOk, pickedProp, currentSkills } = props;
  const [suggestSkills, setSuggestSkill] = useState<any>([]);
  // const [loading, setLoading] = useState(false)
  // useEffect(() => {
  //   (async () => {
  //     setLoading(true)
  //     try {
  //       const response = await fakeAPI.get('/hr/skills/')
  //       setSuggestSkill(response);
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       setLoading(false)
  //     }
  //   })();
  // }, [])

  useEffect(() => {
    setSuggestSkill(data ? data.results : [])
    if (!currentSkills) { return }
    const arrPickedId = [...currentSkills].map((skill) => skill.skill.id)
    const newSuggestSkills = [...data ? data.results : []].filter((item) => {
      return !arrPickedId.includes(item.id)
    }) 
    setSuggestSkill(newSuggestSkills)
  }, [data, currentSkills])


  useEffect(() => {
    // map current skill to default skill
    const newPickedSkill = currentSkills ? [...currentSkills].map((item) => {
      const objSkill = {
        ...item.skill,
        level: item.level,
        employeeSkillId: item.id
      }
      return objSkill
    }) : []
    setPickedSkill(newPickedSkill)
  }, [currentSkills])

  const handleAddSkill = (skill) => {
  // remove skill from suggest skills
    const newSuggestSkill = [...suggestSkills].filter((item) => item.id !== skill.id );
    setSuggestSkill(newSuggestSkill);

  //  add skill to picked list
    setPickedSkill([...pickedSkill, skill]);
  }

  const handleRemoveSkill = (skill) => {
  //  remove skill from picked list
    const newPickedList = [...pickedSkill].filter((item) => item.id !== skill.id);
    setPickedSkill(newPickedList);

  //add skill to picked list
    setSuggestSkill([...suggestSkills, skill]);
  }



  const handleAddCustomSkill = async (e) => {
    // trigger event when enter
    if (e.keyCode === 13) {
      //add custom skill to default arr
      try {
        const newSkill = {
          name: customSkill,
          type: '',
        };
        const response = await fakeAPI.post('/hr/skills/', newSkill);
        setPickedSkill([...pickedSkill, response]);
        setCustomSkill('');
      } catch(e) {
        console.log(e);
      }
    }
  }

  //handle cancel
  const handleCancelSkillModal = () => {
    onCancel();
  }

  //handle ok modal
  const handleOkModal = () => {
    onOk(pickedSkill);
  }

  return (
    <Modal
      width={600}
      visible={isVisibility}
      title={'Skill modal'}
      onCancel={handleCancelSkillModal}
      onOk={handleOkModal}
    >
      <Input
        placeholder={"Skill (ex: python)"}
        value={customSkill}
        onChange={e => setCustomSkill(e.target.value)}
        onKeyDown={handleAddCustomSkill}
      />

      <FlexWrapper className="mt-10">
        {
          pickedSkill.map((skill, index: number) =>
            (
              <CustomTag
                key={skill.id}
                closable
                onClose={ () => handleRemoveSkill(skill)}
              >
                { skill.name }
              </CustomTag>
            )
          )
        }
      </FlexWrapper>

      <ModalHelpText>
        Suggested skills:
      </ModalHelpText>

      <FlexWrapper>
        {
          suggestSkills && suggestSkills.map((skill, index: number) => {
           return (
             <ButtonIcon
               onClick={() => handleAddSkill(skill)}
               shape={'round'}
               key={skill.id}
               icon={<PlusOutlined />}
             >
              { skill.name }
            </ButtonIcon>
           )
          })
        }
      </FlexWrapper>
    </Modal>
  )
});

const ModalHelpText = styled.h2`
  margin-top: 24px;
  margin-bottom: 12px;
  font-size:16px;
  line-height: 1.5;
  color: rgba(0,0,0,0.9)
`;

const FlexWrapper = styled.div`
  display:flex;
  align-items:center;
  flex-wrap: wrap;

  &.mt-10 {
    margin-top: 10px;
  }
`;

const ButtonIcon = styled(Button)`
  display: flex;
  align-items: center;
  margin: 0 5px 5px 0;
`
const CustomTag = styled(Tag)`
  display: flex;
  align-items: center;
`
