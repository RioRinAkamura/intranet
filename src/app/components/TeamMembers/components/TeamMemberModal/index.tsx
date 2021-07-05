import React, { memo, useState, useEffect } from 'react';
import {
  Modal,
  Tabs,
  Table,
  Popover,
  Button,
  Tooltip,
  Tag,
  Form,
  Select,
  Spin,
} from 'antd';
import { Avatar } from 'app/components/Avatar/Loadable';
import { ColumnsType } from 'antd/lib/table/interface';
import { antColours } from 'utils/types';
import styled from 'styled-components/macro';
import { DeleteConfirmModal } from 'app/components/DeleteConfirmModal';
import fakeAPI from 'utils/fakeAPI';
import { models } from '@hdwebsoft/boilerplate-api-sdk';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { SelectValue } from 'antd/lib/select';
import { useProjectDetail } from 'app/pages/ProjectPage/ProjectDetailPage/useProjectDetail';
import { ProjectDetailMessages } from 'app/pages/ProjectPage/ProjectDetailPage/messages';

interface MemberType {
  allocation: number;
  project_role: string;
  employee: {
    id: string;
    avatar?: string;
    first_name: string;
    last_name: string;
  };
}
interface TeamMemberProps {
  members?: Array<MemberType>;
  visibility: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  projId: string;
}

type Employee = models.hr.Employee;

const { TabPane } = Tabs;
const { Option } = Select;

const allocations: number[] = [2];
for (let i = 4; i <= 40; i += 4) {
  allocations.push(i);
}

