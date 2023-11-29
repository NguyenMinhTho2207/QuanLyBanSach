import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader } from './style'
import { Button, Form, Space } from 'antd'
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import * as ProductCategoryService from '../../services/ProductCategoryService'
import { useMutationHooks } from '../../hooks/userMutationHook'
import Loading from '../LoadingComponent/Loading'
import * as message from '../Message/Message'
import ModalComponent from '../ModalComponent/ModalComponent'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import moment from 'moment/moment'

const AdminProductCategory = () => {
  const [modalForm] = Form.useForm();
  const [drawerForm] = Form.useForm();
  const [rowSelected, setRowSelected] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const searchInput = useRef(null);

  const user = useSelector((state) => state?.user);

  const [stateCategory, setStateCategory] = useState({
    product_category_name: ''
  });

  const [stateCategoriesDetails, setStateCategoriesDetails] = useState({
    product_category_name: ''
  });

  const mutation = useMutationHooks(
    (data) => { 
      const { product_category_name } = data;
      const res = ProductCategoryService.createCategory( {product_category_name} );
      return res;
    }
  );

  const mutationUpdate = useMutationHooks(
    (data) => { 
      const { id, token, ...rests } = data;
  
      const resCategory = ProductCategoryService.updateCategory(id, token, { ...rests });
  
      return resCategory;
    }
  );

  const mutationDeleted = useMutationHooks(
    (data) => { 
      const { id, token } = data;
  
      const res = ProductCategoryService.deleteCategory(id, token);
  
      return res;
    }
  );

  const mutationDeletedMultiple = useMutationHooks(
    (data) => { 
      const { token, ids } = data;
      const res = ProductCategoryService.deleteMultipleCategories(ids, token);

      return res;
    }
  );

  const handleDeleteMultipleCategories = (ids) => {
    mutationDeletedMultiple.mutate(
      {
        ids: ids, 
        token: user?.access_token
      },
      {
        onSettled: () => {
          queryCategory.refetch();
        }
      }
    )
  }

  const { data, isSuccess, isError, isPending } = mutation;
  const { data: dataUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated, isPending: isLoadingUpdated } = mutationUpdate;
  const { data: dataDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted, isPending: isLoadingDeleted } = mutationDeleted;
  const { data: dataDeletedMultiple, isSuccess: isSuccessDeletedMultiple, isError: isErrorDeletedMultiple, isPending: isLoadingDeletedMultiple } = mutationDeletedMultiple;
  
  const fetchGetDetailsCategory = async (rowSelected) => {
    const resCategoriesDetails = await ProductCategoryService.getDetailsCategory(rowSelected);

    if (resCategoriesDetails?.data) {
        setStateCategoriesDetails({
            product_category_name: resCategoriesDetails?.data.product_category_name
        })
    }

    setIsLoadingUpdate(false);
  }

  useEffect(() => {
    const formValues = {
      product_category_name: stateCategoriesDetails.product_category_name,
    };

    drawerForm.setFieldsValue(formValues);
  }, [stateCategoriesDetails, drawerForm]);

  useEffect(() => {
    if (rowSelected) {
        fetchGetDetailsCategory(rowSelected);
    }
  }, [rowSelected])

  const getAllCategories = async () => {
    const resAllCategory = await ProductCategoryService.getAllCategory();
    return resAllCategory;
  }
  
  const queryCategory = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
    retry: 3,
    retryDelay: 1000,
  });
  
  const { isLoading: isLoadingCategory, data: categories } = queryCategory;

  useEffect(() => {
    if(isSuccess && categories?.message === 'Success') {
      message.success("Tạo dạnh mục sản phẩm thành công");
      handleCancel();
    }
    else if (isError) {
      message.error("Có gì đó sai sai");
    }
  }, [isSuccess])

  useEffect(() => {
    if(isSuccessUpdated && dataUpdated?.message === 'Success') {
      message.success("Cập nhật danh mục sản phẩm thành công");
      handleCloseDrawer();
    }
    else if (isErrorUpdated) {
      message.error("Có gì đó sai sai");
    }
  }, [isSuccessUpdated])
  
  useEffect(() => {
    if(isSuccessDeleted && dataDeleted?.message === 'Delete product category success') {
      message.success("Xóa danh mục sản phẩm thành công");
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
            message.success("Xóa danh mục sản phẩm thành công");
        } else {
            message.error("Không có danh mục sản phẩm nào được xóa thành công");
        }
    } else if (isErrorDeletedMultiple) {
        message.error("Có gì đó sai sai");
    }
  }, [isSuccessDeletedMultiple, isErrorDeletedMultiple, dataDeletedMultiple]);
  
  const handleCancel = () => {
    setIsModalOpen(false);
    setStateCategory({
        product_category_name: ''
    });

    modalForm.resetFields();
  };

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    // setStateCategoriesDetails({
    //   product_category_name: ''
    // });

    // drawerForm.resetFields();
  };

  const onFinish = () => {
    mutation.mutate(stateCategory, {
        onSettled: () => {
            queryCategory.refetch();
        }
    })
  }

  const handleOnChange = (e) => {
    setStateCategory({
        ...stateCategory,
        [e.target.name]: e.target.value
    });
  }

  const onUpdateCategory = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected, 
        token: user?.access_token,
        ...stateCategoriesDetails
      }, 
      {
        onSettled: () => {
            queryCategory.refetch();
        }
      }
    )
  }

  const handleDetailsCategory = () => {
    setIsOpenDrawer(true);
  }

  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined style={{color: 'red', fontSize: '30px', cursor: 'pointer'}} onClick={() => setIsModalOpenDelete(true)}/>
        <EditOutlined style={{color: 'orange', fontSize: '30px', cursor: 'pointer'}} onClick={handleDetailsCategory}/>
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
      title: 'Danh mục',
      dataIndex: 'product_category_name',
      sorter: (a, b) => a.product_category_name.localeCompare(b.product_category_name),
      ...getColumnSearchProps('product_category_name', 'danh mục sản phẩm')
    },
    {
      title: 'Thời gian tạo',
      dataIndex: 'createdAt',
      sorter: (a, b) => a.createdAt - b.createdAt,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'Thời gian cập nhật',
      dataIndex: 'updatedAt',
      sorter: (a, b) => a.createdAt - b.createdAt,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: renderAction
    },
  ];
  
  const dataTable = categories?.data.map((category) => {
    return {
      ...category, 
      key: category.id,
      createdAt: new Date(category.createdAt),
      updatedAt: new Date(category.updatedAt),
    }
  });

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  }

  const handleDeleteCategory = () => {
    mutationDeleted.mutate(
      {
        id: rowSelected, 
        token: user?.access_token
      },
      {
        onSettled: () => {
            queryCategory.refetch();
        }
      }
    )
  }

  const handleOnChangeDetails = (e) => {
    setStateCategoriesDetails({
      ...stateCategoriesDetails,
      [e.target.name]: e.target.value
    });
  }

  return (
    <div>
      <WrapperHeader>Quản lý danh mục sản phẩm</WrapperHeader>
      <div style={{ marginTop: '10px'}}>
          <Button style={{ height: '100px', width: '100px', borderRadius: '6px', borderStyle: 'dashed' }} onClick={() => setIsModalOpen(true)}><PlusOutlined style={{ fontSize: '60px' }}/></Button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <TableComponent handleDeleteMultiple={handleDeleteMultipleCategories} columns={columns} data={dataTable} isLoading={isLoadingCategory} 
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
      <ModalComponent forceRender title="Tạo danh mục sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Loading isLoading={isPending}>
          <Form
            name="modalForm"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
            form={modalForm}
          >
            <Form.Item
              label="Tên danh mục"
              name="product_category_name"
              rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
            >
              <InputComponent value={ stateCategory.product_category_name } onChange={handleOnChange} name="product_category_name"/>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 18, span: 16 }}>
                <Button type="primary" htmlType="submit">Tạo danh mục</Button>
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
      <DrawerComponent forceRender title='Chi tiết danh mục sản phẩm' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="30%">
        <Loading isLoading={isLoadingUpdate || isLoadingUpdated || isLoadingDeletedMultiple}>
          <Form
            name="drawerForm"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 20 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onUpdateCategory}
            autoComplete="off"
            form={drawerForm}
          >
            <Form.Item
                label="Tên danh mục"
                name="product_category_name"
                rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
            >
                <InputComponent value={ stateCategoriesDetails.product_category_name } onChange={handleOnChangeDetails} name="product_category_name"/>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 15, span: 16 }}>
                <Button type="primary" htmlType="submit">Cập nhật danh mục</Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>
      <ModalComponent title="Xóa danh mục" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteCategory}>
          <Loading isLoading={isLoadingDeleted}>
              <div>Bạn có muốn xóa danh mục này không?</div>
          </Loading>
      </ModalComponent>
    </div>
  )
}

export default AdminProductCategory