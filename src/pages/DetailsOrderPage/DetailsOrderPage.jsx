import React from 'react'
import { WrapperAllPrice, WrapperContentInfo, WrapperHeaderUser, WrapperInfoUser, WrapperItem, WrapperItemLabel, WrapperLabel, WrapperNameProduct, WrapperProduct, WrapperStyleContent } from './style'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import * as  OrderService from '../../services/OrderService';
import { useQuery } from '@tanstack/react-query'
import { orderConstant } from '../../constant'
import { convertPrice } from '../../utils'
import { useMemo } from 'react'
import Loading from '../../components/LoadingComponent/Loading'
import FooterComponent from '../../components/FooterComponent/FooterComponent';
import { useSelector } from 'react-redux';

const DetailsOrderPage = () => {
  const params = useParams()
  const location = useLocation()
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const { state } = location
  const { id } = params

  const fetchDetailsOrder = async () => {
    const res = await OrderService.getDetailsOrder(id, state?.token)
    return res.data
  }

  const queryOrder = useQuery({
    queryKey: ['orders-details'],
    queryFn: fetchDetailsOrder,
    retry: 3,
    retryDelay: 1000,
    enabled: Boolean(state?.token)
  });

  const { isLoading, data } = queryOrder;

  useEffect(() => {
    // Khi component được hiển thị, cuộn lên đầu trang
    window.scrollTo(0, 0);
  }, []); // [] đảm bảo useEffect chỉ chạy sau khi component được render lần đầu tiên

  const priceMemo = useMemo(() => {
    const result = data?.orderDetails?.reduce((total, cur) => {
      return total + ((cur.price * cur.amount))
    },0)
    return result
  },[data])

  return (
   <Loading isLoading={isLoading}>
        <div style={{width: '100%', background: '#f5f5fa'}}>
      <div style={{ width: '1270px', margin: '0 auto', height: '1270px'}}>
        <h4><span style={{cursor: 'pointer'}} onClick={() => {navigate("/my-order", {state: {
                id: user?.id,
                token: user?.access_token
            }})}}>Đơn hàng của tôi</span> - Chi tiết đơn hàng</h4>
        <WrapperHeaderUser>
          <WrapperInfoUser>
            <WrapperLabel>Địa chỉ người nhận</WrapperLabel>
            <WrapperContentInfo>
              <div className='name-info'>{data?.name}</div>
              <div className='address-info'><span>Địa chỉ: </span> {data?.shipping_address}</div>
              <div className='phone-info'><span>Điện thoại: </span> {data?.phone_number}</div>
            </WrapperContentInfo>
          </WrapperInfoUser>
          <WrapperInfoUser>
            <WrapperLabel>Hình thức giao hàng</WrapperLabel>
            <WrapperContentInfo>
              <div className='delivery-info'><span className='name-delivery'>FAST </span>Giao hàng tiết kiệm</div>
              <div className='delivery-fee'><span>Phí giao hàng: </span> {data?.shipping_price}</div>
            </WrapperContentInfo>
          </WrapperInfoUser>
          <WrapperInfoUser>
            <WrapperLabel>Hình thức thanh toán</WrapperLabel>
            <WrapperContentInfo>
              <div className='payment-info'>{orderConstant.payment[data?.payment_method]}</div>
              <div className='status-payment'>{data?.is_paid ? 'Đã thanh toán' : 'Chưa thanh toán'}</div>
            </WrapperContentInfo>
          </WrapperInfoUser>
        </WrapperHeaderUser>
        <WrapperStyleContent>
          <div style={{flex:1,display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{width: '670px'}}>Sản phẩm</div>
            <WrapperItemLabel>Giá</WrapperItemLabel>
            <WrapperItemLabel>Số lượng</WrapperItemLabel>
            <WrapperItemLabel>Tổng giá từng sản phẩm</WrapperItemLabel>
          </div>
          {data?.orderDetails?.map((order) => {
            return (
              <WrapperProduct key={order?.id}>
                <WrapperNameProduct>
                  <img src={order?.image} 
                    style={{
                      width: '70px', 
                      height: '70px', 
                      objectFit: 'cover',
                      border: '1px solid rgb(238, 238, 238)',
                      padding: '2px'
                    }}
                  />
                  <div style={{
                    width: 260,
                    overflow: 'hidden',
                    textOverflow:'ellipsis',
                    whiteSpace:'nowrap',
                    marginLeft: '10px',
                    height: '70px',
                  }}>{order?.product_name} </div>
                </WrapperNameProduct>
                <WrapperItem>{convertPrice(order?.unit_price)}</WrapperItem>
                <WrapperItem>x{order?.quantity}</WrapperItem>
                <WrapperItem>{convertPrice(order?.subtotal)}</WrapperItem>
                
                
              </WrapperProduct>
            )
          })}
          
          <WrapperAllPrice>
            <WrapperItemLabel>Tổng cộng</WrapperItemLabel>
            <WrapperItem><WrapperItem>{convertPrice(data?.total_price)}</WrapperItem></WrapperItem>
          </WrapperAllPrice>
      </WrapperStyleContent>
      </div>
        </div>
        <FooterComponent></FooterComponent>
   </Loading>
  )
}

export default DetailsOrderPage