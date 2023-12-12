import React, { useState, useEffect } from 'react';
import { Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { WrapperNavbarMenuContain, WrapperNavbarMenuContainer } from '../NavbarHeaderComponent/style';

const NavbarHeaderComponent = () => {
    let navArray = [
        { text: "Trang chủ", link: "/" },
        { text: "Sản phẩm", link: "/products" },
        { text: "Khóa học online", link: "/courses" },
        { text: "Kho sách hướng thiện", link: "#" },
        { text: "Đề tài khoa học kỹ thuật", link: "#1" },
    ];

    const [isFixed, setIsFixed] = useState(false);
    const [activeLink, setActiveLink] = useState("/");
    const navigate = useNavigate();

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

    const handleNavigation = (link, event) => {
        event.preventDefault();

        // Use the navigate function to navigate to the specified link
        navigate(link);

        // Set the active link
        setActiveLink(link);
    };

    return (
        <div style={{ position: isFixed ? 'fixed' : 'static', top: '40px', left: 0, right: 0, zIndex: 999 }}>
            <WrapperNavbarMenuContainer>
                <Col span={24}>
                    <WrapperNavbarMenuContain>
                        {navArray.map((navItem, index) => (
                            <Col span={5} key={index}>
                                <li>
                                    <a
                                        href={navItem.link}
                                        onClick={(event) => handleNavigation(navItem.link, event)}
                                        className={activeLink === navItem.link ? 'active' : ''}
                                    >
                                        {navItem.text}
                                    </a>
                                </li>
                            </Col>
                        ))}
                    </WrapperNavbarMenuContain>
                </Col>
            </WrapperNavbarMenuContainer>
        </div>
    );
}

export default NavbarHeaderComponent;
