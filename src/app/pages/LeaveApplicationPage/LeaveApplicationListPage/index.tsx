import { models } from '@hdwebsoft/intranet-api-sdk';
import { Form } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { CardLayout } from 'app/components/CardLayout';
import PageTitle from 'app/components/PageTitle';
import TableListModel from 'app/components/TableListModel/index';
import { useHandleDataTable } from 'app/components/TableListModel/useHandleDataTable';
import { TotalSearchForm } from 'app/components/TotalSearchForm';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import styled from 'styled-components/macro';
import { useTableConfig } from 'utils/tableConfig';
import { Messages } from './messages';
import { EmployeeLeavePageSlice } from './slice';
import {
  selectEmployeeLeaveParams,
  selectEmployeeLeaveState,
} from './slice/selectors';

type EmployeeLeave = models.hr.EmployeeLeave;
const model = 'leave';

export const LeaveApplications: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [searchForm] = Form.useForm();
  const dispatch = useDispatch();
  const tableState = useSelector(selectEmployeeLeaveState);
  const params = useSelector(selectEmployeeLeaveParams);
  const { actions } = EmployeeLeavePageSlice();

  React.useEffect(() => {
    dispatch(actions.fetchEmployeesLeave({ params: params }));
  }, [dispatch, actions, params]);

  const { setFilterText, setSearchText, resetSearch } = useHandleDataTable(
    tableState,
    actions,
  );

  const {
    getColumnSorterProps,
    getColumnSearchInputProps,
    getColumnSearchSelectProps,
  } = useTableConfig(tableState, Messages, setFilterText);

  const columns: ColumnProps<EmployeeLeave>[] = [
    {
      title: 'Employee Name',
      dataIndex: 'employee_name',
      width: 75,
      fixed: 'left',
      ...getColumnSorterProps('employee_name', 1),
      ...getColumnSearchInputProps(['employee_name']),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      width: 100,
      ...getColumnSorterProps('title', 1),
      ...getColumnSearchInputProps(['title']),
    },
    {
      title: 'Status',
      dataIndex: 'approval_status',
      width: 65,
      ...getColumnSorterProps('approval_status', 5),
      ...getColumnSearchSelectProps(
        'approval_status',
        [
          { label: 'Pending', value: 'PENDING' },
          { label: 'Approved', value: 'APPROVED' },
        ],
        'Please choose status',
      ),
    },
    {
      title: 'Working Type',
      dataIndex: 'working_type',
      width: 75,
      ...getColumnSorterProps('working_type', 6),
      ...getColumnSearchSelectProps(
        'working_type',
        [
          { label: 'Off', value: 'Off' },
          { label: 'Remote', value: 'Remote' },
        ],
        'Choose working type',
      ),
    },
    {
      title: 'Start Date',
      dataIndex: 'start_date',
      width: 55,
      ...getColumnSorterProps('start_date', 7),
      ...getColumnSearchInputProps(['start_date'], 0, 'date'),
    },
    {
      title: 'End Date',
      dataIndex: 'end_date',
      width: 55,
      ...getColumnSorterProps('end_date', 8),
      ...getColumnSearchInputProps(['end_date'], 0, 'date'),
    },
  ];

  const totalSearch = () => {
    const values = searchForm.getFieldValue('search');
    setSearchText(values);
  };

  const resetTotalSearch = () => {
    searchForm.setFieldsValue({ search: undefined });
    resetSearch();
  };

  return (
    <>
      <Helmet>
        <title>{t(Messages.title())}</title>
        <meta name="description" content={t(Messages.description())} />
      </Helmet>
      <PageTitle title={t(Messages.title())}>
        <TotalSearchForm
          form={searchForm}
          value={params.search}
          loading={tableState.loading ? true : false}
          messageTrans={Messages}
          onSearch={totalSearch}
          onReset={resetTotalSearch}
        />
      </PageTitle>
      <Wrapper>
        <TableListModel
          model={model}
          columns={columns}
          handleOnClickViewButton={id => {
            history.push(`/leave_applications/${id}`);
          }}
          handleOnClickEditButton={id => {
            history.push({
              pathname: '/leave_applications/' + id,
              state: { edit: true },
            });
          }}
        />
      </Wrapper>
    </>
  );
};

const Wrapper = styled(CardLayout)``;
