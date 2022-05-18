import { CopyOutlined } from '@ant-design/icons';
import React from 'react';
import { ToastMessageType, useNotify } from '../ToastNotification';

interface CopyProps {
  text: string;
}

const CopyToClipboard = ({ text }: CopyProps) => {
  const { notify } = useNotify();
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    notify({
      type: ToastMessageType.Info,
      message: 'Copied',
      duration: 2,
    });
  };

  return <CopyOutlined onClick={handleCopy} />;
};

export default CopyToClipboard;
