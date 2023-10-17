import { Card } from "antd";
import { styled } from "styled-components";

export const WrapperCardStyle = styled(Card) `
    width: 200px;
    & img {
        height: 200px;
        width: 200px;
    }
    position: relative;
`

export const WrapperImageStyle = styled.img `
    position: absolute;
    top: -1px;
    left: -1px;
    height: 14px !important;
    width: 68px !important;
`

export const StyleNameProduct = styled.div `
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    color: rgb(56, 56, 61)
`

export const WrapperReportText = styled.div `
    font-size: 14px;
    color: rgb(128, 128, 137);
    display: flex;
    align-items: center;
    margin: 6px 0 0px;
`

export const WrapperPriceText = styled.div `
    font-size: 16px;
    font-weight: 500;
    color: rgb(255, 66, 78);
`

export const WrapperPriceDiscountText = styled.span `
    font-size: 12px;
    font-weight: 500;
    color: rgb(255, 66, 78);
`