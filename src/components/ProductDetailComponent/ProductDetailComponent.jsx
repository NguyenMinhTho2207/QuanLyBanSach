import { Col, Image, Rate, Row } from 'antd'
import React, { useState } from 'react'
import ImageProductSmall from '../../assets/images/products/Phu-kien-ban-bong2.jpg'
import { WrapperAddresstProduct, WrapperColImage, WrapperInputNumber, WrapperPriceProduct, WrapperPriceTextProduct, WrapperQualityProduct, WrapperStyleImageSmall, WrapperStyleNameProduct, WrapperStyleTextSell } from '../../pages/ProductDetailPage/style'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const ProductDetailComponent = ({productId}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [quantityProduct, setQuantityProduct] = useState(1);
    const user = useSelector((state) => state.user);
    const onChange = (value) => {
        setQuantityProduct(value);
    };

    const fetchGetDetailsProduct = async (context) => {
        const id = context?.queryKey && context?.queryKey[1];

        if (id) {
            const res = await ProductService.getDetailsProduct(id);
            return res.data;
        }
    }

    const handleChangeCount = (type) => {
        if (type === 'increase') {
            setQuantityProduct((quantityProduct) + 1);
        }
        else {
            if (quantityProduct > 1) {
                setQuantityProduct(quantityProduct - 1);
            }
        }
    }

    const handleAddOrderProduct = () => {
        if (!user?.id) {
            navigate(`/sign-in`, {state: location?.pathname});
        }
    }

    const { isLoading, data: productDetails } = useQuery({
        queryKey: ['product-details', productId],
        queryFn: fetchGetDetailsProduct,
        config: {
            enabled: productId !== undefined,
        },
    });

    const handleKeyPress = (e) => {
        // Cho phép các phím số, phím mũi tên lên, xuống, và phím xóa
        const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'ArrowUp', 'ArrowDown', 'Backspace'];
    
        if (!allowedKeys.includes(e.key)) {
            e.preventDefault();
        }
    };

    return (
        <Row style={{padding: '16px', backgroundColor: 'white', borderRadius: '8px' }}>
            <Col span={10} style={{ borderRight: '1px solid #e5e5e5', paddingRight: '8px' }}>
                <Image src={productDetails?.image} alt="image product" preview={false} />
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
                <WrapperStyleNameProduct>{productDetails?.product_name}</WrapperStyleNameProduct>
                <div>
                    <div>
                        <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating}/>
                        <WrapperStyleTextSell> | Đã bán 1000+</WrapperStyleTextSell>
                    </div>
                    <WrapperPriceProduct>
                        <WrapperPriceTextProduct>{Number(productDetails?.price).toLocaleString('vi-VN')} VNĐ</WrapperPriceTextProduct>
                    </WrapperPriceProduct>
                    <WrapperAddresstProduct>
                        <span>Giao đến&nbsp;</span>
                        <span className='address'>{user?.address}</span>
                        <span className='change-address'> - Đổi địa chỉ</span>
                    </WrapperAddresstProduct>
                    <div style={{ margin: '10px 0 20px', padding: '10px 0', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5',}}>
                        <div style={{ marginBottom: '10px' }}>Số lượng</div>
                        <WrapperQualityProduct>
                            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease')}>
                                <MinusOutlined style={{ color: '#000', fontSize: '20px' }} />
                            </button>
                            <WrapperInputNumber onChange={onChange} value={quantityProduct} min={1} type='number' onKeyDown={handleKeyPress}/>
                            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase')}>
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
                            onClick={handleAddOrderProduct}
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