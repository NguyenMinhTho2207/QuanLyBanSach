import { Menu } from 'antd'
import React, { useState } from 'react'
import { getItem } from '../../utils';
import { UserOutlined, AppstoreOutlined, DropboxOutlined } from '@ant-design/icons'
import NavbarLoginComponent from '../../components/NavbarLoginComponent/NavbarLoginComponent';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';
import AdminCategory from '../../components/AdminCategory/AdminCategory';

export const AdminPage = () => {
  const items  = [
    getItem('Người dùng', 'user', <UserOutlined />),

    getItem('Sản phẩm', 'product', <DropboxOutlined />),

    getItem('Danh mục', 'category', <AppstoreOutlined />),
  ];

  const [keySelected, setKeySelected] = useState('');

  const renderPage = (key) => {
    switch (key) {
      case 'user':
        return (
          <AdminUser></AdminUser>
        )
      
      case 'product':
        return (
          <AdminProduct></AdminProduct>
        )

      case 'category':
        return (
          <AdminCategory></AdminCategory>
        )

      default:
        return <></>
    }
  }


  const handleOnClick = ({ key }) => {
    setKeySelected(key)
  }

  return (
    <>
      <NavbarLoginComponent isHiddenAddress isHiddenCart></NavbarLoginComponent>
      <div style={{display: 'flex', }}>
        <Menu
          mode="inline"
          style={{ width: '256px', boxShadow: '1px 1px 2px #ccc' }}
          items={items}
          onClick={handleOnClick}
        />
        <div style={{padding: '15px', flex: '1'}}>
          {renderPage(keySelected)}
        </div>
      </div>
    </>
  )
}