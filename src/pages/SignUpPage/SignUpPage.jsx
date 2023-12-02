import React, { useEffect, useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import imageLogo from '../../assets/images/logo-login.png'
import { Image } from 'antd'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'

const SignUpPage = () => {
  let [isShowPassword, setIsShowPassword] = useState(false)
  let [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)

  let navigate = useNavigate();

  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [confirmPassword, setConfirmPassword] = useState("");

  let mutation = useMutationHooks(
    data => UserService.signUpUser(data)
  )

  let { data, isPending, isSuccess, isError } = mutation;

  useEffect(() => {
    if (data?.message === "Success") {
      message.success('Đăng ký thành công');
      navigate('/sign-in');
    }
    else if (isError) {
      
    }
  }, [isSuccess, isError, navigate]);

  let handleOnChangeEmail = (value) => {
    setEmail(value);
  }

  let handleOnChangePassword = (value) => {
    setPassword(value);
  }

  let handleOnChangeConfirmPassword = (value) => {
    setConfirmPassword(value);
  }

  let handleSignUp = () => {
    mutation.mutate({
      email, 
      password, 
      confirmPassword
    })
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSignUp();
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.53)', height: '100vh' }}>
      <div style={{ display: 'flex', width: '800px', height: '445px', borderRadius: '8px', background: '#fff' }}>
        <WrapperContainerLeft onKeyDown={handleKeyDown}>
          <h1>Tạo tài khoản</h1>
          <p>Tạo tài khoản hoặc đăng nhập</p>
          <InputForm style={{ marginBottom: '10px' }} placeholder='abc@gmail.com' value={email} onChange={handleOnChangeEmail}></InputForm>
          <div style={{ position: 'relative' }}>
            <span 
              onClick={ () => setIsShowPassword(!isShowPassword)}
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
            <form>
              <InputForm 
                style={{ marginBottom: '10px' }} 
                placeholder='Mật khẩu' 
                type={ isShowPassword ? 'text' : 'password'}
                value={password}
                onChange={handleOnChangePassword}
                ></InputForm>
            </form>
          </div>
          <div style={{ position: 'relative' }}>
            <span 
              onClick={ () => setIsShowConfirmPassword(!isShowConfirmPassword)}
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
            <form>
              <InputForm 
                placeholder='Nhập lại mật khẩu' 
                type={ isShowConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={handleOnChangeConfirmPassword}
                ></InputForm>
            </form>
          </div>
          { data?.status === "ERROR" && <span style={{margin: "8px 0px 0px 0px", color: "red"}}>{ data?.message }</span>}
          <Loading isLoading={isPending}>
            <ButtonComponent
              disabled={!email.length || !password.length || !confirmPassword}
              onClick={handleSignUp}
              size={40}
              styleButton={{
                  background: 'rgb(255, 57, 69)', 
                  height: '48px',
                  width: '100%',
                  border: 'none',
                  borderRadius: '4px',
                  margin: '20px 0 10px'
              }}
              textButton={'Đăng ký'}
              styleTextButton={{ color: '#fff', ontSize: '15px', fontWeight: '700' }}
            >
            </ButtonComponent>
          </Loading>
          <p>Bạn đã có tài khoản? 
            <WrapperTextLight 
              onClick={() => {
                navigate('/sign-in');
              }}>
              &nbsp;Đăng nhập
            </WrapperTextLight>
          </p>
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