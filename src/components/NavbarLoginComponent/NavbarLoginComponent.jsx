import React from 'react'
import { WrapperHeaderContainerLogin, WrapperHeaderLogin } from './style'

const NavbarLoginComponent = () => {
    let navInfoArray = [
        { text: "Hotline: 0918.191.613", link: "#" },
        { text: "Địa chỉ: Số 2, đường 30, phường Tân Quy, quận 7, Tp.HCM", link: "#" },
    ];

    let navButtonArray = [
        { text: "Đăng ký", link: "/register" },
        { text: "Đăng nhập", link: "/login" },
    ];

    return (
        <div>
            <WrapperHeaderContainerLogin>
                <WrapperHeaderLogin>
                    {navInfoArray.map((navItem, index) => (
                        <li key={index}>
                            <a href={navItem.link}>{navItem.text}</a>
                        </li>
                    ))}
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