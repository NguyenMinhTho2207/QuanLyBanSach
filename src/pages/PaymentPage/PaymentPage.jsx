import React, { useEffect, useMemo, useState } from 'react'
import { Label, WrapperInfo, WrapperLeft, WrapperRadio, WrapperRight, WrapperTotal } from './style';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Radio } from 'antd';
import Loading from '../../components/LoadingComponent/Loading';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import * as message from '../../components/Message/Message'
import { useNavigate } from 'react-router-dom';
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as  UserService from '../../services/UserService';
import * as  OrderService from '../../services/OrderService';
import * as  PaymentService from '../../services/PaymentService';
import { updateUser } from '../../redux/slice/userSlice';
import { convertPrice } from '../../utils';
import { removeAllOrderProduct } from '../../redux/slice/orderSlice';
import FooterComponent from '../../components/FooterComponent/FooterComponent';
import { PayPalButton } from 'react-paypal-button-v2';

const PaymentPage = () => {
    const order = useSelector((state) => state.order);
    const user = useSelector((state) => state.user);
    const [delivery, setDelivery] = useState('fast');
    const [payment, setPayment] = useState('later_money');
    const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        phone_number: '',
        address: '',
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [sdkReady, setSdkReady] = useState(false);

    useEffect(() => {
        form.setFieldsValue(stateUserDetails)
    }, [form, stateUserDetails])

    useEffect(() => {
        if(isOpenModalUpdateInfo) {
        setStateUserDetails({
            name: user?.name,
            phone_number: user?.phone_number,
            address: user?.address
        })
        }
    }, [isOpenModalUpdateInfo])

    useEffect(() => {
        // Khi component được hiển thị, cuộn lên đầu trang
        window.scrollTo(0, 0);
      }, []); // [] đảm bảo useEffect chỉ chạy sau khi component được render lần đầu tiên

    const handleChangeAddress = () => {
        setIsOpenModalUpdateInfo(true)
    }

    const priceMemo = useMemo(() => {
        const result = order?.orderItemsSelected?.reduce((total, cur) => {
            return total + ((cur.unit_price * cur.quantity))
        },0)

        return result
    },[order])

    const priceDiscountMemo = useMemo(() => {
        const result = order?.orderItemsSelected?.reduce((total, cur) => {
        const totalDiscount = cur.discount ? cur.discount : 0
            return total + (priceMemo * (totalDiscount * cur.quantity) / 100)
        },0)

        if(Number(result)){
            return result
        }

        return 0
    },[order])

    const deliveryPriceMemo = useMemo(() => {
        if(priceMemo >= 20000 && priceMemo < 500000){
            return 10000
        }else if(priceMemo >= 500000 || order?.orderItemsSelected?.length === 0) {
            return 0
        } else {
            return 20000
        }
    },[priceMemo])

    const totalPriceMemo = useMemo(() => {
        return Number(priceMemo) - Number(priceDiscountMemo) + Number(deliveryPriceMemo)
    },[priceMemo, priceDiscountMemo, deliveryPriceMemo])

    const handleAddOrder = () => {
        if (user?.access_token && order?.orderItemsSelected && user?.id &&  user?.name && user?.address && user?.phone_number) {
            mutationAddOrder.mutate({ 
                token: user?.access_token, 
                user_id: user?.id,
                name: user?.name,
                phone_number: user?.phone_number,
                note: "default",
                shipping_address: user?.address,
                payment_method: payment,
                shipping_price: deliveryPriceMemo,
                total_price: totalPriceMemo,
                is_paid: 0,
                paid_at: null,
                is_delivered: 0,
                delivered_at: null
            });
        }
    }

    const mutationUpdate = useMutationHooks(
        (data) => {
            const { id, token, ...rests } = data;
            const res = UserService.updateUser( id, token, { ...rests });

            return res;
        },
    )

    const mutationAddOrder = useMutationHooks(
        (data) => {
            const { token, ...rests } = data;
            const res = OrderService.createOrder( token, { ...rests });

            return res;
        },
    )

    const mutationAddOrderDetail = useMutationHooks(
        (data) => {
            const { token, ...rests } = data;
            const res = OrderService.createOrderDetail( token, { ...rests });

            return res;
        },
    )

    const handleSaveOrderDetail = (order_id) => {
        mutationAddOrderDetail.mutate({
            token: user?.access_token, 
            order_id: order_id,
            product_detail: order?.orderItemsSelected
        })
    }

    const { isPending } = mutationUpdate
    const { isPending: isPendingAddOrder, isSuccess: isSuccessAddOrder, isError: isErrorAddOrder, data: dataAddOrder } = mutationAddOrder;
    const { isPending: isPendingAddOrderDetail, isSuccess: isSuccessOrderDetail, isError: isErrorOrderDetail, data: dataAddOrderDetail } = mutationAddOrderDetail;

    useEffect(() => {
        if (isSuccessAddOrder && dataAddOrder?.message == "Success") {
            handleSaveOrderDetail(dataAddOrder?.data.id);

            const arrayOrdered = [];

            order?.orderItemsSelected.forEach(element => {
                arrayOrdered.push(element.product_id);
            });

            dispatch(removeAllOrderProduct({listChecked: arrayOrdered}));

            message.success('Đặt hàng thành công');
            navigate('/orderSuccess', {
                state: {
                    delivery,
                    payment,
                    orders: order?.orderItemsSelected,
                    totalPriceMemo: totalPriceMemo
                }
            });
        }
        else if (isErrorAddOrder || dataAddOrder?.status == "ERROR") {
            message.error('Bạn không có sản phẩm để thanh toán');
        }
    }, [isSuccessAddOrder, isErrorAddOrder])

    const handleCancelUpdate = () => {
        setStateUserDetails({
            name: '',
            phone_number: '',
            address: '',
        });
        form.resetFields();
        setIsOpenModalUpdateInfo(false);
    }

    const handleUpdateInfoUser = () => {
        const {name, address, phone_number} = stateUserDetails
        if(name && address && phone_number){
            mutationUpdate.mutate({ id: user?.id, token: user?.access_token, ...stateUserDetails }, {
                onSuccess: () => {
                    dispatch(updateUser({id: user?.id, access_token: user?.access_token, name, address, phone_number}))
                    setIsOpenModalUpdateInfo(false)
                }
            })
        }
    }

    const handleOnchangeDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value
        })
    }

    const onSuccessPaypal = (detail, data) => {
        mutationAddOrder.mutate({ 
            token: user?.access_token, 
            user_id: user?.id,
            name: user?.name,
            phone_number: user?.phone_number,
            note: "default",
            shipping_address: user?.address,
            payment_method: payment,
            shipping_price: deliveryPriceMemo,
            total_price: totalPriceMemo,
            is_paid: 1,
            paid_at: detail.update_time,
            is_delivered: 0,
            delivered_at: null
        });
    }

    const handleDelivery = (e) => {
        setDelivery(e.target.value)
    }
    
    const handlePayment = (e) => {
        setPayment(e.target.value)
    }

    const addPaypalScript = async () => {
        const { data } = await PaymentService.getConfig()
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = `https://www.paypal.com/sdk/js?client-id=${data}`
        script.async = true;
        script.onload = () => {
          setSdkReady(true)
        }
        document.body.appendChild(script)
      }
    
      useEffect(() => {
        if(!window.paypal) {
          addPaypalScript()
        }else {
          setSdkReady(true)
        }
      }, [])

    return (
        <div style={{background: '#f5f5fa', with: '100%', height: '100vh'}}>
            <Loading isLoading={isPendingAddOrder}>
                <div style={{height: '100%', width: '1270px', margin: '0 auto'}}>
                    <h3 style={{fontWeight: 'bold'}}>Chọn phương thức thanh toán</h3>
                    <div style={{ display: 'flex', justifyContent: 'center'}}>
                    <WrapperLeft>
                        <WrapperInfo>
                            <div>
                            <Label>Chọn phương thức giao hàng</Label>
                            <WrapperRadio onChange={handleDelivery} value={delivery}> 
                                <Radio value="fast"><span style={{color: '#ea8500', fontWeight: 'bold'}}>FAST</span> Giao hàng tiết kiệm</Radio>
                                <Radio value="gojek"><span style={{color: '#ea8500', fontWeight: 'bold'}}>GO_JEK</span> Giao hàng tiết kiệm</Radio>
                            </WrapperRadio>
                            </div>
                        </WrapperInfo>
                        <WrapperInfo>
                            <div>
                            <Label>Chọn phương thức thanh toán</Label>
                            <WrapperRadio onChange={handlePayment} value={payment}> 
                                <Radio value="later_money"> Thanh toán tiền mặt khi nhận hàng</Radio>
                                <Radio value="paypal"> Thanh toán tiền bằng paypal</Radio>
                            </WrapperRadio>
                            </div>
                        </WrapperInfo>
                    </WrapperLeft>
                        <WrapperRight>
                            <div style={{width: '100%'}}>
                            <WrapperInfo>
                                <div>
                                <span>Địa chỉ: </span>
                                <span style={{fontWeight: 'bold'}}>{ `${user?.address}`} </span>
                                <span onClick={handleChangeAddress} style={{color: '#9255FD', cursor:'pointer'}}>Thay đổi</span>
                                </div>
                            </WrapperInfo>
                            <WrapperInfo>
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <span>Tạm tính</span>
                                <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(priceMemo)}</span>
                                </div>
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <span>Giảm giá</span>
                                <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(priceDiscountMemo)}</span>
                                </div>
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <span>Phí giao hàng</span>
                                <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(deliveryPriceMemo)}</span>
                                </div>
                            </WrapperInfo>
                            <WrapperTotal>
                                <span>Tổng tiền</span>
                                <span style={{display:'flex', flexDirection: 'column'}}>
                                <span style={{color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold'}}>{convertPrice(totalPriceMemo)}</span>
                                <span style={{color: '#000', fontSize: '11px'}}>(Đã bao gồm VAT nếu có)</span>
                                </span>
                            </WrapperTotal>
                            </div>
                            {payment === 'paypal' && sdkReady ? (
                                <div style={{width: '320px'}}>
                                    <PayPalButton
                                        // amount={totalPriceMemo / 10000}
                                        amount={Math.round(totalPriceMemo / 24000)}
                                        // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                                        onSuccess={onSuccessPaypal}
                                        onError={() => {
                                            alert('Error');
                                        }}
                                    />
                                </div>
                            ) : (
                                <ButtonComponent
                                onClick={() => handleAddOrder()}
                                size={40}
                                styleButton={{
                                    background: 'rgb(255, 57, 69)',
                                    height: '48px',
                                    width: '320px',
                                    border: 'none',
                                    borderRadius: '4px'
                                }}
                                textButton={'Đặt hàng'}
                                styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                                ></ButtonComponent>
                            )}
                        </WrapperRight>
                    </div>
                </div>
                <ModalComponent title="Cập nhật thông tin giao hàng" open={isOpenModalUpdateInfo} onCancel={handleCancelUpdate} onOk={handleUpdateInfoUser}>
                    <Loading isLoading={isPending}>
                    <Form
                        name="basic"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        autoComplete="on"
                        form={form}
                    >
                        <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên người nhận hàng!' }]}
                        >
                        <InputComponent value={stateUserDetails['name']} onChange={handleOnchangeDetails} name="name" />
                        </Form.Item>
                        
                        <Form.Item
                        label="Phone"
                        name="phone_number"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại người nhận hàng!' }]}
                        >
                        <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone_number" />
                        </Form.Item>

                        <Form.Item
                        label="Adress"
                        name="address"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ giao hàng!' }]}
                        >
                        <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
                        </Form.Item>
                    </Form>
                    </Loading>
                </ModalComponent>
                <FooterComponent></FooterComponent>
            </Loading>
        </div>
    )
}

export default PaymentPage