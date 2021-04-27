import { Card } from 'antd';
import styled from 'styled-components/macro';

interface CardProps {
  mainHeight: string;
  bodyHeight: string;
}

export const CardWrapper = styled(Card)`
  background-color: white;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
  border-radius: 12px;
  height: ${(props: CardProps) => props.mainHeight};

  .ant-card-body {
    height: ${(props: CardProps) => props.bodyHeight};
    overflow-y: auto;
    overflow-x: hidden;
    ::-webkit-scrollbar-track {
      border-radius: 10px;
      margin-left: 5px;
    }

    ::-webkit-scrollbar {
      width: 8px;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: rgb(237 237 237);
      margin-left: 5px;
    }
  }
`;
