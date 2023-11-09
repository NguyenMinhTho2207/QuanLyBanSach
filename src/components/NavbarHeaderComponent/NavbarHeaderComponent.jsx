import React, { useState, useEffect } from 'react';
import { Col } from 'antd';
import { WrapperNavbarMenuContain, WrapperNavbarMenuContainer } from '../NavbarHeaderComponent/style';

const NavbarHeaderComponent = () => {
    let navArray = [
        { text: "Giới thiệu", link: "/introduce" },
        { text: "Sản phẩm", link: "/products" },
        { text: "Khóa học online", link: "#" },
        { text: "Kho sách hướng thiện", link: "#" },
        { text: "Đề tài khoa học kỹ thuật", link: "#" },
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
        <div style={{ position: isFixed ? 'fixed' : 'static', top: '40px', left: 0, right: 0, zIndex: 999 }}>
            <WrapperNavbarMenuContainer>
                <Col span={24}>
                    <WrapperNavbarMenuContain>
                        {navArray.map((navItem, index) => (
                            <Col span={5}>
                                <li key={index}>
                                    <a href={navItem.link}>{navItem.text}</a>
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
