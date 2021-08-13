/**
 *
 * ChangeLogs
 *
 */
import React from 'react';
import { Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { ColumnProps } from 'antd/lib/table';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { parse } from 'query-string';
import styled from 'styled-components/macro';

import {
  selectEmployeeChangeLogs,
  selectEmployeeChangeLogsParams,
} from './slice/selectors';
import { useEmployeeChangeLogsSlice } from './slice';
import { ChangeLogsMessages } from './messages';
import { isEmpty } from 'lodash';

interface Props {}

export const ChangeLogs = React.memo((props: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { id } = useParams<Record<string, string>>();
  const history = useHistory();
  const location = useLocation();

  const { actions } = useEmployeeChangeLogsSlice();
  const params = useSelector(selectEmployeeChangeLogsParams);
  const employeeChangeLogsState = useSelector(selectEmployeeChangeLogs);

  const columns: ColumnProps<any>[] = [
    {
      title: `${t(ChangeLogsMessages.tableDateTimeColumn())}`,
      dataIndex: 'change_date',
      render: value => (value ? moment(value).format('DD-MM-YYYY HH:mm') : ''),
      defaultSortOrder: 'descend',
      sorter: (prev, next) =>
        moment(prev.change_date).unix() - moment(next.change_date).unix(),
    },
    {
      title: `${t(ChangeLogsMessages.tableUserColumn())}`,
      dataIndex: 'change_user_name',
      render: value => value,
      sorter: (prev, next) =>
        prev.change_user_name?.localeCompare(next.change_user_name),
    },
    {
      title: `${t(ChangeLogsMessages.tableChangesColumn())}`,
      dataIndex: 'change_diff',
      width: '600px',
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
      width: '150px',
      render: value => value,
    },
  ];

  const onChangePageTable = (pageSize?: number, page?: number) => {
    history.push(`?limit=${pageSize}&page=${page}`);
  };

  React.useEffect(() => {
    const urlParams = parse(location.search);
    if (!isEmpty(urlParams)) {
      dispatch(
        actions.setPagination({
          pageSize: Number(urlParams.limit),
          current: Number(urlParams.page),
        }),
      );
    } else {
      dispatch(actions.resetPagination());
    }
    dispatch(actions.fetchEmployeeChangeLogs({ employee_id: id, params }));
  }, [actions, dispatch, id, location.search, params]);

  return (
    <Table
      bordered
      dataSource={employeeChangeLogsState.changeLogs}
      columns={columns}
      rowKey="change_id"
      scroll={{ x: 1100 }}
      pagination={{
        ...employeeChangeLogsState.pagination,
        onChange: (page: number, pageSize?: number) => {
          onChangePageTable(pageSize, page);
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
    />
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
