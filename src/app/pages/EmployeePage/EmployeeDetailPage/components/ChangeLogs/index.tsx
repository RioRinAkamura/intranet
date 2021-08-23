/**
 *
 * ChangeLogs
 *
 */
import React from 'react';
import { Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { ColumnProps, TablePaginationConfig } from 'antd/lib/table';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { FilterValue, SorterResult } from 'antd/lib/table/interface';

import config from 'config';

import {
  selectEmployeeChangeLogs,
  selectEmployeeChangeLogsIsFilter,
  selectEmployeeChangeLogsParams,
} from './slice/selectors';
import { useEmployeeChangeLogsSlice } from './slice';
import { ChangeLogsMessages } from './messages';
import { useHandleDataTable } from 'app/pages/EmployeePage/EmployeeListPage/useHandleDataTable';
import { useTableConfig } from 'utils/tableConfig';
import { Wrapper } from 'styles/StyledCommon';

const DATE_FORMAT = config.DATE_FORMAT;

interface ChangeLogsProps {
  employeeId: string;
}

export const ChangeLogs = React.memo(({ employeeId }: ChangeLogsProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { actions } = useEmployeeChangeLogsSlice();
  const params = useSelector(selectEmployeeChangeLogsParams);
  const isFilter = useSelector(selectEmployeeChangeLogsIsFilter);
  const employeeChangeLogsState = useSelector(selectEmployeeChangeLogs);

  const { setOrdering, setPagination, setFilterText } = useHandleDataTable(
    employeeChangeLogsState,
    actions,
  );

  const { getColumnSorterProps } = useTableConfig(
    employeeChangeLogsState,
    ChangeLogsMessages,
    setFilterText,
  );

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[],
  ) => {
    setOrdering(sorter);
  };

  const columns: ColumnProps<any>[] = [
    {
      title: `${t(ChangeLogsMessages.tableDateTimeColumn())}`,
      dataIndex: 'change_date',
      width: '200px',
      render: value => (
        <p>
          {moment(value).format('HH:mm')} <br />
          {moment(value).format(DATE_FORMAT)}
        </p>
      ),
      ...getColumnSorterProps('change_date', 1),
    },
    {
      title: `${t(ChangeLogsMessages.tableUserColumn())}`,
      dataIndex: 'change_user',
      render: value => (value ? `${value.first_name} ${value.last_name}` : ''),
    },
    {
      title: `${t(ChangeLogsMessages.tableChangesColumn())}`,
      dataIndex: 'change_diff',
      render: values => {
        return values ? (
          <table>
            {values.map(item => (
              <tr>
                <StyledField>{item.field}</StyledField>
                <td>
                  <StyledOldValue>{item.old}</StyledOldValue>
                  <br />
                  <StyledNewValue>{item.new}</StyledNewValue>
                </td>
              </tr>
            ))}
          </table>
        ) : (
          ''
        );
      },
    },
    {
      title: `${t(ChangeLogsMessages.tableTypeColumn())}`,
      dataIndex: 'change_type',
      width: '200px',
      render: value => value,
    },
  ];

  const fetchEmployeeChangeLogs = React.useCallback(() => {
    if (!isFilter) {
      dispatch(
        actions.fetchEmployeeChangeLogs({
          employee_id: employeeId,
          params: params,
        }),
      );
    }
  }, [actions, dispatch, employeeId, isFilter, params]);

  React.useEffect(() => {
    fetchEmployeeChangeLogs();
  }, [fetchEmployeeChangeLogs]);

  return (
    <Wrapper>
      <Table
        bordered
        dataSource={employeeChangeLogsState.changeLogs}
        columns={columns}
        rowKey="change_id"
        scroll={{ x: 1100 }}
        pagination={{
          ...employeeChangeLogsState.pagination,
          onChange: (page: number, pageSize?: number) => {
            setPagination({ current: page, pageSize });
          },
          showTotal: (total, range) => (
            <div>
              Showing{' '}
              <span>
                {range[0]}-{range[1]}
              </span>{' '}
              of {total} items
            </div>
          ),
          pageSizeOptions: ['10', '20', '50', '100'],
          showSizeChanger: true,
        }}
        loading={employeeChangeLogsState.loading}
        onChange={handleTableChange}
      />
    </Wrapper>
  );
});

const StyledField = styled.td`
  width: 240px;
  padding-right: 40px;
`;

const StyledOldValue = styled.span`
  color: red;
  text-decoration: line-through;
`;

const StyledNewValue = styled.span`
  color: green;
`;
