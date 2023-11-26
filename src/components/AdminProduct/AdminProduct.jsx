import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader } from './style'
import { Button, Form, Select, Space } from 'antd'
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import { WrapperUploadFile } from '../../pages/ProfilePage/style'
import { getBase64 } from '../../utils'
import * as ProductService from '../../services/ProductService'
import * as CategoryService from '../../services/CategoryService'
import { useMutationHooks } from '../../hooks/userMutationHook'
import Loading from '../LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import { useQuery } from '@tanstack/react-query'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import { useSelector } from 'react-redux'
import ModalComponent from '../ModalComponent/ModalComponent'

const AdminProduct = () => {
  const [modalForm] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState();
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const user = useSelector((state) => state?.user);
  const searchInput = useRef(null);

  const [stateProducts, setStateProducts] = useState({
    product_name: '',
    category_id: '',
    category_name: '',
    quantity: '',
    price: '',
    rating: '',
    description: '',
    discount: '',
    image: ''
  });

  const [stateProductsDetails, setStateProductsDetails] = useState({
    product_name: '',
    category_id: '',
    category_name: '',
    quantity: '',
    price: '',
    rating: '',
    description: '',
    discount: '',
    image: ''
  });

  const mutation = useMutationHooks(
    (data) => { 
      const { 
        product_name,
        category_id,
        category_name,
        quantity,
        price,
        rating,
        description,
        discount,
        image } = data;

      const resProduct = ProductService.createProduct({
        product_name,
        category_id,
        category_name,
        quantity,
        price,
        rating,
        description,
        discount,
        image
      });

      return resProduct;
    }
  );

  const mutationUpdate = useMutationHooks(
    (data) => { 
      const { id, token, ...rests } = data;

      const resProduct = ProductService.updateProduct(id, token, { ...rests });

      return resProduct;
    }
  );

  const mutationDeleted = useMutationHooks(
    (data) => { 
      const { id, token } = data;

      const res = ProductService.deleteProduct(id, token);

      return res;
    }
  );

  const mutationDeletedMultiple = useMutationHooks(
    (data) => { 
      const { token, ids } = data;
      const res = ProductService.deleteMultipleProducts(ids, token);

      return res;
    }
  );

  const { Option } = Select;
  const fetchCategoryAll = async () => {
    const res = await CategoryService.getAllCategory();
    return res;
  }

  const handleDeleteMultipleProducts = (ids) => {
    mutationDeletedMultiple.mutate(
      {
        ids: ids, 
        token: user?.access_token
      },
      {
        onSettled: () => {
          queryProduct.refetch();
        }
      }
    )
  }
  
  const { data, isSuccess, isError, isPending } = mutation;
  const { data: dataUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated, isPending: isLoadingUpdated } = mutationUpdate;
  const { data: dataDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted, isPending: isLoadingDeleted } = mutationDeleted;
  const { data: dataDeletedMultiple, isSuccess: isSuccessDeletedMultiple, isError: isErrorDeletedMultiple, isPending: isLoadingDeletedMultiple } = mutationDeletedMultiple;

  const { isLoading, data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategoryAll,
    retry: 3,
    retryDelay: 1000,
  });

  const getAllProducts = async () => {
    const resAllProduct = await ProductService.getAllProduct();
    return resAllProduct;
  }

  const queryProduct = useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts,
    retry: 3,
    retryDelay: 1000,
  });

  const { isLoading: isLoadingProduct, data: products } = queryProduct;

  useEffect(() => {
    if(isSuccess && products?.message === 'Success') {
      message.success("Tạo sản phẩm thành công");
      handleCancel();
    }
    else if (isError) {
      message.error("Có gì đó sai sai");
    }
  }, [isSuccess])

  useEffect(() => {
    if(isSuccessUpdated && dataUpdated?.message === 'Success') {
      message.success("Cập nhật sản phẩm thành công");
      handleCloseDrawer();
    }
    else if (isErrorUpdated) {
      message.error("Có gì đó sai sai");
    }
  }, [isSuccessUpdated])

  useEffect(() => {
    if(isSuccessDeleted && dataDeleted?.message === 'Delete product success') {
      message.success("Xóa sản phẩm thành công");
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
            message.success("Xóa sản phẩm thành công");
        } else {
            message.error("Không có sản phẩm nào được xóa thành công");
        }
    } else if (isErrorDeletedMultiple) {
        message.error("Có gì đó sai sai");
    }
  }, [isSuccessDeletedMultiple, isErrorDeletedMultiple, dataDeletedMultiple]);

  const fetchGetDetailsProduct = async (rowSelected) => {
    const resProductsDetails = await ProductService.getDetailsProduct(rowSelected);

    if (resProductsDetails?.data) {
      setStateProductsDetails({
        product_name: resProductsDetails?.data.product_name,
        category_id: resProductsDetails?.data.category_id,
        category_name: resProductsDetails?.data.category_name,
        quantity: resProductsDetails?.data.quantity,
        price: resProductsDetails?.data.price,
        rating: resProductsDetails?.data.rating,
        description: resProductsDetails?.data.description,
        discount: resProductsDetails?.data.discount,
        image: resProductsDetails?.data.image,
      })
    }

    setIsLoadingUpdate(false);
  }

  const [drawerForm] = Form.useForm();
  
  useEffect(() => {
    const formValues = {
      product_name: stateProductsDetails.product_name,
      category_id: stateProductsDetails.category_id,
      quantity: stateProductsDetails.quantity,
      price: stateProductsDetails.price,
      rating: stateProductsDetails.rating,
      description: stateProductsDetails.description,
      discount: stateProductsDetails.discount,
      image: stateProductsDetails.image,
    };

    drawerForm.setFieldsValue(formValues);
  }, [stateProductsDetails, drawerForm]);

  useEffect(() => {
    if (rowSelected) {
      fetchGetDetailsProduct(rowSelected);
    }
  }, [rowSelected])
  
  const handleDetailsProduct = () => {
    setIsOpenDrawer(true);
  }

  const handleDeleteProduct = () => {
    mutationDeleted.mutate(
      {
        id: rowSelected, 
        token: user?.access_token
      },
      {
        onSettled: () => {
          queryProduct.refetch();
        }
      }
    )
  }

  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined style={{color: 'red', fontSize: '30px', cursor: 'pointer'}} onClick={() => setIsModalOpenDelete(true)}/>
        <EditOutlined style={{color: 'orange', fontSize: '30px', cursor: 'pointer'}} onClick={handleDetailsProduct}/>
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
      title: 'Hình ảnh sản phẩm',
      dataIndex: 'image',
      render: (text) => <img src={text} style={{height: '90px',  width: '90px', borderRadius: '50%', objectFit: 'cover'}} alt='avatar'/>
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'product_name',
      sorter: (a, b) => a.product_name.localeCompare(b.product_name),
      ...getColumnSearchProps('product_name', 'tên sản phẩm')
    },
    {
      title: 'Danh mục',
      dataIndex: 'category_name',
      sorter: (a, b) => a.product_name.localeCompare(b.product_name),
      ...getColumnSearchProps('category_name', 'danh mục sản phẩm')
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      sorter: (a, b) => a.price - b.price,
      filters: [
        {
          text: '<= 500,000',
          value: '<=',
        },
        {
          text: '>= 500,000',
          value: '>=',
        },
      ],
      onFilter: (value, record) => {
        if (value === '<=') {
          return record.price <= 500000
        }
        else if (value === '>=') {
          return record.price >= 500000
        }
      },
      render: (text) => (
        <span>{Number(text).toLocaleString('vi-VN')} VNĐ</span>
      )
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      sorter: (a, b) => a.rating - b.rating,
      filters: [
        {
          text: '<= 3',
          value: '<=',
        },
        {
          text: '>= 3',
          value: '>=',
        },
      ],
      onFilter: (value, record) => {
        if (value === '<=') {
          return record.rating <= 3
        }
        else if (value === '>=') {
          return record.rating >= 3
        }
      },
    },
    {
      title: 'Số lượng trong kho',
      dataIndex: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
      filters: [
        {
          text: '<= 10',
          value: '<=',
        },
        {
          text: '>= 10',
          value: '>=',
        },
      ],
      onFilter: (value, record) => {
        if (value === '<=') {
          return record.quantity <= 10
        }
        else if (value === '>=') {
          return record.quantity >= 10
        }
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: renderAction
    },
  ];

  const dataTable = products?.data.map((product) => {
    return {
      ...product, 
      key: product.id,
      createdAt: new Date(product.createdAt),
      updatedAt: new Date(product.updatedAt),
    }
  });
  
  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProducts({
      product_name: '',
      category_id: '',
      category_name: '',
      quantity: '',
      price: '',
      rating: '',
      description: '',
      discount: '',
      image: ''
    });

    modalForm.resetFields();
  };

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  }

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    // setStateProductsDetails({
    //   product_name: '',
    //   category_id: '',
    //   category_name: '',
    //   quantity: '',
    //   price: '',
    //   rating: '',
    //   description: '',
    //   discount: '',
    //   image: ''
    // });

    // drawerForm.resetFields();
  };

  const onFinish = () => {
    mutation.mutate(stateProducts, {
      onSettled: () => {
        queryProduct.refetch();
      }
    });
  }

  const handleOnChange = (e) => {
    setStateProducts({
      ...stateProducts,
      [e.target.name]: e.target.value
    });
  }

  const handleOnChangeDetails = (e) => {
    setStateProductsDetails({
      ...stateProductsDetails,
      [e.target.name]: e.target.value
    });
  }

  const handleOnChangeAvatar = async ({fileList}) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setStateProducts({
      ...stateProducts,
      image: file.preview
    })
  }

  const handleOnChangeAvatarDetails = async ({fileList}) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setStateProductsDetails({
      ...stateProductsDetails,
      image: file.preview
    })
  }

  const handleKeyPress = (e) => {
    // Cho phép các phím số, phím mũi tên lên, xuống, và phím xóa
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'ArrowUp', 'ArrowDown', 'Backspace'];

    if (!allowedKeys.includes(e.key)) {
        e.preventDefault();
    }
  };

  const onUpdateProduct = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected, 
        token: user?.access_token, 
        ...stateProductsDetails
      }, 
      {
        onSettled: () => {
          queryProduct.refetch();
        }
      }
    )
  }

  return (
    <div>
        <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
        <div style={{ marginTop: '10px'}}>
          <Button style={{ height: '100px', width: '100px', borderRadius: '6px', borderStyle: 'dashed' }} onClick={() => setIsModalOpen(true)}><PlusOutlined style={{ fontSize: '60px' }}/></Button>
        </div>
        <div style={{ marginTop: '20px' }}>
          <TableComponent handleDeleteMultiple={handleDeleteMultipleProducts} columns={columns} data={dataTable} isLoading={isLoadingProduct} 
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
        <ModalComponent forceRender title="Tạo sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
          <Loading isLoading={isPending}>
            <Form
              name="modalForm"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 20 }}
              style={{ maxWidth: 700 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              autoComplete="on"
              form={modalForm}
            >
              <Form.Item
                label="Tên sản phẩm"
                name="product_name"
                rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
              >
                <InputComponent value={ stateProducts.product_name } onChange={handleOnChange} name="product_name"/>
              </Form.Item>

              <Form.Item
                label="Danh mục"
                name="category_id"
                rules={[{ required: true, message: 'Vui lòng nhập danh mục!' }]}
              >
                <Select
                  placeholder="Chọn danh mục"
                  loading={isLoading}
                  value={stateProducts.category_id}
                  onChange={(value) => {
                    const selectedCategory = categories.data.find(category => category.id === value);
              
                    // Thay đổi ở đây: cập nhật trực tiếp category_id và category_name trong state
                    setStateProducts({
                      ...stateProducts,
                      category_id: value || '',
                      category_name: selectedCategory ? selectedCategory.category_name || '' : '',
                    });
                  }}
                >
                  {Array.isArray(categories?.data) && categories.data.map((category) => (
                    <Option key={category.id} value={category.id}>
                      {category.category_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Số lượng trong kho"
                name="quantity"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng trong kho!' }]}
              >
                <InputComponent type="number" value={ stateProducts.quantity } onChange={handleOnChange} name="quantity" min="1" onKeyDown={handleKeyPress}/>
              </Form.Item>

              <Form.Item
                label="Giá"
                name="price"
                rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm!' }]}
              >
                <InputComponent type="number" value={ stateProducts.price } onChange={handleOnChange} name="price" min="1"/>
              </Form.Item>

              <Form.Item
                label="Điểm đánh giá"
                name="rating"
                rules={[{ required: true, message: 'Vui lòng nhập điểm đánh giá sản phẩm!' }]}
              >
                <InputComponent type="number" value={ stateProducts.rating } onChange={handleOnChange} name="rating" min="1" max="5"/>
              </Form.Item>

              <Form.Item
                label="Giảm giá"
                name="discount"
                rules={[{ required: true, message: 'Vui lòng nhập giảm giá sản phẩm!' }]}
              >
                <InputComponent type="number" value={ stateProducts.discount } onChange={handleOnChange} name="discount"/>
              </Form.Item>

              <Form.Item
                label="Mô tả"
                name="description"
                rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm!' }]}
              >
                <InputComponent value={ stateProducts.description } onChange={handleOnChange} name="description"/>
              </Form.Item>

              <Form.Item
                label="Hình ảnh sản phẩm"
                name="image"
                rules={[{ required: true, message: 'Vui lòng chọn ảnh sản phẩm!' }]}
              >
                <WrapperUploadFile onChange={handleOnChangeAvatar} maxCount={1}>
                  <Button>Select File</Button>
                  {stateProducts?.image && (
                    <img src={stateProducts?.image} style={{height: '250px',  width: '250px', borderRadius: '50%', objectFit: 'cover'}} alt='avatar'/>
                  )}
                </WrapperUploadFile>
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 18, span: 16 }}>
                <Button type="primary" htmlType="submit">Tạo sản phẩm</Button>
              </Form.Item>
            </Form>
          </Loading>
        </ModalComponent>
        <DrawerComponent forceRender title='Chi tiết sản phẩm' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="30%">
          <Loading isLoading={isLoadingUpdate || isLoadingUpdated || isLoadingDeletedMultiple}>
            <Form
              name="drawerForm"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 20 }}
              style={{ maxWidth: 700 }}
              initialValues={{ remember: true }}
              onFinish={onUpdateProduct}
              autoComplete="on"
              form={drawerForm}
            >
              <Form.Item
                label="Tên sản phẩm"
                name="product_name"
                rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
              >
                <InputComponent value={stateProductsDetails.product_name} onChange={handleOnChangeDetails} name="product_name"/>
              </Form.Item>

              <Form.Item
                label="Danh mục"
                name="category_id"
                rules={[{ required: true, message: 'Vui lòng nhập danh mục!' }]}
              >
                <Select
                  placeholder="Chọn danh mục"
                  loading={isLoading}
                  value={stateProductsDetails?.category_id}
                  onChange={(value) => {
                    const selectedCategory = categories.data.find(category => category.id === value);
              
                    // Thay đổi ở đây: cập nhật trực tiếp category_id và category_name trong state
                    setStateProducts({
                      ...stateProductsDetails,
                      category_id: value || '',
                      category_name: selectedCategory ? selectedCategory.category_name || '' : '',
                    });
                  }}
                >
                  {Array.isArray(categories?.data) && categories.data.map((category) => (
                    <Option key={category.id} value={category.id}>
                      {category.category_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Số lượng trong kho"
                name="quantity"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng trong kho!' }]}
              >
                <InputComponent type="number" value={stateProductsDetails.quantity} onChange={handleOnChangeDetails} name="quantity"/>
              </Form.Item>

              <Form.Item
                label="Giá"
                name="price"
                rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm!' }]}
              >
                <InputComponent type="number" value={stateProductsDetails?.price} onChange={handleOnChangeDetails} name="price"/>
              </Form.Item>

              <Form.Item
                label="Điểm đánh giá"
                name="rating"
                rules={[{ required: true, message: 'Vui lòng nhập điểm đánh giá sản phẩm!' }]}
              >
                <InputComponent type="number" value={stateProductsDetails?.rating} onChange={handleOnChangeDetails} name="rating"/>
              </Form.Item>

              <Form.Item
                label="Giảm giá"
                name="discount"
                rules={[{ required: true, message: 'Vui lòng nhập giảm giá sản phẩm!' }]}
              >
                <InputComponent type="number" value={stateProductsDetails?.discount} onChange={handleOnChangeDetails} name="discount"/>
              </Form.Item>

              <Form.Item
                label="Mô tả"
                name="description"
                rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm!' }]}
              >
                <InputComponent value={stateProductsDetails?.description} onChange={handleOnChangeDetails} name="description"/>
              </Form.Item>

              <Form.Item
                label="Hình ảnh sản phẩm"
                name="image"
                rules={[{ required: true, message: 'Vui lòng chọn ảnh sản phẩm!' }]}
              >
                <WrapperUploadFile onChange={handleOnChangeAvatarDetails} maxCount={1}>
                  <Button>Select File</Button>
                  {stateProductsDetails?.image && (
                    <img src={stateProductsDetails?.image} style={{height: '250px',  width: '250px', borderRadius: '50%', objectFit: 'cover'}} alt='image'/>
                  )}
                </WrapperUploadFile>
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 14, span: 24 }}>
                <Button type="primary" htmlType="submit">Cập nhật sản phẩm</Button>
              </Form.Item>
            </Form>
          </Loading>
        </DrawerComponent>
        <ModalComponent title="Xóa sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct}>
          <Loading isLoading={isLoadingDeleted}>
            <div>Bạn có muốn xóa sản phẩm này không?</div>
          </Loading>
        </ModalComponent>
    </div>
  )
}

export default AdminProduct