export const TeamMemberModal = memo((props: TeamMemberProps) => {
  const history = useHistory();
  const { t } = useTranslation();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataSource, setDatasource] = useState<MemberType[] | undefined>([]);
  const [memberEmail, setMemberEmail] = useState('');
  const [mid, setMid] = useState('');
  const [memberForm] = Form.useForm();
  const [allocation, setAllocation] = useState<SelectValue>();
  const [employees, setEmployees] = useState<Employee[] | undefined>([]);
  const [searchLoad, setSearchLoad] = useState(false);
  const [value, setValue] = useState('');
  const [loadingMember, setLoadingMember] = useState(false);
  const [modalWidth, setModalWidth] = useState(1000);
  const [activeKey, setActiveKey] = useState('1');
  const [textCopy, setTextCopy] = useState(false);

  const { fetchUser } = useProjectDetail();
  const { members, visibility, handleOk, handleCancel, projId } = props;

  let computeDs = (members: Array<MemberType> = []) => {
    if (!members) return;
    return members.map(member => ({
      allocation: member.allocation,
      project_role: member.project_role,
      name: member.employee.first_name + ' ' + member.employee.last_name,
      ...member.employee,
      employee: {
        ...member.employee,
      },
    }));
  };

  useEffect(() => {
    const newMembersArray = computeDs(members);
    setDatasource(newMembersArray);
  }, [members]);

  // table
  const showDeleteModal = record => {
    setIsModalVisible(true);
    setMemberEmail(record.email);
    setMid(record.id);
  };

  const handleConfirmDelete = async () => {
    setIsModalVisible(false);
    try {
      await fakeAPI.delete(`/hr/projects/${projId}/members/${mid}`);
      const newMemberList =
        dataSource &&
        [...dataSource].filter(
          (member: MemberType) => member.employee.id !== mid,
        );
      setDatasource(newMemberList);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCancelDeleteModal = () => {
    setIsModalVisible(false);
  };

  const moreButton = (text: string, record: any) => (
    <>
      <Tooltip title={'Detail'}>
        <IconButton
          type="primary"
          shape="circle"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            history.push(`/employees/${text}`);
          }}
        />
      </Tooltip>
      <Tooltip title={'Edit'}>
        <IconButton
          shape="circle"
          icon={<EditOutlined />}
          size="small"
          onClick={() => {
            history.push({
              pathname: `/employees/` + text,
              state: { edit: true },
            });
          }}
        />
      </Tooltip>
      <Tooltip title={'Delete'}>
        <IconButton
          danger
          shape="circle"
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => {
            showDeleteModal(record);
          }}
        />
      </Tooltip>
    </>
  );

  const columns: ColumnsType<any> = [
    {
      title: 'Allocation',
      dataIndex: 'allocation',
      width: 100,
      render: allocation => (
        <Tag color={antColours[allocation]}>{allocation}</Tag>
      ),
    },
    {
      title: 'Project Role',
      dataIndex: 'project_role',
      width: 100,
      render: text => {
        switch (text) {
          case 'PM':
            return t(ProjectDetailMessages.memberPM());
          case 'TL':
            return t(ProjectDetailMessages.memberTL());
          case 'QC':
            return t(ProjectDetailMessages.memberQC());
          case 'DEV':
            return t(ProjectDetailMessages.memberDEV());
          case 'OTHER':
            return t(ProjectDetailMessages.memberOTHER());
          default:
            return text;
        }
      },
    },

    {
      title: 'Employee',
      dataIndex: 'name',
      width: 150,
      render: (text, record: any) => (
        <div>
          <Avatar src={record.avatar} name={text} size={30} />
          <span style={{ marginLeft: '5px ' }}>{text}</span>
        </div>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'id',
      width: 100,
      render: (text, record: any, index: number) => {
        return (
          <>
            <Popover
              content={() => moreButton(text, record)}
              placement="bottom"
            >
              <IconButton shape="circle" size="small" icon={<MoreOutlined />} />
            </Popover>
          </>
        );
      },
    },
  ];

  // add members
  const handleSearch = async value => {
    if (value) {
      setSearchLoad(true);
      const response = await fetchUser(value);
      if (response) {
        setEmployees(response);
        setSearchLoad(false);
      }
    } else {
      setEmployees([]);
    }
  };
  const handleChange = value => {
    setValue(value);
  };

  const options = employees?.map(employee => (
    <Option key={employee.id} value={employee.id}>
      {employee.first_name} {employee.last_name}
    </Option>
  ));

  const role = [
    {
      name: t(ProjectDetailMessages.memberPM()),
      value: 'PM',
    },
    {
      name: t(ProjectDetailMessages.memberTL()),
      value: 'TL',
    },
    {
      name: t(ProjectDetailMessages.memberQC()),
      value: 'QC',
    },
    {
      name: t(ProjectDetailMessages.memberDEV()),
      value: 'DEV',
    },
    {
      name: t(ProjectDetailMessages.memberOTHER()),
      value: 'OTHER',
    },
  ];

  const handleAddMember = async values => {
    try {
      setLoadingMember(true);
      if (projId) {
        const response = await fakeAPI.post(`/hr/projects/${projId}/members/`, {
          ...values.members,
          project: projId,
        });
        if (response) {
          memberForm.resetFields();
          const employee = await fakeAPI.get(
            `/hr/projects/${projId}/members/${values.members.employee}/`,
          );
          const newMember: any = {
            ...employee,
          };

          const newDs = dataSource && [
            ...dataSource,
            {
              ...newMember,
              name:
                newMember.employee.first_name +
                ' ' +
                newMember.employee.last_name,
              employee: newMember.employee,
              ...newMember.employee,
            },
          ];
          setDatasource(newDs);
          setActiveKey('1');
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingMember(false);
    }
  };

  const descriptionDelete = (
    <p>
      You're about to permanently delete your team member{' '}
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
        >{`${memberEmail}`}</strong>
      </Tooltip>
      . This will also delete any references to your project.
    </p>
  );

  const handleChangeTab = key => {
    setActiveKey(key);
    if (key === '1') {
      setModalWidth(1000);
    } else {
      setModalWidth(600);
    }
  };

  return (
    <MembersModal
      width={modalWidth}
      onOk={handleOk}
      onCancel={handleCancel}
      visible={visibility}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Close
        </Button>,
        <Button
          style={{
            display: activeKey === '1' ? 'none' : 'inline-block',
          }}
          loading={loadingMember}
          htmlType="submit"
          type="primary"
          onClick={() => {
            memberForm.validateFields().then(values => {
              handleAddMember(values);
            });
          }}
        >
          {t(ProjectDetailMessages.buttonSubmit())}
        </Button>,
      ]}
    >
      <Tabs
        defaultActiveKey="1"
        activeKey={activeKey}
        onChange={handleChangeTab}
      >
        <TabPane tab="Team Members" key="1">
          <Table dataSource={dataSource} columns={columns} />
          <DeleteConfirmModal
            visible={isModalVisible}
            handleOk={handleConfirmDelete}
            handleCancel={handleCancelDeleteModal}
            title={`Remove Team Member`}
            description={descriptionDelete}
            answer={`${memberEmail}`}
          />
        </TabPane>
        <TabPane tab="Add Members" key="2">
          <Form
            form={memberForm}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            onFinish={handleAddMember}
          >
            <FormSearchItem
              name={['members', 'employee']}
              label={t(ProjectDetailMessages.memberFormEmployeeLabel())}
              rules={[
                {
                  required: true,
                  message: t(ProjectDetailMessages.memberFormEmployeeEmpty()),
                },
              ]}
            >
              <Select
                showSearch
                value={value}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                size="large"
                loading={searchLoad}
                // disabled={selectedMember ? true : false}
                placeholder={t(
                  ProjectDetailMessages.memberFormEmployeePlaceholder(),
                )}
                onSearch={handleSearch}
                onChange={handleChange}
                notFoundContent={searchLoad ? <Spin size="default" /> : null}
              >
                {options}
              </Select>
            </FormSearchItem>
            <FormSearchItem
              name={['members', 'project_role']}
              label={t(ProjectDetailMessages.memberFormProjectRoleLabel())}
              rules={[
                {
                  required: true,
                  message: t(
                    ProjectDetailMessages.memberFormProjectRoleEmpty(),
                  ),
                },
              ]}
            >
              <Select
                size="large"
                placeholder={t(
                  ProjectDetailMessages.memberFormProjectRolePlaceholder(),
                )}
              >
                {role &&
                  role.map((item, index: number) => {
                    return (
                      <Option key={index} value={item.value}>
                        {item.name}
                      </Option>
                    );
                  })}
              </Select>
            </FormSearchItem>
            <FormSearchItem
              name={['members', 'allocation']}
              label={t(ProjectDetailMessages.memberFormAllocationLabel())}
              rules={[
                {
                  required: true,
                  message: t(ProjectDetailMessages.memberFormAllocationEmpty()),
                },
              ]}
            >
              <Select
                size="large"
                placeholder={t(
                  ProjectDetailMessages.memberFormAllocationPlaceholder(),
                )}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option?.value === Number(input)
                }
                onSearch={value => {
                  setAllocation(value);
                }}
                onInputKeyDown={event => {
                  if (event.key === 'Enter') {
                    if (!allocations.includes(Number(allocation))) {
                      allocations.push(Number(allocation));
                      memberForm.setFieldsValue({
                        members: { allocation: Number(allocation) },
                      });
                    }
                  }
                }}
              >
                {allocations &&
                  allocations.map((item, index) => {
                    return (
                      <Option key={index} value={item}>
                        {item}
                      </Option>
                    );
                  })}
              </Select>
            </FormSearchItem>
          </Form>
        </TabPane>
      </Tabs>
    </MembersModal>
  );
});

const MembersModal = styled(Modal)`
  .ant-modal-body {
    max-height: 600px;
    overflow-y: scroll;

    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }

  .ant-modal-body::-webkit-scrollbar {
    display: none;
  }

  .ant-pagination {
    display: none;
  }
`;

const IconButton = styled(Button)`
  margin: 5px;
  span {
    position: absolute !important;
    width: 100%;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
`;

const FormSearchItem = styled(Form.Item)``;
