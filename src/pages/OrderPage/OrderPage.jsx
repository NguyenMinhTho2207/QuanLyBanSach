import React, { useEffect, useMemo, useState } from 'react'
import { CustomCheckbox, WrapperCountOrder, WrapperInfo, WrapperInputNumber, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperRight, WrapperStyleHeader, WrapperStyleHeaderDelivery, WrapperTotal } from './style';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteOutlined, MinusOutlined, PlusOutlined} from '@ant-design/icons'
import { increaseQuantity, decreaseQuantity, removeOrderProduct, removeAllOrderProduct, selectedOrder  } from '../../redux/slice/orderSlice';
import { Form } from 'antd'
import Loading from '../../components/LoadingComponent/Loading';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import * as message from '../../components/Message/Message'
import { useNavigate } from 'react-router-dom';
import StepComponent from '../../components/StepComponent/StepComponent';
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as  UserService from '../../services/UserService';
import { updateUser } from '../../redux/slice/userSlice';
import { convertPrice } from '../../utils';

const OrderPage = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);

  const [listChecked, setListChecked] = useState([])
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone_number: '',
    address: '',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onChange = (e) => {
    if(listChecked.includes(e.target.value)){
      const newListChecked = listChecked.filter((item) => item !== e.target.value)
      setListChecked(newListChecked)
    }else {
      setListChecked([...listChecked, e.target.value])
    }
  };

  const handleChangeCount = (type, product_id, item) => {
    if(type === 'increase') {
      if (item.quantity + 1 <= item?.quantityInStock) {
        dispatch(increaseQuantity({product_id}));
      }
    }else {
      if (item.quantity > 1) {
        dispatch(decreaseQuantity({product_id}));
      }
    }
  }

  const handleDeleteOrder = (product_id) => {
    dispatch(removeOrderProduct({product_id}))
  }

  const handleOnchangeCheckAll = (e) => {
    if(e.target.checked) {
      const newListChecked = []
      order?.orderItems?.forEach((item) => {
        newListChecked.push(item?.product_id)
      })
      setListChecked(newListChecked)
    }else {
      setListChecked([])
    }
  }

  const handleRemoveAllOrder = () => {
    if(listChecked?.length > 1){
      dispatch(removeAllOrderProduct({listChecked}))
    }
  }

  useEffect(() => {
    dispatch(selectedOrder({listChecked}))
  },[listChecked])

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
    if(priceMemo >= 200000 && priceMemo < 500000){
      return 10000 //phí giao hàng
    }else if(priceMemo >= 500000 || order?.orderItemsSelected?.length === 0) {
      return 0
    } else {
      return 20000
    }
  },[priceMemo])

  const totalPriceMemo = useMemo(() => {
    return Number(priceMemo) - Number(priceDiscountMemo) + Number(deliveryPriceMemo)
  },[priceMemo, priceDiscountMemo, deliveryPriceMemo])

  const handleAddCard = () => {
    if(!order?.orderItemsSelected?.length) {
      message.error('Vui lòng chọn sản phẩm')
    }else if(!user?.phone_number || !user.address || !user.name) {
      setIsOpenModalUpdateInfo(true)
    }else {
      navigate('/payment')
    } 
  }

  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id, token, ...rests } = data;
      const res = UserService.updateUser( id, token, { ...rests });

      return res
    },
  )

  const {isPending, data} = mutationUpdate

  const handleCancelUpdate = () => {
    setStateUserDetails({
      name: '',
      phone_number: '',
      address: '',
    })
    form.resetFields()
    setIsOpenModalUpdateInfo(false)
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

  const itemsDelivery = [
    {
      title: '20.000 VNĐ',
      description: 'Dưới 200.000 VNĐ',
    },
    {
      title: '10.000 VND',
      description: 'Từ 200.000 VND đến dưới 500.000 VNĐ',
    },
    {
      title: 'Free ship',
      description : 'Trên 500.000 VNĐ',
    },
  ]

  return (
    <div style={{background: '#f5f5fa', with: '100%', height: '100vh'}}>
      <div style={{height: '100%', width: '1270px', margin: '0 auto'}}>
        <h3 style={{fontWeight: 'bold'}}>Giỏ hàng</h3>
        <div style={{ display: 'flex', justifyContent: 'center'}}>
          <WrapperLeft>
            <WrapperStyleHeaderDelivery>
              <StepComponent items={itemsDelivery} current={deliveryPriceMemo === 10000 
                ? 2 : deliveryPriceMemo === 20000 ? 1 
                : order.orderItemsSelected.length === 0 ? 0:  3}/>
            </WrapperStyleHeaderDelivery>
            <WrapperStyleHeader>
                <span style={{display: 'inline-block', width: '390px'}}>
                  <CustomCheckbox onChange={handleOnchangeCheckAll} checked={listChecked?.length === order?.orderItems?.length}></CustomCheckbox>
                  <span> Tất cả ({order?.orderItems?.length} sản phẩm)</span>
                </span>
                <div style={{flex:1,display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span>Đơn giá</span>
                  <span>Số lượng</span>
                  <span>Thành tiền</span>
                  <DeleteOutlined style={{cursor: 'pointer'}} onClick={handleRemoveAllOrder}/>
                </div>
            </WrapperStyleHeader>
            <WrapperListOrder>
              {order?.orderItems?.map((order) => {
                return (
                  <WrapperItemOrder key={order?.product_id}>
                    <div style={{width: '390px', display: 'flex', alignItems: 'center', gap: 4}}> 
                      <CustomCheckbox onChange={onChange} value={order?.product_id} checked={listChecked.includes(order?.product_id)}></CustomCheckbox>
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
                        <span style={{ fontSize: '13px', color: '#242424' }}>{convertPrice(order?.unit_price)}</span>
                      </span>
                      <WrapperCountOrder>
                        <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease', order?.product_id, order)}>
                            <MinusOutlined style={{ color: '#000', fontSize: '10px' }} />
                        </button>
                        <WrapperInputNumber defaultValue={order?.quantity} value={order?.quantity} size="small" min={1} max={order?.quantity} />
                        <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase', order?.product_id, order)}>
                            <PlusOutlined style={{ color: '#000', fontSize: '10px' }}/>
                        </button>
                      </WrapperCountOrder>
                      <span style={{color: 'rgb(255, 66, 78)', fontSize: '13px', fontWeight: 500}}>{convertPrice(order?.subtotal)}</span>
                      <DeleteOutlined style={{cursor: 'pointer'}} onClick={() => handleDeleteOrder(order?.product_id)}/>
                    </div>
                  </WrapperItemOrder>
                )
              })}
            </WrapperListOrder>
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
            <ButtonComponent
              onClick={() => handleAddCard()}
              size={40}
              styleButton={{
                  background: 'rgb(255, 57, 69)',
                  height: '48px',
                  width: '320px',
                  border: 'none',
                  borderRadius: '4px'
              }}
              textButton={'Mua hàng'}
              styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
          ></ButtonComponent>
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
    </div>
  )
}

export default OrderPage