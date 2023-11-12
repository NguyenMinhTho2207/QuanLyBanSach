import React from 'react'
import { Col } from 'antd';
import { WrapDivTextAddress, WrapDivTextHeader, WrapperHeader } from './style';
import Logo from '../../assets/images/logo-cong-ty-giao-duc-1.jpg'
import NavbarHeaderComponent from '../NavbarHeaderComponent/NavbarHeaderComponent';
import NavbarLoginComponent from '../NavbarLoginComponent/NavbarLoginComponent';
import { useNavigate } from 'react-router-dom';

const HeaderComponent = () => {
  const navigate = useNavigate();

  return (
    <div>
      <NavbarLoginComponent></NavbarLoginComponent>
      <WrapperHeader>
        <Col span={6}>
          <img src={Logo} style={{cursor: 'pointer'}} alt="logo" onClick={() => {navigate("/")}}/>
        </Col>
        <Col span={18}>
          <WrapDivTextHeader>CÔNG TY TNHH ĐẦU TƯ GIÁO DỤC KHAI MINH</WrapDivTextHeader>
          <WrapDivTextAddress>Địa chỉ: Số 2, đường 30, phường Tân Quy, quận 7, Tp.HCM</WrapDivTextAddress>
        </Col>
      </WrapperHeader>
      <NavbarHeaderComponent></NavbarHeaderComponent>
    </div>
  )
}

export default HeaderComponent