import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader } from './style'
import { Button, Form, Select, Space } from 'antd'
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import { WrapperUploadFile } from '../../pages/ProfilePage/style'
import { convertPrice, getBase64 } from '../../utils'
import * as CourseService from '../../services/CourseService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import { useQuery } from '@tanstack/react-query'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import { useSelector } from 'react-redux'
import ModalComponent from '../ModalComponent/ModalComponent'

const AdminCourse = () => {
  const [modalForm] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState();
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const user = useSelector((state) => state?.user);
  const searchInput = useRef(null);

  const [stateCourses, setStateCourses] = useState({
    course_name: '',
    image: '',
    schedule: '',
    description: '',
    student_count: '',
    teacher: '',
    price: ''
  });

  const [stateCoursesDetails, setStateCoursesDetails] = useState({
    course_name: '',
    image: '',
    schedule: '',
    description: '',
    student_count: '',
    teacher: '',
    price: ''
  });

  const mutation = useMutationHooks(
    (data) => { 
      const { 
        course_name,
        image,
        schedule,
        description,
        student_count,
        teacher,
        price
      } = data;

      const resCourse = CourseService.createCourse({
        course_name,
        image,
        schedule,
        description,
        student_count,
        teacher,
        price
      });

      return resCourse;
    }
  );

  const mutationUpdate = useMutationHooks(
    (data) => { 
      const { id, token, ...rests } = data;

      const resCourse = CourseService.updateCourse(id, token, { ...rests });

      return resCourse;
    }
  );

  const mutationDeleted = useMutationHooks(
    (data) => { 
      const { id, token } = data;

      const res = CourseService.deleteCourse(id, token);

      return res;
    }
  );

  const mutationDeletedMultiple = useMutationHooks(
    (data) => { 
      const { token, ids } = data;
      const res = CourseService.deleteMultipleCourses(ids, token);

      return res;
    }
  );

  const handleDeleteMultipleCourses = (ids) => {
    mutationDeletedMultiple.mutate(
      {
        ids: ids, 
        token: user?.access_token
      },
      {
        onSettled: () => {
          queryCourse.refetch();
        }
      }
    )
  }
  
  const { data, isSuccess, isError, isPending } = mutation;
  const { data: dataUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated, isPending: isLoadingUpdated } = mutationUpdate;
  const { data: dataDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted, isPending: isLoadingDeleted } = mutationDeleted;
  const { data: dataDeletedMultiple, isSuccess: isSuccessDeletedMultiple, isError: isErrorDeletedMultiple, isPending: isLoadingDeletedMultiple } = mutationDeletedMultiple;

  const getAllCourses = async () => {
    const resAllCourse = await CourseService.getAllCourse();
    return resAllCourse;
  }

  const queryCourse = useQuery({
    queryKey: ['courses'],
    queryFn: getAllCourses,
    retry: 3,
    retryDelay: 1000,
  });

  const { isLoading: isLoadingCourse, data: courses } = queryCourse;

  useEffect(() => {
    if(isSuccess && courses?.message === 'Success') {
      message.success("Tạo khóa học thành công");
      handleCancel();
    }
    else if (isError) {
      message.error("Có gì đó sai sai");
    }
  }, [isSuccess])

  useEffect(() => {
    if(isSuccessUpdated && dataUpdated?.message === 'Success') {
      message.success("Cập nhật khóa học thành công");
      handleCloseDrawer();
    }
    else if (isErrorUpdated) {
      message.error("Có gì đó sai sai");
    }
  }, [isSuccessUpdated])

  useEffect(() => {
    if(isSuccessDeleted && dataDeleted?.message === 'Delete courses success') {
      message.success("Xóa khóa học thành công");
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
            message.success("Xóa khóa học thành công");
        } else {
            message.error("Không có khóa học nào được xóa thành công");
        }
    } else if (isErrorDeletedMultiple) {
        message.error("Có gì đó sai sai");
    }
  }, [isSuccessDeletedMultiple, isErrorDeletedMultiple, dataDeletedMultiple]);

  const fetchGetDetailsCourse = async (rowSelected) => {
    const resCoursesDetails = await CourseService.getDetailsCourse(rowSelected);

    if (resCoursesDetails?.data) {
      setStateCoursesDetails({
        course_name: resCoursesDetails?.data.course_name,
        image: resCoursesDetails?.data.image,
        schedule: resCoursesDetails?.data.schedule,
        description: resCoursesDetails?.data.description,
        student_count: resCoursesDetails?.data.student_count,
        teacher: resCoursesDetails?.data.teacher,
        price: resCoursesDetails?.data.price,
      })
    }

    setIsLoadingUpdate(false);
  }

  const [drawerForm] = Form.useForm();
  
  useEffect(() => {
    const formValues = {
      course_name: stateCoursesDetails.course_name,
      image: stateCoursesDetails.image,
      schedule: stateCoursesDetails.schedule,
      description: stateCoursesDetails.description,
      student_count: stateCoursesDetails.student_count,
      teacher: stateCoursesDetails.teacher,
      price: stateCoursesDetails.price,
    };

    drawerForm.setFieldsValue(formValues);
  }, [stateCoursesDetails, drawerForm]);

  useEffect(() => {
    if (rowSelected) {
      fetchGetDetailsCourse(rowSelected);
    }
  }, [rowSelected])
  
  const handleDetailsCourse = () => {
    setIsOpenDrawer(true);
  }

  const handleDeleteCourse = () => {
    mutationDeleted.mutate(
      {
        id: rowSelected, 
        token: user?.access_token
      },
      {
        onSettled: () => {
          queryCourse.refetch();
        }
      }
    )
  }

  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined style={{color: 'red', fontSize: '30px', cursor: 'pointer'}} onClick={() => setIsModalOpenDelete(true)}/>
        <EditOutlined style={{color: 'orange', fontSize: '30px', cursor: 'pointer'}} onClick={handleDetailsCourse}/>
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
      title: 'Hình ảnh khóa học',
      dataIndex: 'image',
      render: (text) => <img src={text} style={{height: '80px',  width: '150px', borderRadius: '10px', objectFit: 'cover'}} alt='avatar'/>
    },
    {
      title: 'Tên khóa học',
      dataIndex: 'course_name',
      sorter: (a, b) => a.course_name.localeCompare(b.course_name),
      ...getColumnSearchProps('course_name', 'tên khóa học')
    },
    {
      title: 'Tên giảng viên',
      dataIndex: 'teacher',
      sorter: (a, b) => a.course_name.localeCompare(b.course_name),
      ...getColumnSearchProps('teacher', 'tên khóa học')
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      sorter: (a, b) => a.description.localeCompare(b.description),
      ...getColumnSearchProps('description', 'danh mục khóa học')
    },
    {
      title: 'Số lượng đã mua',
      dataIndex: 'student_count',
      sorter: (a, b) => a.student_count - b.student_count,
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
          return record.student_count <= 10
        }
        else if (value === '>=') {
          return record.student_count >= 10
        }
      },
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
        <span>{convertPrice(text)}</span>
      )
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: renderAction
    },
  ];

  const dataTable = courses?.data?.map((course) => {
    return {
      ...course, 
      key: course.id,
      createdAt: new Date(course.createdAt),
      updatedAt: new Date(course.updatedAt),
    }
  });
  
  const handleCancel = () => {
    setIsModalOpen(false);
    setStateCourses({
      course_name: '',
      image: '',
      schedule: '',
      description: '',
      student_count: '',
      teacher: '',
      user_id: '',
    });

    modalForm.resetFields();
  };

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  }

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
  };

  const onFinish = () => {
    mutation.mutate(stateCourses, {
      onSettled: () => {
        queryCourse.refetch();
      }
    });
  }

  const handleOnChange = (e) => {
    setStateCourses({
      ...stateCourses,
      [e.target.name]: e.target.value
    });
  }

  const handleOnChangeDetails = (e) => {
    setStateCoursesDetails({
      ...stateCoursesDetails,
      [e.target.name]: e.target.value
    });
  }

  const handleOnChangeAvatar = async ({fileList}) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setStateCourses({
      ...stateCourses,
      image: file.preview
    })
  }

  const handleOnChangeAvatarDetails = async ({fileList}) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setStateCoursesDetails({
      ...stateCoursesDetails,
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

  const onUpdateCourse = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected, 
        token: user?.access_token, 
        ...stateCoursesDetails
      }, 
      {
        onSettled: () => {
          queryCourse.refetch();
        }
      }
    )
  }

  return (
    <div>
        <WrapperHeader>Quản lý khóa học</WrapperHeader>
        <div style={{ marginTop: '10px'}}>
          <Button style={{ height: '100px', width: '100px', borderRadius: '6px', borderStyle: 'dashed' }} onClick={() => setIsModalOpen(true)}><PlusOutlined style={{ fontSize: '60px' }}/></Button>
        </div>
        <div style={{ marginTop: '20px' }}>
          <TableComponent handleDeleteMultiple={handleDeleteMultipleCourses} columns={columns} data={dataTable} isLoading={isLoadingCourse} 
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
        <ModalComponent forceRender title="Tạo khóa học" open={isModalOpen} onCancel={handleCancel} footer={null}>
          <Loading isLoading={isPending}>
            <Form
              name="modalForm"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 24 }}
              style={{ maxWidth: 800 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              autoComplete="on"
              form={modalForm}
            >
              <Form.Item
                label="Tên khóa học"
                name="course_name"
                rules={[{ required: true, message: 'Vui lòng nhập tên khóa học!' }]}
              >
                <InputComponent value={ stateCourses.course_name } onChange={handleOnChange} name="course_name"/>
              </Form.Item>

              <Form.Item
                label="Tên giảng viên"
                name="teacher"
                rules={[{ required: true, message: 'Vui lòng nhập tên giảng viên!' }]}
              >
                <InputComponent value={ stateCourses.teacher } onChange={handleOnChange} name="teacher"/>
              </Form.Item>

              <Form.Item
                label="Mô tả khóa học"
                name="description"
                rules={[{ required: true, message: 'Vui lòng nhập mô tả khóa học!' }]}
              >
                <InputComponent value={ stateCourses.description } onChange={handleOnChange} name="description"/>
              </Form.Item>

              <Form.Item
                label="Giá"
                name="price"
                rules={[{ required: true, message: 'Vui lòng nhập giá khóa học!' }]}
              >
                <InputComponent type="number" value={ stateCourses.price } onChange={handleOnChange} name="price" min="1"/>
              </Form.Item>

              <Form.Item
                label="Hình ảnh khóa học"
                name="image"
                rules={[{ required: true, message: 'Vui lòng chọn ảnh khóa học!' }]}
              >
                <WrapperUploadFile onChange={handleOnChangeAvatar} maxCount={1}>
                  <Button>Select File</Button>
                  {stateCourses?.image && (
                    <img src={stateCourses?.image} style={{height: '180px',  width: '315px', borderRadius: '10px', objectFit: 'cover'}} alt='avatar'/>
                  )}
                </WrapperUploadFile>
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 18, span: 16 }}>
                <Button type="primary" htmlType="submit">Tạo khóa học</Button>
              </Form.Item>
            </Form>
          </Loading>
        </ModalComponent>
        <DrawerComponent forceRender title='Chi tiết khóa học' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="40%">
          <Loading isLoading={isLoadingUpdate || isLoadingUpdated || isLoadingDeletedMultiple}>
            <Form
              name="drawerForm"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 20 }}
              style={{ maxWidth: 700 }}
              initialValues={{ remember: true }}
              onFinish={onUpdateCourse}
              autoComplete="on"
              form={drawerForm}
            >
              <Form.Item
                label="Tên khóa học"
                name="course_name"
                rules={[{ required: true, message: 'Vui lòng nhập tên khóa học!' }]}
              >
                <InputComponent value={stateCoursesDetails.course_name} onChange={handleOnChangeDetails} name="course_name"/>
              </Form.Item>

              <Form.Item
                label="Tên giảng viên"
                name="teacher"
                rules={[{ required: true, message: 'Vui lòng nhập tên giảng viên!' }]}
              >
                <InputComponent value={ stateCoursesDetails.teacher } onChange={handleOnChange} name="teacher"/>
              </Form.Item>

              <Form.Item
                label="Mô tả khóa học"
                name="description"
                rules={[{ required: true, message: 'Vui lòng nhập mô tả khóa học!' }]}
              >
                <InputComponent value={ stateCoursesDetails.description } onChange={handleOnChange} name="description"/>
              </Form.Item>

              <Form.Item
                label="Giá"
                name="price"
                rules={[{ required: true, message: 'Vui lòng nhập giá khóa học!' }]}
              >
                <InputComponent type="number" value={ stateCoursesDetails.price } onChange={handleOnChange} name="price" min="1"/>
              </Form.Item>

              <Form.Item
                label="Hình ảnh khóa học"
                name="image"
                rules={[{ required: true, message: 'Vui lòng chọn ảnh khóa học!' }]}
              >
                <WrapperUploadFile onChange={handleOnChangeAvatarDetails} maxCount={1}>
                  <Button>Select File</Button>
                  {stateCoursesDetails?.image && (
                    <img src={stateCoursesDetails?.image} style={{height: '180px',  width: '315px', borderRadius: '10px', objectFit: 'cover'}} alt='avatar'/>
                  )}
                </WrapperUploadFile>
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 14, span: 24 }}>
                <Button type="primary" htmlType="submit">Cập nhật khóa học</Button>
              </Form.Item>
            </Form>
          </Loading>
        </DrawerComponent>
        <ModalComponent title="Xóa khóa học" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteCourse}>
          <Loading isLoading={isLoadingDeleted}>
            <div>Bạn có muốn xóa khóa học này không?</div>
          </Loading>
        </ModalComponent>
    </div>
  )
}

export default AdminCourse