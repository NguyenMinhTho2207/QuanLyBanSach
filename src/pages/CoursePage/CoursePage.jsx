import React from 'react'
import { WrapperButtonMore, WrapperProducts } from './style'
import { useQuery } from '@tanstack/react-query'
import * as CourseService from '../../services/CourseService';
import CourseCardComponent from '../../components/CourseCardComponent/CourseCardComponent';

const CoursePage = () => {
  const fetchCourseAll = async () => {
    const res = await CourseService.getAllCourse();

    return res;
  }

  const { isLoading, data: courses } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourseAll,
    retry: 3,
    retryDelay: 1000,
  });

  return (
    <div className="container" style={{padding: '20px 200px 0px 200px', height: '1000px' }}>
        <WrapperProducts>
          {courses?.data?.map((course) => {
            return (
              <CourseCardComponent 
                key={course.id} 
                description={course.description} 
                image={course.image}
                courseName={course.course_name}
                price={course.price}
                subscribed={course.student_count}
                teacher={course.teacher}
                id={course.id} 
              ></CourseCardComponent>
            )
          })}
        </WrapperProducts>
        {/* <div style={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px'}}>
          <WrapperButtonMore textButton="Xem thêm" type="outline" 
            styleButton={{
              border: '1px solid rgb(11, 116, 229)', 
              color: 'rgb(11, 116, 229)',
              width: '240px',
              height: '38px',
              borderRadius: '4px',
            }}
            styleTextButton={{fontWeight: 500}}>
          </WrapperButtonMore>
        </div> */}
      </div>
  )
}

export default CoursePage