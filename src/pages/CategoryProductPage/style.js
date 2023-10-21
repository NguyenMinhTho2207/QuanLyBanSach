import { Col } from "antd";
import { styled } from "styled-components";

export const WrapperProducts = styled.div `
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
`

export const WrapperNavbar = styled(Col) `
    background: #cccc;
    margin-right: 10px;
    padding: 10px;
    border-radius: 4px;
    height: fit-content;
    width: 200px;
`