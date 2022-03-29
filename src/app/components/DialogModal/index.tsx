/**
 *
 * DialogModal
 *
 */
import * as React from 'react';
import { Button, Modal } from 'antd';

interface Props {
  className?: string;
  title?: string;
  isOpen?: boolean;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  handleCancel?: () => void;
  maskClosable?: boolean;
  cancelText?: string;
  handleSubmit?: () => void;
  loading?: boolean;
  okText?: string;
  width?: number | string;
  handleOk?: (value) => void;
}

export const DialogModal = React.memo(
  ({
    title,
    className,
    isOpen,
    children,
    footer,
    handleCancel,
    cancelText,
    maskClosable,
    handleSubmit,
    okText,
    width,
    loading,
    handleOk,
  }: Props) => {
    return (
      <Modal
        title={title}
        centered
        className={className}
        visible={isOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        maskClosable={maskClosable}
        footer={
          footer ? (
            footer
          ) : cancelText && okText ? (
            [
              <Button
                key="onCancel"
                shape="round"
                size="large"
                onClick={handleCancel}
              >
                {cancelText}
              </Button>,
              <Button
                key="onSave"
                type="primary"
                shape="round"
                size="large"
                loading={loading}
                onClick={handleSubmit}
              >
                {okText}
              </Button>,
            ]
          ) : okText ? (
            <Button
              key="onSave"
              type="primary"
              shape="round"
              size="large"
              loading={loading}
              onClick={handleSubmit}
            >
              {okText}
            </Button>
          ) : null
        }
        width={width}
      >
        {children}
      </Modal>
    );
  },
);
