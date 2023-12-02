import React, { useEffect, useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import imageLogo from '../../assets/images/logo-login.png'
import { Image } from 'antd'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import { jwtDecode } from "jwt-decode";
import { useDispatch } from 'react-redux'
import { updateUser } from '../../redux/slice/userSlice'

const SignInPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const mutation = useMutationHooks(
    data => UserService.loginUser(data)
  );

  const { data, isPending, isSuccess } = mutation;

  useEffect(() => {
    if (data?.message === "Success") {
      if (location?.state) {
        navigate(location?.state);
      }
      else {
        navigate('/');
      }
      
      message.success("Đăng nhập thành công");

      localStorage.setItem('access_token', JSON.stringify(data?.access_token));
      
      if (data?.access_token) {
        const decoded = jwtDecode(data?.access_token);

        if (decoded?.id) {
          handleGetDetailsUser(decoded?.id, data?.access_token)
        }
      }
    }
  }, [isSuccess]);

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  }

  const handleOnChangeEmail = (value) => {
    setEmail(value);
  }

  const handleOnChangePassword = (value) => {
    setPassword(value);
  }

  const handleSignIn = () => {
    mutation.mutate({
      email,
      password
    });
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSignIn();
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.53)', height: '100vh' }}>
      <div style={{ display: 'flex', width: '800px', height: '445px', borderRadius: '8px', background: '#fff' }}>
        <WrapperContainerLeft onKeyDown={handleKeyDown}>
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
                autoComplete='off' 
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