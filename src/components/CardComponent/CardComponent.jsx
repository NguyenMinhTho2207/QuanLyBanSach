import React from 'react'
import { StyleNameProduct, WrapperCardStyle, WrapperImageStyle, WrapperPriceDiscountText, WrapperPriceText, WrapperReportText, WrapperStyleTextSell } from './style'
import { StarFilled } from '@ant-design/icons';
import logo from '../../assets/images/chinhhang.png'

const CardComponent = (props) => {
    const { quantity, description, image, productName, price, rating, categoryId, discount, soldQuantity } = props;

    return (
        <WrapperCardStyle
            hoverable
            headStyle={{width: '200px', height: '200px'}}
            style={{ width: 200 }}
            bodyStyle={{ padding: '10px'}}
            cover={<img alt="example" src={image} />}
        >
            <WrapperImageStyle src={logo} alt='chinhhang'/>
            <StyleNameProduct>{productName}</StyleNameProduct>
            <WrapperReportText>
                <span style={{marginRight: '4px'}}>
                    <span>{rating}</span><StarFilled style={{fontSize: '12px', color: 'rgb(253, 216, 54)'}} />
                </span>
                <WrapperStyleTextSell> | Đã bán { soldQuantity || 1000 }+</WrapperStyleTextSell>
            </WrapperReportText>
            <WrapperPriceText>
                <span style={{ marginRight: '8px' }}>{Number(price).toLocaleString('vi-VN')} VNĐ</span>
                <WrapperPriceDiscountText>-{ discount || 5 }%</WrapperPriceDiscountText>
            </WrapperPriceText>
        </WrapperCardStyle>
  )
}

export default CardComponent