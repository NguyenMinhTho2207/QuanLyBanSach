import React from 'react';
import SliderComponent from '../../components/SliderComponent/SliderComponent';
import slide1 from '../../assets/images/slide1.jpg';
import slide2 from '../../assets/images/slide2.jpg';
import { Col, Row } from 'antd';
import FooterComponent from '../../components/FooterComponent/FooterComponent';
import verify from '../../assets/images/chat-luong-cua-cuon-removebg-preview.png'
import delivery from '../../assets/images/iconen_vervoer_4_auto-01-80x80.png'

const HomePage = () => {

  return (
    <div style={{ backgroundColor: '#efefef' }}>
      <Row justify="center" align="middle">
        <Col span={24}>
          <SliderComponent arrImages={[slide1, slide2]}></SliderComponent>
        </Col>
      </Row>
      <div>
        <Row justify="center">
          <Col xs={24} sm={22} md={20} lg={18} xl={16} style={{textAlign: 'center', marginTop: '10px', background: '#2196F3', color: '#fff', padding: '0px'}}>
            <h3>Sản phẩm bán chạy</h3>
          </Col>
        </Row>
        <Row justify="center">
            <Col xs={24} sm={22} md={20} lg={18} xl={16} style={{ textAlign: 'center', marginTop: '10px', color: '#fff', padding: '0px' }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '10px', border: '1px solid #000' }}>
                    <img src={verify} alt="" style={{ maxWidth: '100%', borderRadius: '10px 10px 0 0' }} />
                    <span style={{ padding: '10px', color: 'red'} }><strong>CAM KẾT HÀNG CHÍNH HÃNG</strong></span>
                  </div>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '10px', border: '1px solid #000' }}>
                    <img src={delivery} alt="" style={{ maxWidth: '100%', borderRadius: '10px 10px 0 0' }} />
                    <span style={{ padding: '10px', color: '#4D65DB' }}><strong>GIAO HÀNG TẬN NƠI</strong></span>
                  </div>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '10px', border: '1px solid #000' }}>
                    <img src={verify} alt="" style={{ maxWidth: '100%', borderRadius: '10px 10px 0 0' }} />
                    <span style={{ padding: '10px', color: '#339966' }}><strong>TƯ VẤN NHIỆT TÌNH</strong></span>
                  </div>
                </Col>
              </Row>
          </Col>
        </Row>
      </div>
      <FooterComponent></FooterComponent>
    </div>
  );
};

export default HomePage;
