import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components/macro';
import { CloseOutlined } from '@ant-design/icons';

export enum MessageType {
  Success = 'success',
  Info = 'info',
  Warn = 'warning',
  Error = 'error',
}

export enum PlacementType {
  Top = 'top',
  Bottom = 'bottom',
}

const ANIMATION_TIME = 300;

export interface toastTypes {
  type?: MessageType | string;
  message?: React.ReactNode;
  duration?: number;
  placement?: PlacementType | string;
  className?: string;
  style?: object;
  closable?: boolean;
}

interface Itheme {
  placement?: string;
  duration?: number | null;
  background?: string;
}

const Toast = (props: toastTypes | any) => {
  const idClass = Math.random();
  if (props) {
    let count = document.getElementsByClassName(`toast-box-${idClass}`);
    const getContainer = () => {
      const body = document.body;
      const container = document.createElement('div');
      const div = document.createElement('div');
      div.classList.add('toast-box');
      div.classList.add(`toast-box-${idClass}`);
      if (props?.placement) {
        div.classList.add(props.placement);
      }
      container.appendChild(div);
      body.appendChild(container);
      return container;
    };

    const formatDuration = () => {
      if (props?.duration > 0) {
        const newDuration = props?.duration / 1000 - 0.2;
        return newDuration;
      } else {
        return null;
      }
    };

    const Toast = () => {
      return (
        <ToastBox
          className={props?.className}
          style={props?.style}
          background={props?.type}
          duration={formatDuration()}
          placement={props?.placement}
        >
          <LabelTitle>
            <ToastLabel>
              <ToastMessage>{props?.message}</ToastMessage>
            </ToastLabel>
            {props?.closable && (
              <CloseOutlined
                style={{
                  fontSize: 'large',
                  marginTop: '3px',
                  color: '#fff',
                }}
                onClick={onClickRemoveToast}
              />
            )}
          </LabelTitle>
        </ToastBox>
      );
    };
    const onClickRemoveToast = () => {
      close();
    };
    let newElement = document.createElement('div');
    const close = () => {
      if (
        document.getElementsByClassName(`toast-box-${idClass}`)[0] !== undefined
      ) {
        setTimeout(() => {
          document.getElementsByClassName(`toast-box-${idClass}`)[0]
            .parentElement &&
            document
              .getElementsByClassName(`toast-box-${idClass}`)[0]
              .parentElement?.remove();
        }, ANIMATION_TIME);
      }
    };
    const renderToast = () => {
      if (count.length === 0) {
        const container = getContainer();
        ReactDOM.render(Toast(), newElement, () => {
          container
            .getElementsByClassName(`toast-box-${idClass}`)[0]
            .appendChild(newElement);
          if (props?.duration && props?.duration > 0) {
            setTimeout(() => {
              close();
            }, props?.duration);
          }
        });
      }
    };
    return renderToast();
  }
};

const ToastBox = styled.div`
  padding: 10px 24px;
  line-height: 1.5715;
  position: relative;
  width: 100%;
  overflow: hidden;
  word-wrap: break-word;
  border-radius: 2px;
  box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%),
    0 9px 28px 8px rgb(0 0 0 / 5%);
  background-color: ${(props: Itheme) => {
    switch (props.background) {
      case MessageType.Success:
        return '#52c41a';
      case MessageType.Warn:
        return '#faad14';
      case MessageType.Info:
        return '#08c';
      case MessageType.Error:
        return '#f46b6b';
    }
  }};
  animation: ${(props: Itheme) => props.placement + 'start'} 0.5s
    ${(props: Itheme) =>
      props.duration &&
      ', ' + props.placement + 'destroy 0.5s ' + props.duration + 's'};
  @keyframes topstart {
    from {
      top: -20px;
    }
    to {
      top: 0px;
    }
  }
  @keyframes topdestroy {
    from {
      top: 0px;
    }
    to {
      top: -20px;
    }
  }
  @keyframes bottomstart {
    from {
      bottom: -200px;
    }
    to {
      bottom: 2px;
    }
  }
  @keyframes bottomdestroy {
    from {
      bottom: 2px;
    }
    to {
      bottom: -200px;
    }
  }
`;

const ToastLabel = styled.div`
  width: 100%;
  text-align: center;
  font-size: 15px;
  line-height: 24px;
`;

const LabelTitle = styled.div`
  display: flex;
`;

const ToastMessage = styled.span`
  margin-top: 5px;
  font-weight: 500;
`;

export default Toast;
