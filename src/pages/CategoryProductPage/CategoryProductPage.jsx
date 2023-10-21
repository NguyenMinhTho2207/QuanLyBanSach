import React from 'react'
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent'
import CardComponent from '../../components/CardComponent/CardComponent'
import { Col, Pagination, Row } from 'antd'
import { WrapperNavbar, WrapperProducts } from './style'
import FooterComponent from '../../components/FooterComponent/FooterComponent'

const CategoryProductPage = () => {
  const onChange = () => {}
  return (
    <div style={{ width: '100%', backgroundColor: '#efefef' }}>
      <div style={{ padding: '20px 200px 0px 200px' }}>
        <Row style={{ flexWrap: 'nowrap' }}>
            <WrapperNavbar span={4}>
              <NavbarComponent></NavbarComponent>
            </WrapperNavbar>
            <Col span={20}>
              <WrapperProducts>
                  <CardComponent></CardComponent>
                  <CardComponent></CardComponent>
                  <CardComponent></CardComponent>
                  <CardComponent></CardComponent>
                  <CardComponent></CardComponent>
                  <CardComponent></CardComponent>
              </WrapperProducts>
              <Pagination showQuickJumper defaultCurrent={2} total={100} onChange={onChange} 
                style={{textAlign: 'center', marginTop: '20px'}}/>
            </Col>
        </Row>
      </div>
      <FooterComponent></FooterComponent>
    </div>
  )
}

export default CategoryProductPage