import { Row } from "antd";
import { styled } from "styled-components";

export const WrapperNavbarMenuContainer = styled(Row) `
    align-items: center;
    background-color: #2196F3;
    height: 50px;
`

export const WrapperNavbarMenuContain = styled.ul `
    display: flex;
    list-style: none;
    color: white;
    font-weight: 700;
    font-size: 14px;
    padding: 0 200px;
    font-size: 16px;
    line-height: 16px;
    margin: 0;

    li {
        a {
            height: 50px; /* Đặt chiều cao của thẻ a */
            display: flex;
            align-items: center;
            justify-content: center; Thêm khoảng cách bên trái và phải cho thẻ a */
            text-decoration: none; /* Loại bỏ gạch chân mặc định */
            color: white; /* Đặt màu sắc */
            transition: background-color 0.3s; /* Thêm hiệu ứng chuyển đổi cho màu nền */

            &:hover {
                background-color: #0077C0; /* Màu nền xanh đậm khi hover */
            }
        }
    }
`
