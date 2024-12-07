import React from 'react';
import '@components/logo/logo.scss';
import { icons } from '@assets/assets';

export default function Component() {
  return (
    <div className="logo">
      <img src={icons.logo} alt="" />
    </div>
  );
}
