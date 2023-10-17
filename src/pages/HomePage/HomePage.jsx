import React from 'react'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import slide1 from '../../assets/images/slide1.jpg'
import slide2 from '../../assets/images/slide2.jpg'
import { Col, Row } from 'antd'
import CardComponent from '../../components/CardComponent/CardComponent'
import { WrapperButtonMore, WrapperProducts } from './style'
// import NavbarComponent from '../../components/NavbarComponent/NavbarComponent'

const HomePage = () => {
  return (
    <div>
      <Row>
        <Col span={24}>
          <SliderComponent arrImages={[slide1, slide2]}></SliderComponent>
        </Col>
      </Row>

      <div className="container" style={{padding: '0px 250px', marginTop: '30px', height: '1000px'}}>
        {/* <NavbarComponent></NavbarComponent> */}
        <WrapperProducts>
          <CardComponent></CardComponent>
          <CardComponent></CardComponent>
          <CardComponent></CardComponent>
          <CardComponent></CardComponent>
          <CardComponent></CardComponent>
        </WrapperProducts>
        <div style={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px'}}>
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
        </div>
      </div>

    </div>
  )
}

export default HomePage