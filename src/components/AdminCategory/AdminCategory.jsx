import React, { useEffect, useState } from 'react'
import { WrapperHeader } from './style'
import { Button, Form, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import * as CategoryService from '../../services/CategoryService'
import { useMutationHooks } from '../../hooks/userMutationHook'
import Loading from '../LoadingComponent/Loading'
import * as message from '../../components/Message/Message'

const AdminCategory = () => {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stateCategory, setStateCategory] = useState({
        category_name: ''
    });

    const mutation = useMutationHooks(
        (data) => { 
            const { category_name } = data;
            const res = CategoryService.createCategory( {category_name} );
            return res;
        }
    );

    const { data, isSuccess, isError, isPending } = mutation;

    useEffect(() => {
        if(isSuccess && data?.message === 'Success') {
            message.success("Tạo dạnh mục sản phẩm thành công");
            handleCancel();
        }
        else if (isError) {
            message.error("Có gì đó sai sai");
        }
    }, [isSuccess])
    
    const handleCancel = () => {
        setIsModalOpen(false);
        setStateCategory({
            category_name: ''
        });

        form.resetFields();
    };

    const onFinish = () => {
        mutation.mutate(stateCategory)
    }

    const handleOnChange = (e) => {
        setStateCategory({
        ...stateCategory,
        [e.target.name]: e.target.value
        });
    }

    return (
        <div>
            <WrapperHeader>Quản lý danh mục sản phẩm</WrapperHeader>
                <div style={{ marginTop: '10px'}}>
                    <Button style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }} onClick={() => setIsModalOpen(true)}><PlusOutlined style={{ fontSize: '60px' }}/></Button>
                </div>
                <div style={{ marginTop: '20px' }}>
                    <TableComponent></TableComponent>
                </div>
            <Modal title="Tạo danh mục sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <Loading isLoading={isPending}>
                    <Form
                        name="basic"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        style={{ maxWidth: 600 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        autoComplete="off"
                        form={form}
                    >
                    <Form.Item
                        label="Tên danh mục"
                        name="category_name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
                    >
                        <InputComponent value={ stateCategory.category_name } onChange={handleOnChange} name="category_name"/>
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 18, span: 16 }}>
                        <Button type="primary" htmlType="submit">Tạo danh mục</Button>
                    </Form.Item>
                    </Form>
                </Loading>
            </Modal>
        </div>
    )
}

export default AdminCategory