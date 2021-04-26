import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components/macro';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  CloseOutlined,
} from '@ant-design/icons';

export enum MessageType {
  Success = 'success',
  Info = 'info',
  Warn = 'warning',
  Error = 'error',
}

export enum PlacementType {
  TopLeft = 'topLeft',
  TopRight = 'topRight',
  BottomLeft = 'bottomLeft',
  BottomRight = 'bottomRight',
}

interface propTypes {
  type?: MessageType | string;
  message?: React.ReactNode;
  description?: string;
  duration?: number;
  placement?: PlacementType | string;
  className?: string;
  style?: object;
  closable?: boolean;
}

interface Itheme {
  placement?: string;
}

const defaultProps = {
  type: MessageType.Success,
  message: 'Notification Title',
  description:
    'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
  duration: 4500,
  placement: PlacementType.TopRight,
  style: {},
  closable: false,
};

const ANIMATION_TIME = 300;

export const useNotify = () => {
  const notify = (props?: propTypes) => {
    if (!props) {
      props = defaultProps;
    } else {
      const newProps = { ...props };
      props = { ...defaultProps, ...newProps };
    }
    let count = document.getElementsByClassName('notification-box');

    const getContainer = () => {
      const body = document.body;

      const container = document.createElement('div');

      const div = document.createElement('div');

      div.classList.add('notification-box');

      if (props?.placement) {
        div.classList.add(props.placement);
      }

      container.appendChild(div);

      body.appendChild(container);

      return container;
    };

    const getSecondContainer = () => {
      const container = document.getElementsByClassName('notification-box')[0];
      return container;
    };

    const Notify = () => {
      return (
        <NotificationBox
          className={props?.className}
          style={props?.style}
          placement={props?.placement}
        >
          <LabelTitle>
            <NotificationIconType>
              {renderTypeIcon(props?.type)}
            </NotificationIconType>
            <NotificationMessage>{props?.message}</NotificationMessage>
            {props?.closable && (
              <CloseOutlined
                style={{
                  fontSize: '15px',
                  marginTop: '2px',
                  color: 'rgba(0,0,0,.45)',
                }}
              />
            )}
          </LabelTitle>
          <NotificationDescription>
            {props?.description}
          </NotificationDescription>
        </NotificationBox>
      );
    };

    const renderTypeIcon = (type: MessageType | undefined | string) => {
      switch (type) {
        case MessageType.Success:
          return (
            <CheckCircleOutlined
              style={{ fontSize: '25px', color: '#52c41a' }}
            />
          );
        case MessageType.Info:
          return (
            <InfoCircleOutlined style={{ fontSize: '25px', color: '#08c' }} />
          );
        case MessageType.Warn:
          return (
            <ExclamationCircleOutlined
              style={{ fontSize: '25px', color: '#faad14' }}
            />
          );
        case MessageType.Error:
          return (
            <CloseCircleOutlined
              style={{ fontSize: '25px', color: '#ff4d4f' }}
            />
          );
        default:
          break;
      }
    };

    let newElement = document.createElement('div');

    const close = (el: HTMLDivElement) => {
      setTimeout(() => {
        if (el) {
          document
            .getElementsByClassName('notification-box')[0]
            .removeChild(el);
          ReactDOM.unmountComponentAtNode(el);
          el.remove();
        }
      }, ANIMATION_TIME);
    };

    const renderNotify = () => {
      if (count.length === 0) {
        const container = getContainer();
        ReactDOM.render(Notify(), newElement, () => {
          container
            .getElementsByClassName('notification-box')[0]
            .appendChild(newElement);

          if (props?.duration && props?.duration > 0) {
            setTimeout(() => {
              close(newElement);
            }, props?.duration);
          }
        });
      } else {
        const container = getSecondContainer();
        if (container) {
          ReactDOM.render(Notify(), newElement, () => {
            container.appendChild(newElement);
          });
        }

        if (props?.duration && props?.duration > 0) {
          setTimeout(() => {
            close(newElement);
          }, props?.duration);
        }
      }
    };
    return renderNotify();
  };

  return { notify };
};

const NotificationBox = styled.div`
  padding: 16px 24px;
  line-height: 1.5715;
  position: relative;
  width: 384px;
  max-width: calc(100vw - 48px);
  margin-bottom: 16px;
  margin-left: auto;
  overflow: hidden;
  word-wrap: break-word;
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%),
    0 9px 28px 8px rgb(0 0 0 / 5%);
  animation-duration: 0.5s;
  animation-name: ${(props: Itheme) => props.placement};
  @keyframes topLeft {
    from {
      left: -400px;
    }
    to {
      left: 0px;
    }
  }

  @keyframes topRight {
    from {
      right: -400px;
    }
    to {
      right: 0px;
    }
  }
  @keyframes bottomLeft {
    from {
      left: -400px;
    }
    to {
      left: 0px;
    }
  }

  @keyframes bottomRight {
    from {
      right: -400px;
    }
    to {
      right: 0px;
    }
  }
`;

const NotificationMessage = styled.div`
  width: 100%;
  margin-bottom: 8px;
  color: rgba(0, 0, 0, 0.85);
  font-size: 16px;
  line-height: 24px;
`;

const LabelTitle = styled.div`
  display: flex;
`;

const NotificationDescription = styled.div`
  font-size: 14px;
  margin-right: 35px;
`;

const NotificationIconType = styled.div`
  margin-right: 10px;
`;
