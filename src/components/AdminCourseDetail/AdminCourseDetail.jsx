import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import { Button, Form, Space } from 'antd'
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import * as CourseService from '../../services/CourseService'
import avatarDefault from '../../assets/images/user/user-default.png'

const AdminCourseDetail = () => {
  const user = useSelector((state) => state?.user);

  const getAllRegisterCourse = async () => {
    const res = await CourseService.getAllRegisterCourse(user?.access_token);
    return res;
  }

  const queryCourse = useQuery({
    queryKey: ['courses'],
    queryFn: getAllRegisterCourse,
    retry: 3,
    retryDelay: 1000,
  });

  const { isLoading: isLoadingCourse, data: courses } = queryCourse;

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
      title: 'Avatar',
      dataIndex: 'avatar',
      render: (text) => <img src={text ? text : avatarDefault} style={{height: '90px',  width: '90px', borderRadius: '50%', objectFit: 'cover'}} alt='avatar'/>
    },
    {
      title: 'Tên người dùng',
      dataIndex: 'user_name',
      sorter: (a, b) => a.user_name.localeCompare(b.user_name),
      ...getColumnSearchProps('user_name', 'tên người dùng')
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
      title: 'Tên khóa học đăng ký',
      dataIndex: 'course_name',
      sorter: (a, b) => a.course_name.localeCompare(b.course_name),
      ...getColumnSearchProps('course_name', 'tên khóa học đăng ký')
    },
  ];

  const dataTable = courses?.data?.map((course) => {
    return {
      ...course,
      createdAt: new Date(course.createdAt),
      updatedAt: new Date(course.updatedAt),
    }
  });

  return (
    <div>
        <WrapperHeader>Chi tiết đăng ký khóa học</WrapperHeader>
        <div style={{ marginTop: '20px' }}>
          <TableComponent columns={columns} data={dataTable} isLoading={isLoadingCourse}></TableComponent>
        </div>
    </div>
  )
}

export default AdminCourseDetail