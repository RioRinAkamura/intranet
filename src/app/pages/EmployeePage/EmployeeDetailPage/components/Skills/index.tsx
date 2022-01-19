import React, { memo, useState, useEffect, Key } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { Popover, Rate, Table, TablePaginationConfig, Tooltip } from 'antd';

import {
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { UsersMessages } from 'app/pages/EmployeePage/EmployeeListPage/messages';
import { useHistory, useParams } from 'react-router-dom';
import { useHandleDataTable } from 'app/pages/EmployeePage/EmployeeListPage/useHandleDataTable';
import { useEmployeeSkillSlice } from './slice';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectEmployeeSkill,
  selectEmployeeSkillIsFilter,
  selectEmployeeSkillParams,
} from './slice/selectors';
import {
  ColumnType,
  FilterValue,
  SorterResult,
} from 'antd/lib/table/interface';
import Button, { IconButton } from 'app/components/Button';
import { PrivatePath } from 'utils/url.const';
import { StyledLink, Wrapper } from 'styles/StyledCommon';
import { DeleteConfirmModal } from 'app/components/DeleteConfirmModal';
import { RootState } from 'types';
import { ToastMessageType, useNotify } from 'app/components/ToastNotification';
import { DeleteType } from 'utils/types';
import {
  Category,
  CreateEmployeeSkillQueryParam,
  EmployeeSkill,
} from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';
import { ActionIcon } from 'app/components/ActionIcon';
import { useSkillDetails } from 'app/pages/SkillManagePage/useSkillDetails';
import { useGetSkills } from 'app/components/Skills/useGetSkill';
import { api } from 'utils/api';

import AddSkillModal from 'app/components/AddSkillModal';
interface SkillProps {
  employeeId: string;
}

