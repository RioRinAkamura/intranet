import { Row, Col } from 'antd';
import * as React from 'react';
import { CardWrapper } from 'app/components/CardWrapper';
import PageTitle from 'app/components/PageTitle';
import { api } from 'utils/api';
import { LoadingIndicator } from '../LoadingIndicator';
import styled from 'styled-components/macro';

enum LiveProjectLabelColor {
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
  medium = 'orange',
  low = 'green',
  high = 'red',
}

export default function LiveProjectsWidget() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [liveProjectData, setLiveProjectData] = React.useState<number[]>([]);
  const [liveProjectLabel, setLiveProjectLabel] = React.useState<string[]>([]);

  const fetchLiveEmployee = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.dashboard.widgets.getLiveProjectWidget();
      setLiveProjectLabel(Object.keys(data));
      setLiveProjectData(Object.values(data));
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
        return LiveProjectLabelColor.good;
      case 'normal':
        return LiveProjectLabelColor.normal;
      case 'concerned':
        return LiveProjectLabelColor.concerned;
      case 'bad':
        return LiveProjectLabelColor.bad;
      case 'overload':
        return LiveProjectLabelColor.overload;
      case 'easyload':
        return LiveProjectLabelColor.easyload;
      case 'allocable':
        return LiveProjectLabelColor.allocable;
      case 'unallocable':
        return LiveProjectLabelColor.unallocable;
      case 'on_tracking':
        return LiveProjectLabelColor.on_tracking;
      case 'off_tracking':
        return LiveProjectLabelColor.off_tracking;
      case 'high':
        return LiveProjectLabelColor.high;
      case 'medium':
        return LiveProjectLabelColor.medium;
      case 'low':
        return LiveProjectLabelColor.low;
      case 'high':
        return LiveProjectLabelColor.high;
      default:
        return 'black';
    }
  };

  return (
    <CardWrapper bodyheight="auto" title={<PageTitle title="Live Projects" />}>
      {isLoading ? (
        <Row style={{ height: '100%' }} align="middle" justify="center">
          <LoadingIndicator />
        </Row>
      ) : (
        <Row gutter={[0, 32]} align="middle" justify="space-between">
          {liveProjectLabel.map((label, index) => (
            <Col span={2}>
              <LiveEmployeeItemsWrapper>
                <h4>{liveProjectData[index]}</h4>
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
