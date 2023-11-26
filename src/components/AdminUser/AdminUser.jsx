import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader } from './style'
import { Button, Form, Space } from 'antd'
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import ModalComponent from '../ModalComponent/ModalComponent'
import Loading from '../LoadingComponent/Loading'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import { useSelector } from 'react-redux'
import { useMutationHooks } from '../../hooks/userMutationHook'
import { useQuery } from '@tanstack/react-query'
import * as message from '../../components/Message/Message'
import * as UserService from '../../services/UserService'
import avatarDefault from '../../assets/images/user/user-default.png'

const AdminUser = () => {
  const [rowSelected, setRowSelected] = useState();
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const user = useSelector((state) => state?.user);
  const searchInput = useRef(null);

  const [stateUsersDetails, setStateUsersDetails] = useState({
    address: '',
    avatar: '',
    email: '',
    is_admin: false,
    name: '',
    phone_number: ''
  });

  const mutationUpdate = useMutationHooks(
    (data) => { 
      const { id, token, ...rests } = data;

      const res = UserService.updateUser(id, token, { ...rests });

      return res;
    }
  );

  const mutationDeleted = useMutationHooks(
    (data) => { 
      const { id, token } = data;

      const res = UserService.deleteUser(id, token);

      return res;
    }
  );

  const mutationDeletedMultiple = useMutationHooks(
    (data) => { 
      const { token, ids } = data;
      const res = UserService.deleteMultipleUsers(ids, token);

      return res;
    }
  );

  const handleDeleteMultipleUsers = (ids) => {
    mutationDeletedMultiple.mutate(
      {
        ids: ids, 
        token: user?.access_token
      },
      {
        onSettled: () => {
          queryUser.refetch();
        }
      }
    )
  }

  const { data: dataUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated, isPending: isLoadingUpdated } = mutationUpdate;
  const { data: dataDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted, isPending: isLoadingDeleted } = mutationDeleted;
  const { data: dataDeletedMultiple, isSuccess: isSuccessDeletedMultiple, isError: isErrorDeletedMultiple, isPending: isLoadingDeletedMultiple } = mutationDeletedMultiple;

  const getAllUsers = async () => {
    const res = await UserService.getAllUsers(user?.access_token);
    return res;
  }

  const queryUser = useQuery({
    queryKey: ['user'],
    queryFn: getAllUsers,
    retry: 3,
    retryDelay: 1000,
  });

  const { isLoading: isLoadingUser, data: users } = queryUser;

  useEffect(() => {
    if(isSuccessUpdated && dataUpdated?.message === 'Success') {
      message.success("Cập nhật người dùng thành công");
      handleCloseDrawer();
    }
    else if (isErrorUpdated) {
      message.error("Có gì đó sai sai");
    }
  }, [isSuccessUpdated])

  useEffect(() => {
    if(isSuccessDeleted && dataDeleted?.message === 'Delete user success') {
      message.success("Xóa người dùng thành công");
      handleCancelDelete();
    }
    else if (isErrorDeleted) {
      message.error("Có gì đó sai sai");
    }
  }, [isSuccessDeleted])

  useEffect(() => {
    if (isSuccessDeletedMultiple && dataDeletedMultiple) {
        // Kiểm tra xem có phần tử nào có status === 'OK' không
        const hasSuccessStatus = dataDeletedMultiple.some(item => item.status === 'OK');

        if (hasSuccessStatus) {
            message.success("Xóa người dùng thành công");
        } else {
            message.error("Không có người dùng nào được xóa thành công");
        }
    } else if (isErrorDeletedMultiple) {
        message.error("Có gì đó sai sai");
    }
  }, [isSuccessDeletedMultiple, isErrorDeletedMultiple, dataDeletedMultiple]);

  const fetchGetDetailsUser = async (rowSelected) => {
    const res = await UserService.getDetailsUser(rowSelected, user?.access_token);

    if (res?.data) {
      setStateUsersDetails({
        address: res?.data.address,
        avatar: res?.data.avatar,
        email: res?.data.email,
        is_admin: res?.data.is_admin,
        name: res?.data.name,
        phone_number: res?.data.phone_number,
      })
    }

    setIsLoadingUpdate(false);
  }

  const [drawerForm] = Form.useForm();
  
  useEffect(() => {
    const formValues = {
      product_name: stateUsersDetails.product_name,
      address: stateUsersDetails.address,
      avatar: stateUsersDetails.avatar,
      email: stateUsersDetails.email,
      is_admin: stateUsersDetails.is_admin,
      name: stateUsersDetails.name,
      phone_number: stateUsersDetails.phone_number,
    };

    drawerForm.setFieldsValue(formValues);
  }, [stateUsersDetails, drawerForm]);

  useEffect(() => {
    if (rowSelected) {
      fetchGetDetailsUser(rowSelected);
    }
  }, [rowSelected])
  
  const handleDetailsUser = () => {
    setIsOpenDrawer(true);
  }

  const handleDeleteUser = () => {
    mutationDeleted.mutate(
      {
        id: rowSelected, 
        token: user?.access_token
      },
      {
        onSettled: () => {
          queryUser.refetch();
        }
      }
    )
  }

  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined style={{color: 'red', fontSize: '30px', cursor: 'pointer'}} onClick={() => setIsModalOpenDelete(true)}/>
        <EditOutlined style={{color: 'orange', fontSize: '30px', cursor: 'pointer'}} onClick={handleDetailsUser}/>
      </div>
    )
  }

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
          ref={searchInput}
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
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });
  
  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      render: (text) => <img src={text ? text : avatarDefault} style={{height: '90px',  width: '90px', borderRadius: '50%', objectFit: 'cover'}} alt='avatar'/>
    },
    {
      title: 'Tên người dùng',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps('name', 'tên người dùng')
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
      ...getColumnSearchProps('email', 'email')
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone_number',
      sorter: (a, b) => a.phone_number - b.phone_number,
      ...getColumnSearchProps('phone_number', 'số điện thoại')
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      sorter: (a, b) => a.address - b.address,
      ...getColumnSearchProps('address', 'địa chỉ')
    },
    {
      title: 'Admin',
      dataIndex: 'is_admin',
      filters: [
        {
          text: 'false',
          value: false,
        },
        {
          text: 'true',
          value: true,
        },
      ],
      onFilter: (value, record) => {
        if (value) {
          return record.is_admin >= 1
        }
        else if (!value) {
          return record.is_admin < 1
        }
      },
      render: (text) => {
        // Custom logic để hiển thị nội dung tùy thuộc vào giá trị của is_admin
        return text >= 1 ? 'true' : 'false';
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: renderAction
    },
  ];

  const dataTable = users?.data.map((user) => {
    return {
      ...user, 
      key: user.id,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
    }
  });

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  }

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
  };

  const handleOnChangeDetails = (e) => {
    setStateUsersDetails({
      ...stateUsersDetails,
      [e.target.name]: e.target.value
    });
  }

  const onUpdateUser = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected, 
        token: user?.access_token, 
        ...stateUsersDetails
      }, 
      {
        onSettled: () => {
          queryUser.refetch();
        }
      }
    )
  }

  return (
    <div>
        <WrapperHeader>Quản lý người dùng</WrapperHeader>
        <div style={{ marginTop: '20px' }}>
          <TableComponent handleDeleteMultiple={handleDeleteMultipleUsers} columns={columns} data={dataTable} isLoading={isLoadingUser} 
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  if (record.id) {
                    setRowSelected(record.id);
                  }
                },
              };
            }}
          ></TableComponent>
        </div>
        <DrawerComponent forceRender title='Chi tiết người dùng' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="30%">
          <Loading isLoading={isLoadingUpdate || isLoadingUpdated || isLoadingDeletedMultiple}>
            <Form
              name="drawerForm"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 20 }}
              style={{ maxWidth: 700 }}
              initialValues={{ remember: true }}
              onFinish={onUpdateUser}
              autoComplete="on"
              form={drawerForm}
            >
              {/* <Form.Item
                label="Avatar"
                name="avatar"
                rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}
              >
                <InputComponent value={ stateUsers.product_name } onChange={handleOnChange} name="product_name"/>
              </Form.Item> */}

              <Form.Item
                label="Tên người dùng"
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}
              >
                <InputComponent value={ stateUsersDetails.name } onChange={handleOnChangeDetails} name="name" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
              >
                <InputComponent value={ stateUsersDetails.email } onChange={handleOnChangeDetails} name="email" />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="phone_number"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
              >
                <InputComponent value={ stateUsersDetails.phone_number } onChange={handleOnChangeDetails} name="phone_number" />
              </Form.Item>

              <Form.Item
                label="Địa chỉ"
                name="address"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
              >
                <InputComponent value={ stateUsersDetails.address } onChange={handleOnChangeDetails} name="address" />
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 14, span: 24 }}>
                <Button type="primary" htmlType="submit">Cập nhật người dùng</Button>
              </Form.Item>
            </Form>
          </Loading>
        </DrawerComponent>
        <ModalComponent title="Xóa người dùng" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteUser}>
          <Loading isLoading={isLoadingDeleted}>
            <div>Bạn có muốn xóa người dùng này không?</div>
          </Loading>
        </ModalComponent>
    </div>
  )
}

export default AdminUser