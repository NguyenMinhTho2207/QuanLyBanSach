import React, { useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import imageLogo from '../../assets/images/logo-login.png'
import { Image } from 'antd'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'

const SignUpPage = () => {
  const [isShowPassword] = useState(false)
  const [isShowConfirmPassword] = useState(false)

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.53)', height: '100vh' }}>
      <div style={{ display: 'flex', width: '800px', height: '445px', borderRadius: '8px', background: '#fff' }}>
        <WrapperContainerLeft>
          <h1>Tạo tài khoản</h1>
          <p>Đăng nhập hoặc tạo tài khoản</p>
          <InputForm style={{ marginBottom: '10px' }} placeholder='abc@gmail.com'></InputForm>
          <div style={{ position: 'relative' }}>
            <span 
              style={{ 
                zIndex: 10,
                position: 'absolute',
                top: '12px',
                right: '8px'
              }}
            >{
                isShowPassword ? (<EyeFilled></EyeFilled>) : (<EyeInvisibleFilled></EyeInvisibleFilled> )
              }
            </span>
            <InputForm style={{ marginBottom: '10px' }} placeholder='Mật khẩu'></InputForm>
          </div>
          <div style={{ position: 'relative' }}>
            <span 
              style={{ 
                zIndex: 10,
                position: 'absolute',
                top: '12px',
                right: '8px'
              }}
            >{
                isShowConfirmPassword ? (<EyeFilled></EyeFilled>) : (<EyeInvisibleFilled></EyeInvisibleFilled> )
              }
            </span>
            <InputForm placeholder='Nhập lại mật khẩu'></InputForm>
          </div>
          <ButtonComponent
              bordered={false}
              size={40}
              styleButton={{ 
                  background: 'rgb(255, 57, 69)', 
                  height: '48px',
                  width: '100%',
                  border: 'none',
                  borderRadius: '4px',
                  margin: '26px 0 10px'
              }}
              textButton={'Đăng nhập'}
              styleTextButton={{ color: '#fff', ontSize: '15px', fontWeight: '700' }}
          >
          </ButtonComponent>
          <p>Bạn đã có tài khoản? <WrapperTextLight>Đăng nhập</WrapperTextLight></p>
        </WrapperContainerLeft>
        <WrapperContainerRight>
          <Image src={imageLogo} preview={false} alt='image-logo' height='204px' width='204px'/>
              <h4>Mua sắm tại Khai Minh Group</h4>
        </WrapperContainerRight>
      </div>
    </div>
  )
}

export default SignUpPage