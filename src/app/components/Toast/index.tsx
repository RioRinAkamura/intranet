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
  Top = 'top',
  Bottom = 'bottom',
}

const ANIMATION_TIME = 300;

interface propTypes {
  type?: MessageType | string;
  message?: React.ReactNode;
  description?: React.ReactNode;
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
  type: MessageType.Error,
  message: 'Toast Title',
  description: '',
  duration: 2000,
  placement: PlacementType.Top,
  style: {},
  closable: false,
};

const Toast = (props?: propTypes): any => {
  if (!props) {
    props = defaultProps;
  } else {
    const newProps = { ...props };
    props = { ...defaultProps, ...newProps };
  }
  let count = document.getElementsByClassName('toast-box');

  const getContainer = () => {
    const body = document.body;

    const container = document.createElement('div');

    const div = document.createElement('div');

    div.classList.add('toast-box');

    if (props?.placement) {
      div.classList.add(props.placement);
    }

    container.appendChild(div);

    body.appendChild(container);

    return container;
  };

  const Toast = () => {
    return (
      <NotificationBox
        className={props?.className}
        style={props?.style}
        placement={props?.placement}
      >
        <LabelTitle>
          <NotificationMessage>
            <ToastIconType>{renderTypeIcon(props?.type)}</ToastIconType>
            <ToastMessage>{props?.message}</ToastMessage>
          </NotificationMessage>
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
        {/* <NotificationDescription>{props?.description}</NotificationDescription> */}
      </NotificationBox>
    );
  };

  const renderTypeIcon = (type: MessageType | undefined | string) => {
    switch (type) {
      case MessageType.Success:
        return (
          <CheckCircleOutlined style={{ fontSize: '25px', color: '#52c41a' }} />
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
          <CloseCircleOutlined style={{ fontSize: '25px', color: '#ff4d4f' }} />
        );
      default:
        break;
    }
  };

  let newElement = document.createElement('div');

  const close = (el: HTMLDivElement) => {
    setTimeout(() => {
      if (el) {
        document.getElementsByClassName('toast-box')[0].parentElement?.remove();
        ReactDOM.unmountComponentAtNode(el);
        el.remove();
      }
    }, ANIMATION_TIME);
  };

  const renderToast = () => {
    if (count.length === 0) {
      console.log('chay 1');

      const container = getContainer();
      ReactDOM.render(Toast(), newElement, () => {
        container
          .getElementsByClassName('toast-box')[0]
          .appendChild(newElement);

        if (props?.duration && props?.duration > 0) {
          setTimeout(() => {
            close(newElement);
          }, props?.duration);
        }
      });
    }
  };

  return renderToast();
};

const NotificationBox = styled.div`
  padding: 10px 24px;
  line-height: 1.5715;
  position: relative;
  width: 100%;
  margin-left: auto;
  overflow: hidden;
  word-wrap: break-word;
  background: #52c41a;
  border-radius: 2px;
  box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%),
    0 9px 28px 8px rgb(0 0 0 / 5%);
  animation-duration: 0.5s;
  /* animation-name: ${(props: Itheme) =>
    props.placement};
  @keyframes top {
    from {
      left: -400px;
    }
    to {
      left: 0px;
    }
  }

  @keyframes bottom {
    from {
      left: -400px;
    }
    to {
      left: 0px;
    }
  } */
`;

const NotificationMessage = styled.div`
  width: 100%;
  text-align: center;
  color: rgba(0, 0, 0, 0.85);
  font-size: 15px;
  line-height: 24px;
`;

const LabelTitle = styled.div`
  display: flex;
`;

const ToastIconType = styled.span`
  margin-right: 10px;
`;

const ToastMessage = styled.span`
  margin-top: 5px;
`;

export default Toast;
