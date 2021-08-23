import React, { memo, useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { Button, Rate } from 'antd';
import { PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { UserDetailMessages } from 'app/pages/EmployeePage/EmployeeDetailPage/messages';
import { SkillsModal } from './components/SkillsModal';
import { DeleteOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { api } from 'utils/api';

interface Skill {
  id: string;
  name: string;
  type: string;
  employeeSkillId: string;
}

interface SkillsProps {
  employeeId: string;
}

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const Skills: React.FC<SkillsProps> = memo(({ employeeId }) => {
  const [visibility, setVisibility] = useState(false);
  const [data, setData] = useState<any>();
  const [skills, setSkills] = useState<any>([]);
  const { t } = useTranslation();

  const getSkills = React.useCallback(async () => {
    try {
      const response = await api.hr.employee.getSkills(employeeId);
      setData(response);
    } catch (e) {
      console.log(e);
    }
  }, [employeeId]);

  useEffect(() => {
    getSkills();
  }, [getSkills]);

  const handleCancel = () => {
    setVisibility(false);
  };

  const handleToggleModal = () => {
    setVisibility(true);
  };

  const handleOk = async (items: Skill[]) => {
    setVisibility(false);
    if (data.length === 0) {
      try {
        const arrPromise = await items.map(item => {
          // add new item
          const mapItem = {
            skill_id: item.id,
            employee_id: employeeId,
          };
          return api.hr.employee.postSkill(employeeId, mapItem);
        });

        Promise.all(arrPromise).then(values => {
          setData(values);
        });
      } catch (e) {
        console.log(e);
      }
    } else {
      // map delete items
      const arrayId = [...data].map(item => item.id);
      const currentItems = [...items]
        .filter(item => item.employeeSkillId)
        .map(childItem => childItem.employeeSkillId);
      const deleteItems = [...arrayId].filter(i => !currentItems.includes(i));
      const newItems = [...items].filter(item => {
        return !item.employeeSkillId;
      });

      try {
        const deleteArr = await deleteItems.map(i =>
          api.hr.employee.deleteSkill(employeeId, i),
        );
        const createArr = await newItems.map(i => {
          const mapItem = {
            skill_id: i.id,
            employee_id: employeeId,
          };
          return api.hr.employee.postSkill(employeeId, mapItem);
        });

        const arrPromise = [...deleteArr, ...createArr];
        Promise.all(arrPromise).then(async () => {
          try {
            const response = await api.hr.employee.getSkills(employeeId);
            setData(response);
          } catch (e) {
            console.log(e);
          }
        });
      } catch (e) {
        console.log(e);
      }
    }
    // setSkills(items);
  };

  const handleDeleteSkill = async skill => {
    try {
      const newSkillList = [...data].filter(item => item.id !== skill.id);
      setData(newSkillList);

      await api.hr.employee.deleteSkill(employeeId, skill.id);
    } catch (e) {
      console.log(e, 'error');
    }
  };

  const handleSkillRateChange = async (value, skill) => {
    try {
      const skillIndex = data.findIndex(item => item.id === skill.id);
      if (skillIndex !== -1) {
        const newSkillList = [...data];
        const newSkillItem = {
          ...newSkillList[skillIndex],
          level: value,
        };

        newSkillList[skillIndex] = newSkillItem;

        setData(newSkillList);

        await api.hr.employee.putSkill(employeeId, {
          ...skill,
          level: value,
          skill_id: skill.skill.id,
          employee_id: employeeId,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  //handle drag end
  const handleDragEnd = result => {
    if (!result.destination) {
      return;
    }

    const newList = reorder(
      skills,
      result.source.index,
      result.destination.index,
    );

    setSkills(newList);
  };

  return (
    <>
      <FlexWrapper>
        <span>{t(UserDetailMessages.formSkillLabel())}</span>
        <IconBtn onClick={handleToggleModal} icon={<PlusOutlined />} />
      </FlexWrapper>
      <SkillsModal
        isVisibility={visibility}
        onCancel={handleCancel}
        onOk={handleOk}
        currentSkills={data}
      />

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => {
            return (
              <SkillList ref={provided.innerRef}>
                {data &&
                  data.map((skill, index) => {
                    return (
                      <Draggable
                        key={skill.id}
                        draggableId={`${skill.id}`}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <SkillsWrapper
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            <FlexWrapper className="justify-content-between">
                              <FlexWrapper>
                                <span className="skill-title">
                                  {skill.skill.name}
                                </span>

                                <Rate
                                  onChange={value =>
                                    handleSkillRateChange(value, skill)
                                  }
                                  defaultValue={skill.level}
                                />
                              </FlexWrapper>
                              <FlexWrapper>
                                <DeleteOutlined
                                  onClick={() => handleDeleteSkill(skill)}
                                />
                                <DragHandler {...provided.dragHandleProps} />
                              </FlexWrapper>
                            </FlexWrapper>
                          </SkillsWrapper>
                        )}
                      </Draggable>
                    );
                  })}
                {provided.placeholder}
              </SkillList>
            );
          }}
        </Droppable>
      </DragDropContext>
    </>
  );
});

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  &.justify-content-between {
    justify-content: space-between;
  }
`;

const SkillsWrapper = styled.div`
  margin-top: 15px;

  .skill-title {
    width: 120px;
    margin-right: 10px;
  }
`;

const IconBtn = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SkillList = styled.div`
  padding: 5px 0;
`;

const DragHandler = styled(UnorderedListOutlined)`
  margin-left: 5px;
`;
