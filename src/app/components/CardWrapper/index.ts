import { Card } from 'antd';
import styled from 'styled-components/macro';

interface CardProps {
  mainheight: string;
  bodyheight: string;
  backgroundimg?: string;
}

export const CardWrapper = styled(Card)`
  background-color: white;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
  border-radius: 12px;
  height: ${(props: CardProps) => props.mainheight};
  background: ${(props: CardProps) =>
    props.backgroundimg ? `url(${props.backgroundimg})` : ''};
  background-position-x: ${(props: CardProps) =>
    props.backgroundimg ? '-7px' : ''};

  .ant-card-body {
    height: ${(props: CardProps) => props.bodyheight};
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
