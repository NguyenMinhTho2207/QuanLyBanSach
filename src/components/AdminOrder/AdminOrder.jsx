import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import { Button, Form, Space } from 'antd'
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import ModalComponent from '../ModalComponent/ModalComponent'
import Loading from '../LoadingComponent/Loading'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import { useSelector } from 'react-redux'
import { useMutationHooks } from '../../hooks/useMutationHook'
import { useQuery } from '@tanstack/react-query'
import * as message from '../Message/Message'
import * as OrderService from '../../services/OrderService'
import { orderConstant } from '../../constant'
import avatarDefault from '../../assets/images/user/user-default.png'
import { convertPrice, getBase64 } from '../../utils'

const AdminOrder = () => {
  const user = useSelector((state) => state?.user);

  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token);
    return res;
  }

  const queryOrder = useQuery({
    queryKey: ['orders'],
    queryFn: getAllOrder,
    retry: 3,
    retryDelay: 1000,
  });

  const { isLoading: isLoadingOrder, data: orders } = queryOrder;

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };

  const handleReset = (clearFilters) => {
    clearFilters();
  };

  const getColumnSearchProps = (dataIndex, placeholder) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          // ref={searchInput}
          placeholder={`Tìm kiếm ${placeholder}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      // if (visible) {
      //   setTimeout(() => searchInput.current?.select(), 100);
      // }
    },
  });
  
  const columns = [
    {
      title: 'Tên người dùng',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps('name', 'tên người dùng')
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone_number',
      sorter: (a, b) => a.phone_number - b.phone_number,
      ...getColumnSearchProps('phone_number', 'số điện thoại')
    },
    {
      title: 'Địa chỉ giao hàng',
      dataIndex: 'shipping_address',
      sorter: (a, b) => a.shipping_address - b.shipping_address,
      ...getColumnSearchProps('shipping_address', 'địa chỉ giao hàng')
    },
    {
      title: 'Phí giao hàng',
      dataIndex: 'shippingPrice',
      sorter: (a, b) => a.shippingPrice - b.shippingPrice,
      ...getColumnSearchProps('shippingPrice', 'phí giao hàng')
    },
    {
      title: 'Đã thanh Toán',
      dataIndex: 'isPaid',
      sorter: (a, b) => a.isPaid - b.isPaid,
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'paymentMethod',
      sorter: (a, b) => a.paymentMethod - b.paymentMethod,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      sorter: (a, b) => a.totalPrice - b.totalPrice,
      ...getColumnSearchProps('totalPrice', 'tổng tiền')
    },
  ];

  const dataTable = orders?.data.map((order) => {
    return {
      ...order, 
      key: order?.id,
      itemPrice: order?.orderDetails.unit_price,
      paymentMethod: orderConstant.payment[order?.payment_method],
      isPaid: order?.is_paid ? 'TRUE' : 'FALSE',
      isDelivered: order?.is_delivered ? 'TRUE' : 'FALSE',
      shippingPrice: convertPrice(order?.shipping_price),
      totalPrice : convertPrice(order?.total_price),
      createdAt: new Date(order.createdAt),
      updatedAt: new Date(order.updatedAt),
    }
  });

  return (
    <div>
        <WrapperHeader>Quản lý người dùng</WrapperHeader>
        <div style={{ marginTop: '20px' }}>
          <TableComponent columns={columns} data={dataTable} isLoading={isLoadingOrder}></TableComponent>
        </div>
    </div>
  )
}

export default AdminOrder