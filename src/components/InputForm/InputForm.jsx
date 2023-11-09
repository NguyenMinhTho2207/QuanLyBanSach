import React from 'react'
import { WrapperInputStyle } from './style'

const InputForm = (props) => {
    let { placeholder = 'Nhập text', ...rests } = props
    let handleOnChangeInput = (e) => {
        props.onChange(e.target.value);
    }

    return (
        <WrapperInputStyle placeholder={placeholder} value={props.value} {...rests} onChange={handleOnChangeInput}></WrapperInputStyle>
    )
}

export default InputForm