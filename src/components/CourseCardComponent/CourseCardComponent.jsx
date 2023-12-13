import React from 'react'
import { StyleNameCourse, WrapperCardStyle, WrapperImageStyle, WrapperPriceDiscountText, WrapperPriceText, WrapperReportText, WrapperStyleTextSell } from './style'
import { StarFilled } from '@ant-design/icons';
import logo from '../../assets/images/chinhhang.png'
import { useNavigate } from 'react-router-dom';
import { convertPrice } from '../../utils';

const CourseCardComponent = (props) => {
    const { description, image, courseName, price, subscribed, teacher, id } = props;
    const navigate = useNavigate();
    const handleDetailsCourse = (id) => {
        navigate(`/courses-details/${id}`);
    }

    return (
        <WrapperCardStyle
            hoverable
            headStyle={{width: '200px', height: '200px'}}
            style={{ width: 300 }}
            bodyStyle={{ padding: '10px'}}
            cover={<img alt="example" src={image} />}
            onClick={() => handleDetailsCourse(id)}
        >
            <span>{teacher}</span>
            <StyleNameCourse>{courseName}</StyleNameCourse>

            <WrapperPriceText>
                <span style={{ marginRight: '8px' }}>{convertPrice(price)}</span>
            </WrapperPriceText>
            <span>Đã có {subscribed} người tham gia</span>
        </WrapperCardStyle>
  )
}

export default CourseCardComponent