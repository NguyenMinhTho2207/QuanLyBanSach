import React, { useEffect, useState } from 'react'
import { WrapperContentProfile, WrapperHeader, WrapperInput, WrapperLabel, WrapperUploadFile } from './style'
import FooterComponent from '../../components/FooterComponent/FooterComponent'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { useDispatch, useSelector } from 'react-redux'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/userMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import { updateUser } from '../../redux/slice/userSlice'
import { UploadOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { getBase64 } from '../../utils'
import { useNavigate } from 'react-router-dom'

const ProfilePage = () => {
  const user = useSelector((state) => state.user);
  console.log("user: ", user);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const mutation = useMutationHooks(
    (data) => { 
      const { id, access_token, ...rests } = data;
      UserService.updateUser(id, rests, access_token);
    }
  );

  const { data, isSuccess, isError, isPending } = mutation;

  useEffect(() => {
    setName(user?.name);
    setEmail(user?.email);
    setPhoneNumber(user?.phone_number);
    setAddress(user?.address);
    setAvatar(user?.avatar);
  }, [user]);

  useEffect(() => {
    if(isSuccess) {
      message.success("Cập nhật thành công");
      handleGetDetailsUser(user?.id, user?.access_token)
    }
    else if (isError) {
      message.error("Có gì đó sai sai");
    }
  }, [isSuccess, isError]);

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  }

  const handleOnChangeName = (value) => {
    setName(value);
  }

  const handleOnChangeEmail = (value) => {
    setEmail(value);
  }

  const handleOnChangePhone = (value) => {
    setPhoneNumber(value);
  }

  const handleOnChangeAddress = (value) => {
    setAddress(value);
  }

  const handleOnChangeAvatar = async ({fileList}) => {
    const file = fileList[0];
    console.log(file);
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setAvatar(file.preview);
  }

  const handleUpdate = () => {
    mutation.mutate({ id: user?.id, name, email, phone_number, address, avatar, access_token: user?.access_token})
  }

  return (
    <div style={{ backgroundColor: '#efefef' }}>
      <div style={{ padding: '20px 200px 0px 200px', height: '500px' }}>
        <WrapperHeader>Thông tin người dùng</WrapperHeader>
        <Loading isLoading={isPending}>
          <WrapperContentProfile>
          <div style={{display: 'flex', justifyContent: 'end', gap: '20px'}}>
              <ButtonComponent
                onClick={handleUpdate}
                size={40}
                styleButton={{ 
                    height: '30px',
                    width: 'fit-content',
                    borderRadius: '4px',
                    padding: '2px 4px 6px'
                }}
                textButton={'Cập nhật'}
                styleTextButton={{ color: 'rgb(26, 148, 255)', ontSize: '15px', fontWeight: '700' }}
              >
              </ButtonComponent>
              <ButtonComponent
                onClick={() => {navigate('/')}}
                size={40}
                styleButton={{ 
                    height: '30px',
                    width: 'fit-content',
                    borderRadius: '4px',
                    padding: '2px 4px 6px'
                }}
                textButton={'Hủy'}
                styleTextButton={{ color: 'red', ontSize: '15px', fontWeight: '700' }}
              >
              </ButtonComponent>
            </div>
            {/* Avatar */}
            <WrapperInput>
              <WrapperLabel htmlFor="avatar">Ảnh đại diện:</WrapperLabel>
              <WrapperUploadFile onChange={handleOnChangeAvatar} maxCount={1}>
                <Button icon={<UploadOutlined />}>Select File</Button>
              </WrapperUploadFile>
              {avatar && (
                <img src={avatar} style={{height: '100px', width: '100px', borderRadius: '50%', objectFit: 'cover'}} alt='avatar'/>
              )}
            </WrapperInput>
            {/* Email */}
            <WrapperInput>
              <WrapperLabel htmlFor="name">Tên người dùng:</WrapperLabel>
              <InputForm placeholder='Tên người dùng'  style={{width: '300px'}} id="name" value={name} onChange={handleOnChangeName}></InputForm>
            </WrapperInput>
            {/* Email */}
            <WrapperInput>
              <WrapperLabel htmlFor="email">Email:</WrapperLabel>
              <InputForm placeholder='Email' style={{width: '300px'}} id="email" value={email} onChange={handleOnChangeEmail}></InputForm>
            </WrapperInput>
            {/* Phone */}
            <WrapperInput>
              <WrapperLabel htmlFor="phone">Số điện thoại:</WrapperLabel>
              <InputForm placeholder='Số điện thoại' style={{width: '300px'}} id="phone" value={phone_number} onChange={handleOnChangePhone}></InputForm>
            </WrapperInput>
            {/* Address */}
            <WrapperInput>
              <WrapperLabel htmlFor="address">Địa chỉ:</WrapperLabel>
              <InputForm placeholder='Địa chỉ' style={{width: '300px'}} id="address" value={address} onChange={handleOnChangeAddress}></InputForm>
            </WrapperInput>
          </WrapperContentProfile>
        </Loading>
      </div>
      <FooterComponent></FooterComponent>
    </div>
  )
}

export default ProfilePage