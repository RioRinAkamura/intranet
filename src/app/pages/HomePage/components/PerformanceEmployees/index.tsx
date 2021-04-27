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
            title={<Title>Top Performance Employees</Title>}
          ></CardWrapper>
        </Col>
        <Col span={8}>
          <CardWrapper>
            <div className="site-calendar-demo-card">
              <Calendar
                fullscreen={false}
                onPanelChange={onPanelChange}
                headerRender={({ value, onChange }) => {
                  const current = value.clone();
                  const month = value.month();
                  const year = value.year();
                  return (
                    <>
                      <CalendarHeader
                        gutter={[8, 8]}
                        align="middle"
                        justify="space-around"
                      >
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
            </div>
          </CardWrapper>
        </Col>
      </Row>
    </>
  );
};

const CalendarHeader = styled(Row)`
  background-color: rgb(31 169 224);
  height: 80px;
  color: white;
  text-align: center;

  span {
    font-weight: 500;
  }
`;

const CurrentDate = styled.div`
  font-size: 22px;
  line-height: 27px;
`;
