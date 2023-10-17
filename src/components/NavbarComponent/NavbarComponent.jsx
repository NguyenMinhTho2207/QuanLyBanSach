import React from 'react'
import { WrapperContent, WrapperLabelText, WrapperTextValue } from './style'
import { Checkbox } from 'antd'

const NavbarComponent = () => {
    const onChange = () => {}
    const renderContent = (type, options) => {
        switch(type) {
            case 'text':
                return options.map((option) => {
                    return <WrapperTextValue>{option}</WrapperTextValue>
                })
            case 'checkbox':
                return (
                    <Checkbox.Group style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }} onChange={onChange}>
                        {options.map((option) => {
                            return <Checkbox value={option.value}>{option.label}</Checkbox> 
                        })}
                    </Checkbox.Group>
                )
            default:
                return {}
        }
    }

    return (
        <div>
            <WrapperLabelText>Danh Mục</WrapperLabelText>
            <WrapperContent>
                { renderContent('text', ['Tủ lạnh', 'TV', 'Máy giặt']) }
            </WrapperContent>
        </div>
    )
}

export default NavbarComponent