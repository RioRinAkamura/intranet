/**
 *
 * Avatar
 *
 */
import React, { memo } from 'react';
import { Avatar as AntAvatar } from 'antd';
interface Props {
  size?: number;
  src?: string;
  alt?: string;
  icon?: React.ReactNode;
  name: string;
}

export const Avatar = memo((props: Props) => {
  const { size, alt, src, icon, name } = props;
  const colours = [
    '#1abc9c',
    '#2ecc71',
    '#3498db',
    '#9b59b6',
    '#34495e',
    '#16a085',
    '#27ae60',
    '#2980b9',
    '#8e44ad',
    '#2c3e50',
    '#f1c40f',
    '#e67e22',
    '#e74c3c',
    '#95a5a6',
    '#f39c12',
    '#d35400',
    '#c0392b',
    '#bdc3c7',
    '#7f8c8d',
  ];

  const nameSplit = (name || ' ').split(' '),
    initials =
      nameSplit[0].charAt(0).toUpperCase() +
      nameSplit[1].charAt(0).toUpperCase();

  const charIndex = initials.charCodeAt(0) - 65,
    colourIndex = charIndex % colours.length;
  return (
    <AntAvatar
      size={size ? size : 150}
      alt={alt ? alt : 'Logo'}
      src={src ? src : undefined}
      style={{
        backgroundColor: colours[colourIndex] ? colours[colourIndex] : '#ccc',
      }}
      icon={icon}
    >
      {initials}
    </AntAvatar>
  );
});
