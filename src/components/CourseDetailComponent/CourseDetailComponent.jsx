import React, { useEffect, useState } from 'react'
import * as CourseService from '../../services/CourseService'
import { useQuery } from '@tanstack/react-query';
import { Col, Row, message } from 'antd';
import { convertPrice } from '../../utils'
import { WrapperBoxCourse } from './style';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import { VideoCameraFilled, PlayCircleFilled, ClockCircleFilled, EyeFilled, QuestionCircleFilled, FileTextFilled } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useMutationHooks } from '../../hooks/useMutationHook'

const CourseDetailComponent = ({courseId}) => {
    const user = useSelector((state) => state.user);
    const [isRegistered, setIsRegistered] = useState(false);

    const fetchGetDetailsCourse = async (context) => {
        const id = context?.queryKey && context?.queryKey[1];

        if (id) {
            const res = await CourseService.getDetailsCourse(id);
            return res.data;
        }
    }

    const { isLoading, data: courseDetails } = useQuery({
        queryKey: ['course-details', courseId],
        queryFn: fetchGetDetailsCourse,
        config: {
            enabled: courseId !== undefined,
        },
    });

    const handleRegisterCourse = () => {
        if (user?.access_token && user?.id && user?.address && user?.avatar && user?.phone_number) {
            mutationRegisterCourse.mutate({ 
                user_id: user?.id,
                user_name: user?.name || user?.email,
                address: user?.address,
                avatar: user?.avatar,
                phone_number: user?.phone_number,
                course_id: courseDetails?.id,
                course_name: courseDetails?.course_name
            });
        }
        else {
            message.warning("Hãy cập nhật đầy đủ thông tin cá nhân trong trang thông tin người dùng!");
        }
    }

    const mutationRegisterCourse = useMutationHooks(
        (data) => {
            const { ...rests } = data;
            const res = CourseService.registerCourse({ ...rests });

            return res;
        },
    )

    const { isPending, isSuccess, isError, data } = mutationRegisterCourse;

    useEffect(() => {
        if (data?.message == "Success") {
            message.success('Đăng ký khóa học thành công');
            setIsRegistered(true);
        }
    }, [isSuccess, isError])

    useEffect(() => {
        // Call the getRegisterCourse function when the component mounts
        const fetchData = async () => {
          try {
            const registerCourseData = await CourseService.getRegisterCourse(user?.id, courseDetails?.id);
    
            if (registerCourseData.status === 'OK') {
              setIsRegistered(true);
            }
          } catch (error) {
            console.error('Error fetching register course data:', error);
          }
        };
    
        fetchData();
    }, []);

    const handleCancelRegisterCourse = () => {
        mutationCancelRegisterCourse.mutate({ 
            user_id: user?.id,
            course_id: courseDetails?.id,
        });
    }

    const mutationCancelRegisterCourse = useMutationHooks(
        (data) => {
            const { user_id, course_id } = data;
            const res = CourseService.cancelRegisterCourse(user_id, course_id);

            return res;
        },
    )

    const { isSuccess: CancelRegisterCourseIsSuccess, isError: CancelRegisterCourseIsError, data: CancelRegisterCourseData } = mutationCancelRegisterCourse;

    useEffect(() => {
        if (CancelRegisterCourseData?.message == "Success") {
            message.success('Hủy đăng ký khóa học thành công');
            setIsRegistered(false);
        }
    }, [CancelRegisterCourseIsSuccess, CancelRegisterCourseIsError])

    return (
        <div>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={16}>
                    <h1 style={{width: '100%', color: '#0f85a2'}}>{courseDetails?.course_name}</h1>
                    <img src={courseDetails?.image} alt="img" style={{width: '100%', borderRadius: '20px'}}/>
                </Col>

                <WrapperBoxCourse xs={24} sm={24} md={6}>
                    <h1 style={{color: 'red', textAlign: 'center'}}>{convertPrice(courseDetails?.price)}</h1>

                    <div style={{display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <ul style={{padding: '0px'}}>
                            <li style={{ listStyle: 'none', fontSize: '16px' }}><PlayCircleFilled style={{ fontSize: '20px', marginRight: '10px' }} />Giảng viên: {courseDetails?.teacher}</li>
                        </ul>
                        <ul style={{padding: '0px'}}>
                            <li style={{ listStyle: 'none', fontSize: '16px' }}><ClockCircleFilled style={{ fontSize: '20px', marginRight: '10px' }} />Thời lượng học {courseDetails?.schedule} tháng</li>
                        </ul>
                        <ul style={{padding: '0px'}}>
                            <li style={{ listStyle: 'none', fontSize: '16px' }}><VideoCameraFilled style={{ fontSize: '20px', marginRight: '10px' }} />Học online</li>
                        </ul>
                        <ul style={{padding: '0px'}}>
                            <li style={{ listStyle: 'none', fontSize: '16px' }}><EyeFilled style={{ fontSize: '20px', marginRight: '10px' }}/>Video chuẩn HD xem trên nhiều thiết bị: mobile, tablet, laptop, PC</li>
                        </ul>
                        <ul style={{padding: '0px'}}>
                            <li style={{ listStyle: 'none', fontSize: '16px' }}><QuestionCircleFilled style={{ fontSize: '20px', marginRight: '10px' }} />Có giảng viên hỗ trợ</li>
                        </ul>
                        <ul style={{padding: '0px'}}>
                            <li style={{ listStyle: 'none', fontSize: '16px' }}><FileTextFilled style={{ fontSize: '20px', marginRight: '10px' }} />{courseDetails?.description}</li>
                        </ul>
                    </div>

                    {isRegistered ? (
                        <div style={{ gap: '5px', display: 'flex', flexDirection: 'column' }}>
                            <ButtonComponent
                                size={40}
                                styleButton={{
                                    background: 'rgb(0 195 255)',
                                    height: '48px',
                                    width: '100%',
                                    border: 'none',
                                    borderRadius: '25px',
                                    cursor: 'not-allowed'
                                }}
                                textButton={'Đã đăng ký'}
                                styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                            ></ButtonComponent>

                            <ButtonComponent
                                onClick={() => handleCancelRegisterCourse()}
                                size={40}
                                styleButton={{
                                    background: 'rgb(190 76 59)',
                                    height: '48px',
                                    width: '100%',
                                    border: 'none',
                                    borderRadius: '25px',
                                }}
                                textButton={'Hủy đăng ký'}
                                styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                            ></ButtonComponent>
                        </div>
                        ) : (
                        <ButtonComponent
                            onClick={() => handleRegisterCourse()}
                            size={40}
                            styleButton={{
                            background: 'rgb(255, 57, 69)',
                            height: '48px',
                            width: '100%',
                            border: 'none',
                            borderRadius: '25px',
                            }}
                            textButton={'Đăng ký khóa học'}
                            styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                    )}
                </WrapperBoxCourse>
            </Row>
        </div>
    )
}

export default CourseDetailComponent