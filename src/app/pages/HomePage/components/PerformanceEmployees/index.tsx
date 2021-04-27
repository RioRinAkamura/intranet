import {
  DoubleRightOutlined,
  DoubleLeftOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { Calendar, Col, Row } from 'antd';
import { CardWrapper } from 'app/components/CardWrapper';
import { Title } from 'app/components/Title';
import moment from 'moment';
import * as React from 'react';
import styled from 'styled-components/macro';

export const PerformanceEmployees = () => {
  function onPanelChange(value, mode) {
    console.log(value, mode);
  }
  return (
    <>
      <Row gutter={[32, 32]}>
        <Col span={16}>
          <CardWrapper
            mainHeight="463px"
            bodyHeight="385px"
            title={<Title>Top Performance Employees</Title>}
          ></CardWrapper>
        </Col>
        <Col span={8}>
          <ViewCalendar
            fullscreen={false}
            onPanelChange={onPanelChange}
            headerRender={({ value, onChange }) => {
              const current = value.clone();
              const month = value.month();
              const year = value.year();
              return (
                <>
                  <CalendarHeader align="middle" justify="space-around">
                    <Col>
                      <DoubleLeftOutlined
                        onClick={() => {
                          const now = value.clone().year(year - 1);
                          onChange(now);
                        }}
                      />
                    </Col>
                    <Col>
                      <LeftOutlined
                        onClick={() => {
                          const now = value.clone().month(month - 1);
                          onChange(now);
                        }}
                      />
                    </Col>
                    <Col>
                      <CurrentDate>
                        {moment(current).format('MMMM YYYY')}
                      </CurrentDate>
                    </Col>
                    <Col>
                      <RightOutlined
                        onClick={() => {
                          if (
                            year < moment().year() ||
                            month < moment().month()
                          ) {
                            const now = value.clone().month(month + 1);
                            onChange(now);
                          } else {
                            onChange(moment());
                          }
                        }}
                      />
                    </Col>
                    <Col>
                      <DoubleRightOutlined
                        onClick={() => {
                          if (year < moment().year()) {
                            const now = value.clone().year(year + 1);
                            onChange(now);
                          } else {
                            onChange(moment());
                          }
                        }}
                      />
                    </Col>
                  </CalendarHeader>
                </>
              );
            }}
          />
        </Col>
      </Row>
    </>
  );
};

const CurrentDate = styled.div`
  font-size: 22px;
  line-height: 27px;
`;

const ViewCalendar = styled(Calendar)`
  height: 463px;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
  border-radius: 12px;

  table {
    height: 350px !important;
    th {
      font-size: 18px;
      line-height: 22px;
      color: rgb(31 169 224);
      text-transform: uppercase;
    }
  }
`;

const CalendarHeader = styled(Row)`
  background-color: rgb(31 169 224);
  height: 80px;
  color: white;
  text-align: center;
  border-radius: 10px 10px 0px 0px;

  span {
    font-weight: 500;
  }
`;
