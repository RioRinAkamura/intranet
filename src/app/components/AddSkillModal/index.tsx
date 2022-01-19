import {
  Skill,
  Category,
  EmployeeSkill,
} from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';
import { Modal, Form, Checkbox, Row, Input, Col, Typography } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { uniq } from 'lodash';

export interface AddSkillModalProps {
  isOpenSkilLModal: boolean;
  onCancel: () => void;
  skills: any;
  employeeSkills: any;
  categories: Category[];
  callback: (data: string[]) => Promise<void>;
}

export default function AddSkillModal(props: AddSkillModalProps) {
  const {
    isOpenSkilLModal,
    onCancel,
    skills,
    employeeSkills,
    categories,
    callback,
  } = props;
  const [skillOptions, setSkillOptions] = useState<Skill[]>([]);
  const [cloneFilteredSkill, setCloneFilteredSkill] = useState<Skill[]>([]);
  const [checkedList, setCheckedList] = React.useState<string[]>([]);
  const [skillErr, setSkillErr] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<
    CheckboxValueType[] | undefined
  >([]);

  React.useEffect(() => {
    if (skills && employeeSkills) {
      const mapEmployeeSkillIdArr = [...employeeSkills].map(
        (skill: EmployeeSkill) => skill.skill.id,
      );
      const filteredSkillCategory: Category[] = [];
      const filteredSkill = [...skills.results].filter((skill: Skill) => {
        if (!mapEmployeeSkillIdArr.includes(skill.id)) {
          const category = categories.find(
            category => category.id === skill.category,
          );
          if (category) filteredSkillCategory.push(category);
          return true;
        }

        return false;
      });
      setSkillOptions(filteredSkill);
      setCloneFilteredSkill(filteredSkill);
    }
  }, [skills, employeeSkills, categories]);

  const handleSelectSkill = checkedValue => {
    setSelectedSkill(checkedValue);
  };

  const handleSearchSkill = e => {
    const newSkillOptions = [...skillOptions].filter(skill =>
      skill.name.toLowerCase().includes(e.target.value.toLowerCase()),
    );

    setCloneFilteredSkill(newSkillOptions);
  };

  const handleChangeCheckbox = e => {
    const skills = [...cloneFilteredSkill]
      .filter(skill => skill.category === e.target.value)
      .map(skill => skill.id);

    if (e.target.checked) {
      const newList = [...checkedList, e.target.value];
      setCheckedList(newList);
      // find checked category skill
      setSelectedSkill(uniq([...skills, ...(selectedSkill as string[])]));
    } else {
      const newList = [...checkedList].filter(cat => cat !== e.target.value);
      setCheckedList(newList);
      const newSelectedSkill = [...(selectedSkill as string[])].filter(
        skill => !skills.includes(skill),
      );
      setSelectedSkill(newSelectedSkill);
    }
  };

  const handleAddSkill = () => {
    if (selectedSkill && selectedSkill.length <= 0) {
      setSkillErr('Please select skill');
      return;
    }
    setSelectedSkill([]);
    setSkillErr('');
    setCheckedList([]);

    callback(selectedSkill as string[]);
  };

  const cancelModal = () => {
    setSelectedSkill([]);
    setSkillErr('');
    setCheckedList([]);
    onCancel();
  };

  return (
    <Modal
      width={500}
      title={'Add Skill'}
      visible={isOpenSkilLModal}
      onCancel={cancelModal}
      onOk={handleAddSkill}
      okText="Add Skill"
    >
      <Form>
        <WrapperSearch>
          <Input placeholder="Search" onChange={handleSearchSkill} />
          <WrapperCheckbox>
            <h5 style={{ marginBottom: '5px' }}>Select By Categories</h5>
            <Checkbox.Group
              value={checkedList}
              style={{ marginBottom: '10px' }}
            >
              <Row gutter={[0, 4]}>
                {categories.map(category => (
                  <Col span={8}>
                    <Checkbox
                      onChange={handleChangeCheckbox}
                      value={category.id}
                    >
                      {category.name}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
            <h5 style={{ marginBottom: '5px' }}>Select Skills</h5>
            <Checkbox.Group onChange={handleSelectSkill} value={selectedSkill}>
              <Row gutter={[0, 4]}>
                {cloneFilteredSkill.map(skill => (
                  <Col key={skill.id} span={8}>
                    <Checkbox value={skill.id}>{skill.name}</Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </WrapperCheckbox>
          <Typography.Text type="danger" style={{ marginTop: '10px' }}>
            {skillErr}
          </Typography.Text>
        </WrapperSearch>
      </Form>
    </Modal>
  );
}

const WrapperSearch = styled.div`
  padding: 8px;
  position: relative;
`;

const WrapperCheckbox = styled.div`
  .ant-checkbox-group,
  .ant-select {
    display: grid;
    max-height: 300px;
    overflow-y: auto;
  }
  margin-top: 2px;
  border-radius: 5px;
  padding: 10px 8px;
  background: white;
  border: 1px solid #d5d4d5;
  z-index: 1000;
  margin-bottom: 7px;
`;
