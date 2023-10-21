import { styled } from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

export const WrapperButtonMore = styled(ButtonComponent)`
    &:hover {
        color: #fff;
        background: rgb(13, 92, 182);
        span {
            color: #fff;
        }
    }
    
    width: 100%;
    text-align: center;
`

export const WrapperProducts = styled.div `
    display: flex;
    justify-content: center;
    gap: 14px;
    flex-wrap: wrap;
`