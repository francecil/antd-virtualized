import React from 'react';
import { Button } from 'antd'

export interface ButtonProps {
  size?: 'large' | 'default';
}

const Tutton: React.FC<ButtonProps> = function(props) {
  return (
    <Button type="primary" {...props}></Button>
  );
};

export default Tutton;
