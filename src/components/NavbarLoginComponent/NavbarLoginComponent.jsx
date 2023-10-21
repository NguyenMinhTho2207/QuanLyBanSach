import React, { useState, useEffect } from 'react';
import { WrapperHeaderContainerLogin, WrapperHeaderLogin } from './style'
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Badge } from 'antd';

const NavbarLoginComponent = () => {
    let navInfoArray = [
        { text: "Hotline: 0918.191.613", link: "#" },
        { text: "Địa chỉ: Số 2, đường 30, phường Tân Quy, quận 7, Tp.HCM", link: "#" },
    ];

    let navButtonArray = [
        { text: "Đăng ký", link: "/register" },
        { text: "Đăng nhập", link: "/login" },
    ];

    const [isFixed, setIsFixed] = useState(false);

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
                            <a href={navItem.link}>{navItem.text}</a>
                        </li>
                    ))}
                </WrapperHeaderLogin>
                <WrapperHeaderLogin style={{cursor: 'pointer', color: '#fff'}}>
                    <Badge count={4} size='small' style={{top: '5px', right: '5px'}}>
                        <ShoppingCartOutlined style={{color: '#fff', fontSize: '30px'}}/>
                    </Badge>
                    <span style={{marginLeft: '4px'}}>Giỏ Hàng</span>
                </WrapperHeaderLogin>
                <WrapperHeaderLogin>
                    {navButtonArray.map((navItem, index) => (
                        <li key={index}>
                            <a href={navItem.link}>{navItem.text}</a>
                        </li>
                    ))}
                </WrapperHeaderLogin>
            </WrapperHeaderContainerLogin>
        </div>
    )
}

export default NavbarLoginComponent