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
  selectProjectChangeLogs,
  selectProjectChangeLogsParams,
  selectProjectChangeLogsIsFilter,
} from './slice/selectors';
import { useProjectChangeLogsSlice } from './slice';
import { ChangeLogsMessages } from './messages';
import { useTableConfig } from 'utils/tableConfig';
import { useHandleDataTable } from 'app/pages/EmployeePage/EmployeeListPage/useHandleDataTable';
import { Wrapper } from 'styles/StyledCommon';

const DATE_FORMAT = config.DATE_FORMAT;

interface ChangeLogsProps {
  project_id: string;
}

export const ChangeLogs = React.memo(({ project_id }: ChangeLogsProps) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const { actions } = useProjectChangeLogsSlice();
  const params = useSelector(selectProjectChangeLogsParams);
  const isFilter = useSelector(selectProjectChangeLogsIsFilter);
  const projectChangeLogsState = useSelector(selectProjectChangeLogs);

  const { setOrdering, setPagination, setFilterText } = useHandleDataTable(
    projectChangeLogsState,
    actions,
  );

  const { getColumnSorterProps } = useTableConfig(
    projectChangeLogsState,
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

  const fetchProjectChangeLogs = React.useCallback(() => {
    if (!isFilter) {
      dispatch(actions.fetchProjectChangeLogs({ project_id, params: params }));
    }
  }, [actions, dispatch, project_id, isFilter, params]);

  React.useEffect(() => {
    fetchProjectChangeLogs();
  }, [fetchProjectChangeLogs]);

  return (
    <Wrapper>
      <Table
        bordered
        dataSource={projectChangeLogsState.changeLogs}
        columns={columns}
        rowKey="change_id"
        scroll={{ x: 1100 }}
        pagination={{
          ...projectChangeLogsState.pagination,
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
        loading={projectChangeLogsState.loading}
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