export const Skills = memo(({ employeeId }: SkillProps) => {
  const { categories, fetchAllCategory } = useSkillDetails();
  const { id } = useParams<Record<string, string>>();
  const { data: skills } = useGetSkills(true);
  const { t } = useTranslation();
  const history = useHistory();
  const { notify } = useNotify();
  // Delete Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isOpenSkillModal, setOpenSkillModal] = useState(false);
  const [deleteSkill, setDeleteSkill] = useState<EmployeeSkill>();
  const [textCopy, setTextCopy] = useState(false);
  const { actions } = useEmployeeSkillSlice();
  const dispatch = useDispatch();

  const params = useSelector(selectEmployeeSkillParams);
  const isFilter = useSelector(selectEmployeeSkillIsFilter);
  const getEmployeeSkillState = useSelector(selectEmployeeSkill);
  // Delete Modal Selector
  const deleteModalState = useSelector(
    (state: RootState) => state.employeeSkill,
  );
  const deleteSuccess = deleteModalState?.deleteSuccess;
  const deleteFailed = deleteModalState?.deleteFailed;
  const { setSelectedRows, setOrdering } = useHandleDataTable(
    getEmployeeSkillState,
    actions,
  );

  // map skill
  // React.useEffect(() => {
  //   if (skills && getEmployeeSkillState.skills) {
  //     const mapEmployeeSkillIdArr = [...getEmployeeSkillState?.skills].map(
  //       (skill: EmployeeSkill) => skill.skill.id,
  //     );
  //     const filteredSkillCategory: Category[] = [];
  //     const filteredSkill = [...skills.results].filter((skill: Skill) => {
  //       if (!mapEmployeeSkillIdArr.includes(skill.id)) {
  //         const category = categories.find(
  //           category => category.id === skill.category,
  //         );
  //         if (category) filteredSkillCategory.push(category);
  //         return true;
  //       }

  //       return false;
  //     });
  //     setSkillOptions(filteredSkill);
  //     setCloneFilteredSkill(filteredSkill);
  //   }
  // }, [skills, getEmployeeSkillState.skills, categories]);

  React.useEffect(() => {
    fetchAllCategory();
  }, [fetchAllCategory]);

  React.useEffect(() => {
    if (!isFilter) {
      dispatch(actions.fetchEmployeeSkill({ id: employeeId, params: params }));
    }
  }, [actions, dispatch, employeeId, isFilter, params]);

  const showDeleteModal = () => {
    setIsModalVisible(true);
  };

  const handleConfirmDelete = () => {
    setIsModalVisible(false);
    if (deleteSkill) {
      const params = {
        employeeId,
        skillId: deleteSkill.id,
      };
      dispatch(actions.deleteSkill(params));
    }
  };

  const handleCancelDeleteModal = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (deleteSuccess) {
      notify({
        type: ToastMessageType.Info,
        message: 'Delete Success',
        duration: 2,
      });
    } else if (deleteFailed) {
      notify({
        type: ToastMessageType.Error,
        message: 'Delete Failed',
        duration: 2,
      });
    }
  }, [deleteFailed, deleteModalState, deleteSuccess, notify]);

  const descriptionDelete = (
    <p>
      You're about to permanently delete{' '}
      <Tooltip
        title={<div>{textCopy ? 'Copied!' : 'Click to copy!'}</div>}
        onVisibleChange={visible => visible === true && setTextCopy(false)}
      >
        your skill{' '}
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
        >{`${deleteSkill?.skill.name}`}</strong>
      </Tooltip>
      . This will also delete any references to your skill.
    </p>
  );
  const moreButton = (value: any, record) => {
    return (
      <>
        <Tooltip title={t(UsersMessages.listViewTooltip())}>
          <IconButton
            type="primary"
            shape="circle"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              history.push(`${PrivatePath.SKILLS}`);
            }}
          />
        </Tooltip>
        <Tooltip title={t(UsersMessages.listDeleteTooltip())}>
          <IconButton
            danger
            shape="circle"
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => {
              showDeleteModal();
              setDeleteSkill(record);
            }}
          />
        </Tooltip>
      </>
    );
  };

  const columns: ColumnType<EmployeeSkill>[] = [
    {
      title: 'Category',
      dataIndex: 'skill',
      render: (value, record) => {
        const category: Category | undefined = categories.find(
          (cat: Category) => cat.id === value.category,
        );
        return (
          <StyledLink to={`${PrivatePath.SKILLS_CATEGORIES}`}>
            {category ? category.name : ''}
          </StyledLink>
        );
      },
    },
    {
      title: 'Skill',
      dataIndex: 'skill',
      render: (value, record) => {
        return value ? value.name : '';
      },
    },
    {
      title: 'Level',
      dataIndex: 'level',
      render: (value, record: EmployeeSkill) => {
        const handleRateChange = async value => {
          const updatedSkill = {
            id: record.id,
            employee_id: id,
            level: value,
            skill_id: record.skill.id,
          };
          await api.hr.employee.skill.update(id, updatedSkill);
        };
        return <Rate defaultValue={value} onChange={handleRateChange} />;
      },
    },
    {
      title: <ActionIcon />,
      dataIndex: 'id',
      render: (value, record, index: number) => {
        return (
          <>
            <Popover
              content={() => moreButton(value, record)}
              placement="bottom"
            >
              <IconButton shape="circle" size="small" icon={<MoreOutlined />} />
            </Popover>
          </>
        );
      },
    },
  ];

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[],
  ) => {
    setOrdering(sorter);
  };

  const handleSelectedRows = (selectedRowKeys: Key[], selectedRows: any[]) => {
    setSelectedRows(selectedRowKeys, selectedRows);
  };

  const handleAddSkill = async selectedSkill => {
    // if (selectedSkill && selectedSkill.length <= 0) {
    //   setSkillErr('Please select skill');
    //   return;
    // }

    try {
      const arrPromise: any = await selectedSkill?.map(skillId => {
        const newSkill: CreateEmployeeSkillQueryParam = {
          skill_id: skillId as string,
          employee_id: employeeId,
        };

        return api.hr.employee.skill.create(employeeId, newSkill);
      });

      Promise.all(arrPromise).then(values => {
        setOpenSkillModal(false);
        dispatch(
          actions.fetchEmployeeSkill({ id: employeeId, params: params }),
        );
      });
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  return (
    <Wrapper>
      <Header>
        <StyledButton
          type="primary"
          icon={<PlusCircleOutlined />}
          onClick={() => setOpenSkillModal(true)}
          //   onClick
          size="middle"
        >
          Add skill
        </StyledButton>
      </Header>
      <AddSkillModal
        isOpenSkilLModal={isOpenSkillModal}
        onCancel={() => {
          setOpenSkillModal(false);
        }}
        skills={skills}
        employeeSkills={getEmployeeSkillState.skills}
        categories={categories}
        callback={handleAddSkill}
      />
      {/* <Modal
        width={500}
        title={'Add Skill'}
        visible={isOpenSkillModal}
        onCancel={() => {
          setOpenSkillModal(false);
          resetStateSkillModal();
        }}
        onOk={handleAddSkill}
        okText="Add Skill"
      >
        <Form form={form}>
          <WrapperSearch>
            <Input placeholder="Search" onChange={handleSearchSkill} />
            <WrapperCheckbox>
              <h5 style={{ marginBottom: '5px' }}>Select By Categories</h5>
              <Checkbox.Group
                value={checkedList}
                onChange={handleSelectChangeCategoryGroup}
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
              <Checkbox.Group
                onChange={handleSelectSkill}
                value={selectedSkill}
              >
                <Row gutter={[0, 4]}>
                  {cloneFilteredSkill.map(skill => (
                    <Col span={8}>
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
      </Modal> */}

      <Table
        rowSelection={{
          selectedRowKeys: getEmployeeSkillState.selectedRowKeys,
          onChange: handleSelectedRows,
        }}
        bordered
        columns={columns}
        rowKey="id"
        dataSource={getEmployeeSkillState.skills}
        loading={getEmployeeSkillState.loading}
        onChange={handleTableChange}
        scroll={{ x: 1100 }}
        pagination={false}
      />
      {/* Create a skill modal */}
      <DeleteConfirmModal
        type={DeleteType.NAME}
        visible={isModalVisible}
        handleOk={handleConfirmDelete}
        handleCancel={handleCancelDeleteModal}
        title={`Remove ${deleteSkill?.skill.name}`}
        description={descriptionDelete}
        answer={deleteSkill?.skill.name}
      />
    </Wrapper>
  );
});

const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-bottom: 20px;
`;

const StyledButton = styled(Button)`
  svg {
    vertical-align: baseline;
  }
`;
