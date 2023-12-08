import React,{ useEffect } from 'react'
import Loading from '../../components/LoadingComponent/Loading';
import { useQuery } from '@tanstack/react-query';
import * as  OrderService from '../../services/OrderService';
import { useSelector } from 'react-redux';
import { convertPrice } from '../../utils';
import { WrapperItemOrder, WrapperListOrder, WrapperHeaderItem, WrapperFooterItem, WrapperContainer, WrapperStatus } from './style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as message from '../../components/Message/Message'
import FooterComponent from '../../components/FooterComponent/FooterComponent';

const MyOrderPage = () => {
  const location = useLocation()
  const { state } = location;
  const navigate = useNavigate();
  const user = useSelector((state) => state.user)

  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderByUserId(state?.id, state?.token);
    return res.data;
  }

  const queryOrder = useQuery({
    queryKey: ['orders'],
    queryFn: fetchMyOrder,
    retry: 3,
    retryDelay: 1000,
    enabled: Boolean(state?.id && state?.token)
  });

  const { isLoading, data } = queryOrder;

  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`, {
      state: {
        token: state?.token
      }
    })
  }

  useEffect(() => {
    // Khi component được hiển thị, cuộn lên đầu trang
    window.scrollTo(0, 0);
  }, []); // [] đảm bảo useEffect chỉ chạy sau khi component được render lần đầu tiên

  const mutation = useMutationHooks(
    (data) => {
      const { id, token , orderItems, userId } = data
      const res = OrderService.cancelOrder(id, token, orderItems, userId)
      return res
    }
  )

  const handleCancelOrder = (order) => {
    mutation.mutate({id : order.id, token:state?.token, orderItems: order?.orderDetails, userId: state.id }, {
      onSuccess: () => {
        queryOrder.refetch()
      },
    })
  }
  const { isPending: isLoadingCancel, isSuccess: isSuccessCancel, isError: isErrorCancel, data: dataCancel } = mutation

  useEffect(() => {
    if (isSuccessCancel && dataCancel?.status === 'OK') {
      message.success("Hủy đơn hàng thành công");
    } else if(isSuccessCancel && dataCancel?.status === 'ERROR') {
      message.error(dataCancel?.message)
    }else if (isErrorCancel) {
      message.error()
    }
  }, [isErrorCancel, isSuccessCancel])

  const renderProduct = (data) => {
    return data?.map((order) => (
      <WrapperHeaderItem key={order?.id}>
        <img
          src={order?.image}
          style={{
            width: '70px',
            height: '70px',
            objectFit: 'cover',
            border: '1px solid rgb(238, 238, 238)',
            padding: '2px'
          }}
        />
        <div
          style={{
            width: 260,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            marginLeft: '10px'
          }}
        >
          {order?.product_name}
        </div>
        <span
          style={{
            fontSize: '13px',
            color: '#242424',
            marginLeft: 'auto'
          }}
        >
          Số lượng mua: x{order?.quantity}
        </span>
        <span
          style={{
            fontSize: '13px',
            color: '#242424',
            marginLeft: 'auto'
          }}
        >
          {convertPrice(order?.unit_price)}
        </span>
      </WrapperHeaderItem>
    ));
  };
  
  return (
    <Loading isLoading={isLoading || isLoadingCancel}>
      <WrapperContainer>
        <div style={{height: '100%', width: '1270px', margin: '0 auto'}}>
          <h4><span style={{cursor: 'pointer'}} onClick={() => {navigate(`/`)}}>Trang chủ</span> - Đơn hàng của tôi</h4>
          <WrapperListOrder>
            {data?.map((order) => {
              return (
                <WrapperItemOrder key={order?.id}>
                  <WrapperStatus>
                    <span style={{fontSize: '14px', fontWeight: 'bold'}}>Trạng thái</span>
                    <div>
                      <span style={{color: 'rgb(255, 66, 78)'}}>Giao hàng: </span>
                      <span style={{color: 'rgb(90, 32, 193)', fontWeight: 'bold'}}>{`${order.is_delivered ? 'Đã giao hàng': 'Chưa giao hàng'}`}</span>
                    </div>
                    <div>
                      <span style={{color: 'rgb(255, 66, 78)'}}>Thanh toán: </span>
                      <span style={{color: 'rgb(90, 32, 193)', fontWeight: 'bold'}}>{`${order.is_paid ? 'Đã thanh toán': 'Chưa thanh toán'}`}</span>
                    </div>
                  </WrapperStatus>
                  {renderProduct(order?.orderDetails)}
                  <WrapperFooterItem>
                    <div>
                      <span style={{color: 'rgb(255, 66, 78)'}}>Tổng tiền: </span>
                      <span 
                        style={{ fontSize: '13px', color: 'rgb(56, 56, 61)',fontWeight: 700 }}
                      >{convertPrice(order?.total_price)}</span>
                    </div>
                    <div style={{display: 'flex', gap: '10px'}}>
                    <ButtonComponent
                            size={40}
                            styleButton={{ 
                              height: '36px',
                              border: '1px solid #9255FD',
                              borderRadius: '4px'
                            }}
                            onClick={() => handleCancelOrder(order)}
                            textButton={'Hủy đơn hàng'}
                            styleTextButton={{ color: '#9255FD', fontSize: '14px' }}
                      ></ButtonComponent>
                    <ButtonComponent
                            size={40}
                            styleButton={{ 
                              height: '36px',
                              border: '1px solid #9255FD',
                              borderRadius: '4px'
                            }}
                            onClick={() => handleDetailsOrder(order?.id)}
                            textButton={'Xem chi tiết'}
                            styleTextButton={{ color: '#9255FD', fontSize: '14px' }}
                      ></ButtonComponent>
                    </div>
                  </WrapperFooterItem>
                </WrapperItemOrder>
              )
            })}
          </WrapperListOrder>
        </div>
      </WrapperContainer>
      <FooterComponent></FooterComponent>
    </Loading>
  )
}

export default MyOrderPage