
import { styled } from "styled-components";

export const WrapperHeaderContainerLogin = styled.div `
    display: flex;
    justify-content: space-between;
    padding: 2px 250px;
    background-color: #FB5431;
`

export const WrapperHeaderLogin = styled.ul `
    display: flex;
    background-color: #FB5431;
    margin: 0;
    font-size: 14px;
    list-style: none;

    li {
        a {
            display: flex;
            padding: 0 10px;
            text-decoration: none;
            color: white;
            transition: background-color 0.3s;

            &:hover {
                color: #0077C0;
            }
        }
        }
    }
`