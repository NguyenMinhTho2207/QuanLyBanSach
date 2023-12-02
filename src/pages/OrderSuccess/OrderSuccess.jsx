import React from 'react'
import { Label, WrapperInfo, WrapperContainer, WrapperValue, WrapperItemOrder, WrapperItemOrderInfo } from './style';
import { useSelector } from 'react-redux';
import Loading from '../../components/LoadingComponent/Loading';
import { convertPrice } from '../../utils';
import { useLocation } from 'react-router-dom';
import { orderConstant } from '../../constant';

const OrderSuccess = () => {
    const order = useSelector((state) => state.order);
    const location = useLocation();
    const { state } = location;

    return (
        <div style={{background: '#f5f5fa', with: '100%', height: '100vh'}}>
            <Loading isLoading={false}>
                <div style={{height: '100%', width: '1270px', margin: '0 auto'}}>
                    <h3 style={{fontWeight: 'bold'}}>Đơn hàng đã đặt thành công</h3>
                    <div style={{ display: 'flex', justifyContent: 'center'}}>
                        <WrapperContainer>
                            <WrapperInfo>
                                <Label>Phương thức giao hàng</Label>
                                <WrapperValue>
                                    <span style={{color: '#ea8500', fontWeight: 'bold'}}>{orderConstant.delivery[state?.delivery]}</span> Giao hàng tiết kiệm
                                </WrapperValue>
                            </WrapperInfo>
                            <WrapperInfo>
                                <Label>Phương thức thanh toán</Label>
                                <WrapperValue>
                                    {orderConstant.payment[state?.payment]}
                                    Thanh toán tiền mặt khi nhận hàng
                                </WrapperValue>
                            </WrapperInfo>
                            <WrapperItemOrderInfo>
                                { state.orders?.map((order) => {
                                    return (
                                        <WrapperItemOrder key={order?.product_id}>
                                            <div style={{width: '390px', display: 'flex', alignItems: 'center', gap: 4}}> 
                                                <img src={order?.image} style={{width: '77px', height: '79px', objectFit: 'cover'}}/>
                                                <div style={{
                                                    width: 260,
                                                    overflow: 'hidden',
                                                    textOverflow:'ellipsis',
                                                    whiteSpace:'nowrap'
                                                }}>{order?.product_name}</div>
                                            </div>
                                            <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                                <span>
                                                    <span style={{ fontSize: '13px', color: '#242424' }}>Giá Tiền: {convertPrice(order?.unit_price)}</span>
                                                </span>
                                                <span>
                                                    <span style={{ fontSize: '13px', color: '#242424' }}>Số lượng: {order?.quantity}</span>
                                                </span>
                                                <span>
                                                    <span style={{ fontSize: '13px', color: '#242424' }}>Tổng tiền: {order?.subtotal}</span>
                                                </span>
                                            </div>
                                        </WrapperItemOrder>
                                    )
                                })}
                            </WrapperItemOrderInfo>
                            <div style={{float: 'right'}}>
                                <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'rgb(254, 56, 52)' }}>Tổng tiền: {convertPrice(state?.totalPriceMemo)}</span>
                            </div>
                        </WrapperContainer>
                    </div>
                </div>
            </Loading>
        </div>
    )
}

export default OrderSuccess