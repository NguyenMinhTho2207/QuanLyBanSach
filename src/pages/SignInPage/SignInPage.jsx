import React, { useEffect, useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import imageLogo from '../../assets/images/logo-login.png'
import { Image } from 'antd'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/userMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import { jwtDecode } from "jwt-decode";
import { useDispatch } from 'react-redux'
import { updateUser } from '../../redux/slice/userSlice'

const SignInPage = () => {
  let [isShowPassword, setIsShowPassword] = useState(false);
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let dispatch = useDispatch();
  let navigate = useNavigate();
  let mutation = useMutationHooks(
    data => UserService.loginUser(data)
  )

  let { data, isPending, isSuccess } = mutation;

  useEffect(() => {
    if (isSuccess) {
      message.success();
      navigate('/');
      localStorage.setItem('access_token', data?.access_token);
      if (data?.access_token) {
        let decoded = jwtDecode(data?.access_token);

        if (decoded?.id) {
          handleGetDetailsUser(decoded?.id, data?.access_token)
        }
      }
    }
  }, [isSuccess]);

  let handleGetDetailsUser = async (id, token) => {
    let res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  }

  let handleOnChangeEmail = (value) => {
    setEmail(value);
  }

  let handleOnChangePassword = (value) => {
    setPassword(value);
  }

  let handleSignIn = () => {
    mutation.mutate({
      email,
      password
    });
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.53)', height: '100vh' }}>
      <div style={{ display: 'flex', width: '800px', height: '445px', borderRadius: '8px', background: '#fff' }}>
        <WrapperContainerLeft>
          <h1>Xin chào</h1>
          <p>Đăng nhập hoặc tạo tài khoản</p>
          <InputForm 
            style={{ marginBottom: '10px' }} 
            placeholder='abc@gmail.com' 
            value={email} 
            onChange={handleOnChangeEmail}
            autoComplete="new-password"
          >
          </InputForm>
          <div style={{ position: 'relative' }}>
            <span 
              onClick={ () => setIsShowPassword(!isShowPassword)}
              style={{ 
                zIndex: 10,
                position: 'absolute',
                top: '4px',
                right: '8px'
              }}
            >{
                isShowPassword ? (<EyeFilled></EyeFilled>) : (<EyeInvisibleFilled></EyeInvisibleFilled> )
              }
            </span>
            <form>
              <InputForm 
                placeholder='Mật khẩu' 
                type={ isShowPassword ? 'text' : 'password'} 
                value={password} 
                onChange={handleOnChangePassword}
              >
              </InputForm>
            </form>
          </div>
          { data?.status === "ERROR" && <span style={{margin: "8px 0px 0px 0px", color: "red"}}>{ data?.message }</span>}
          <Loading isLoading={isPending}>
            <ButtonComponent
              disabled={!email.length || !password.length}
              onClick={handleSignIn}
              size={40}
              styleButton={{ 
                  background: 'rgb(255, 57, 69)', 
                  height: '48px',
                  width: '100%',
                  border: 'none',
                  borderRadius: '4px',
                  margin: '20px 0 10px'
              }}
              textButton={'Đăng nhập'}
              styleTextButton={{ color: '#fff', ontSize: '15px', fontWeight: '700' }}
            >
            </ButtonComponent>
          </Loading>
          <p><WrapperTextLight>Quên mật khẩu</WrapperTextLight></p>
          <p>Chưa có tài khoản?
            <WrapperTextLight 
              onClick={() => {
                navigate('/sign-up');
              }}>
              &nbsp;Tạo tài khoản
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

export default SignInPage