import { Col, Image, Row } from 'antd'
import React from 'react'
import ImageProduct from '../../assets/images/products/bfdb22e1a3d97b8722c8-1.jpg'
import ImageProductSmall from '../../assets/images/products/Phu-kien-ban-bong2.jpg'
import { WrapperAddresstProduct, WrapperColImage, WrapperInputNumber, WrapperPriceProduct, WrapperPriceTextProduct, WrapperQualityProduct, WrapperStyleImageSmall, WrapperStyleNameProduct, WrapperStyleTextSell } from '../../pages/ProductDetailPage/style'
import { StarFilled, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import ButtonComponent from '../ButtonComponent/ButtonComponent'

const ProductDetailComponent = () => {
    const onChange = () => {}

    return (
        <Row style={{padding: '16px', backgroundColor: 'white', borderRadius: '8px' }}>
            <Col span={10} style={{ borderRight: '1px solid #e5e5e5', paddingRight: '8px' }}>
                <Image src={ImageProduct} alt="image product" preview={false} />
                <Row style={{paddingTop: '10px', justifyContent: 'space-between'}}>
                    <WrapperColImage span={4}>
                        <WrapperStyleImageSmall src={ImageProductSmall} alt="image small" preview={false} />
                    </WrapperColImage>
                    <WrapperColImage span={4}>
                        <WrapperStyleImageSmall src={ImageProductSmall} alt="image small" preview={false} />
                    </WrapperColImage>
                    <WrapperColImage span={4}>
                        <WrapperStyleImageSmall src={ImageProductSmall} alt="image small" preview={false} />
                    </WrapperColImage>
                    <WrapperColImage span={4}>
                        <WrapperStyleImageSmall src={ImageProductSmall} alt="image small" preview={false} />
                    </WrapperColImage>
                    <WrapperColImage span={4}>
                        <WrapperStyleImageSmall src={ImageProductSmall} alt="image small" preview={false} />
                    </WrapperColImage>
                </Row>
            </Col>
            <Col span={14} style={{ paddingLeft: '10px' }}>
                <WrapperStyleNameProduct>Cơ cấu tay gắp Robot nâng hạ sản phẩm</WrapperStyleNameProduct>
                <div>
                    <StarFilled style={{fontSize: '12px', color: 'rgb(253, 216, 54)'}} />
                    <StarFilled style={{fontSize: '12px', color: 'rgb(253, 216, 54)'}} />
                    <StarFilled style={{fontSize: '12px', color: 'rgb(253, 216, 54)'}} />
                    <StarFilled style={{fontSize: '12px', color: 'rgb(253, 216, 54)'}} />
                    <StarFilled style={{fontSize: '12px', color: 'rgb(253, 216, 54)'}} />
                    <WrapperStyleTextSell> | Đã bán 1000+</WrapperStyleTextSell>
                    <WrapperPriceProduct>
                        <WrapperPriceTextProduct>200.000 đ</WrapperPriceTextProduct>
                    </WrapperPriceProduct>
                    <WrapperAddresstProduct>
                        <span>Giao đến</span>
                        <span className='address'>Q. 1, P. Bến Nghé, Hồ Chí Minh</span>
                        <span className='change-address'> - Đổi địa chỉ</span>
                    </WrapperAddresstProduct>
                    <div style={{ margin: '10px 0 20px', padding: '10px 0', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5',}}>
                        <div style={{ marginBottom: '10px' }}>Số lượng</div>
                        <WrapperQualityProduct>
                            <button style={{ border: 'none', background: 'transparent' }}>
                                <MinusOutlined style={{ color: '#000', fontSize: '20px' }} />
                            </button>
                            <WrapperInputNumber defaultValue={3} onChange={onChange} />
                            <button style={{ border: 'none', background: 'transparent' }}>
                                <PlusOutlined style={{ color: '#000', fontSize: '20px' }} />
                            </button>
                        </WrapperQualityProduct>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                        <ButtonComponent
                            bordered={false}
                            size={40}
                            styleButton={{ 
                                background: 'rgb(255, 57, 69)', 
                                height: '48px',
                                width: '220px',
                                border: 'none',
                                borderRadius: '4px'
                            }}
                            textButton={'Chọn mua'}
                            styleTextButton={{ color: '#fff', ontSize: '15px', fontWeight: '700' }}
                        >
                        </ButtonComponent>

                        <ButtonComponent
                            size={40}
                            styleButton={{ 
                                background: '#fff', 
                                height: '48px',
                                width: '220px',
                                border: '1px solid rgb(13, 92, 182)',
                                borderRadius: '4px'
                            }}
                            textButton={'Mua trả sau'}
                            styleTextButton={{ color: 'rgb(13, 92, 182)', fontSize: '15px' }}
                        >
                        </ButtonComponent>
                    </div>
                </div>
            </Col>
        </Row>
    )
}

export default ProductDetailComponent