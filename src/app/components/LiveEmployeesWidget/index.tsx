import { Row, Col } from 'antd';
import * as React from 'react';
import { CardWrapper } from 'app/components/CardWrapper';
import PageTitle from 'app/components/PageTitle';
import { api } from 'utils/api';
import { LoadingIndicator } from '../LoadingIndicator';
import styled from 'styled-components/macro';

enum LiveEmployeeLabelColor {
  good = 'green',
  normal = 'black',
  concerned = 'orange',
  bad = 'red',
  overload = 'red',
  easyload = 'red',
  allocable = 'blue',
  unallocable = 'black',
  on_tracking = 'green',
  off_tracking = 'red',
}

export default function LiveEmployeeWidgets() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [liveEmployeeData, setLiveEmployeeData] = React.useState<number[]>([]);
  const [liveEmployeeLabel, setLiveEmployeeLabel] = React.useState<string[]>(
    [],
  );

  const fetchLiveEmployee = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.dashboard.widgets.getLiveEmployeeWidget();
      setLiveEmployeeLabel(Object.keys(data));
      setLiveEmployeeData(Object.values(data));
    } catch (e) {
      console.log(e, 'fetch err');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchLiveEmployee();
  }, [fetchLiveEmployee]);

  const buildLabelColor = (label): string => {
    switch (label) {
      case 'good':
        return LiveEmployeeLabelColor.good;
      case 'normal':
        return LiveEmployeeLabelColor.normal;
      case 'concerned':
        return LiveEmployeeLabelColor.concerned;
      case 'bad':
        return LiveEmployeeLabelColor.bad;
      case 'overload':
        return LiveEmployeeLabelColor.overload;
      case 'easyload':
        return LiveEmployeeLabelColor.easyload;
      case 'allocable':
        return LiveEmployeeLabelColor.allocable;
      case 'unallocable':
        return LiveEmployeeLabelColor.unallocable;
      case 'on_tracking':
        return LiveEmployeeLabelColor.on_tracking;
      case 'off_tracking':
        return LiveEmployeeLabelColor.off_tracking;

      default:
        return 'black';
    }
  };

  return (
    <CardWrapper bodyheight="auto" title={<PageTitle title="Live Employees" />}>
      {isLoading ? (
        <Row style={{ height: '100%' }} align="middle" justify="center">
          <LoadingIndicator />
        </Row>
      ) : (
        <Row gutter={[0, 32]} align="middle" justify="space-between">
          {liveEmployeeLabel.map((label, index) => (
            <Col span={2}>
              <LiveEmployeeItemsWrapper>
                <h4>{liveEmployeeData[index]}</h4>
                <p style={{ color: buildLabelColor(label) }}>
                  {label.split('_').join(' ')}
                </p>
              </LiveEmployeeItemsWrapper>
            </Col>
          ))}
        </Row>
      )}
    </CardWrapper>
  );
}

const LiveEmployeeItemsWrapper = styled.div`
  text-align: center;
  p {
    font-size: 10px;
    text-transform: uppercase;
    margin-bottom: 0;
    margin-top: 15px;
  }

  h4 {
    text-transform: uppercase;
    font-size: 24px;
  }
`;
