import React, { useState, useEffect } from 'react';
import { WrapperContentPopup, WrapperHeaderContainerLogin, WrapperHeaderLogin, WrapperPopover } from './style'
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Badge } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as UserService from '../../services/UserService'
import { useDispatch } from 'react-redux'
import { resetUser } from '../../redux/slice/userSlice'
import Loading from '../LoadingComponent/Loading';

const NavbarLoginComponent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state.user);
    const [userName, setUserName] = useState('');
    const [userAvatar, setUserAvatar] = useState('');

    const navInfoArray = [
        { text: "Hotline: 0918.191.613", link: "#" },
        { text: "Địa chỉ: Số 2, đường 30, phường Tân Quy, quận 7, Tp.HCM", link: "#" },
    ];

    const navButtonArray = [
        { text: "Đăng ký", link: "/sign-up" },
        { text: "Đăng nhập", link: "/sign-in" },
    ];

    const [isFixed, setIsFixed] = useState(false);

    useEffect(() => {
        setLoading(true);
        setUserAvatar(user?.avatar);
        setUserName(user?.name);
        setLoading(false);
    }, [user?.name])

    const handleLogout = async () => {
        setLoading(true);
        await UserService.logoutUser();
        dispatch(resetUser());
        setLoading(false);
        navigate("/");
    }

    const content = (
        <div>
          <WrapperContentPopup onClick={() => {navigate("/profile-user")}}>Thông tin người dùng</WrapperContentPopup>
          <WrapperContentPopup onClick={handleLogout}>Đăng xuất</WrapperContentPopup>
        </div>
      );

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const threshold = window.innerHeight * 0.2;

            setIsFixed(scrollPosition > threshold);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div style={{ position: isFixed ? 'fixed' : 'static', top: 0, left: 0, right: 0, zIndex: 999 }}>
            <WrapperHeaderContainerLogin>
                <WrapperHeaderLogin>
                    {navInfoArray.map((navItem, index) => (
                        <li key={index}>
                            <a
                                href="#"
                                onClick={() => {
                                    navigate(navItem.link);
                                }}
                            >
                                {navItem.text}
                            </a>
                        </li>
                    ))}
                </WrapperHeaderLogin>
                <WrapperHeaderLogin style={{cursor: 'pointer', color: '#fff'}}>
                    <Badge count={4} size='small' style={{top: '5px', right: '5px'}}>
                        <ShoppingCartOutlined style={{color: '#fff', fontSize: '30px'}}/>
                    </Badge>
                    <span style={{marginLeft: '4px'}}>Giỏ Hàng</span>
                </WrapperHeaderLogin>
                <Loading isLoading={loading}>
                    { user?.access_token ? (
                        <>
                            <WrapperHeaderLogin>
                                {userAvatar ? (
                                    <img src={userAvatar} alt="avatar" style={{height: '40px', width: '40px', borderRadius: '50%', objectFit: 'cover', marginRight: '10px'}}/>
                                ) : (
                                    <UserOutlined style={{fontSize: '30px', color: 'white', margin: '0 10px'}}/>
                                )}
                                <WrapperPopover content={content} trigger="click">
                                    <div style={{color: 'white', cursor: 'pointer'}}>{userName?.length ? userName : user?.email}</div>
                                </WrapperPopover>
                            </WrapperHeaderLogin>
                            
                        </>
                    ) : (
                        <WrapperHeaderLogin>
                            {navButtonArray.map((navItem, index) => (
                                <li key={index}>
                                    <a
                                        href="#"
                                        onClick={() => {
                                            navigate(navItem.link);
                                        }}
                                    >
                                        {navItem.text}
                                    </a>
                                </li>
                            ))}
                        </WrapperHeaderLogin>
                    )}
                </Loading>
                
            </WrapperHeaderContainerLogin>
        </div>
    )
}

export default NavbarLoginComponent