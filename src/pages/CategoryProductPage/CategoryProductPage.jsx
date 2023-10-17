import React from 'react'
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent'
import CardComponent from '../../components/CardComponent/CardComponent'
import { Col, Row } from 'antd'

const CategoryProductPage = () => {
  return (
    <Row style={{padding: '0 250px', flexWrap: 'nowrap', marginTop: '10px'}}>
        <Col span={4} style={{background: '#cccc',marginRight: '10px', padding: '10px', borderRadius: '6px'}}>
            <NavbarComponent></NavbarComponent>
        </Col>
        <Col span={20}>
            <CardComponent></CardComponent>
        </Col>
    </Row>
  )
}

export default CategoryProductPage