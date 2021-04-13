/**
 *
 * DialogModal
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { messages } from './messages';
import { Button, Modal } from 'antd';

interface Props {
  className?: string;
  title?: string;
  isOpen?: boolean;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  handleCancel?: () => void;
  cancelText?: string;
  handleSubmit?: () => void;
  okText?: string;
  width?: number;
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
    handleSubmit,
    okText,
    width,
  }: Props) => {
    const { t, i18n } = useTranslation();
    return (
      <Modal
        title={<ModalTitle>{title}</ModalTitle>}
        centered
        className={className}
        visible={isOpen}
        onCancel={handleCancel}
        footer={
          cancelText && okText
            ? [
                <Button key="onCancel" size="large" onClick={handleCancel}>
                  {cancelText}
                </Button>,
                <Button
                  key="onSave"
                  size="large"
                  type="primary"
                  onClick={handleSubmit}
                >
                  {okText}
                </Button>,
              ]
            : null
        }
        width={width}
      >
        {children}
      </Modal>
    );
  },
);

const ModalTitle = styled.h1`
  text-align: center;
`;
