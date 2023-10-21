import React from 'react'
import ProductDetailComponent from '../../components/ProductDetailComponent/ProductDetailComponent'
import FooterComponent from '../../components/FooterComponent/FooterComponent'

const ProductDetailPage = () => {
  return (
    <div style={{ backgroundColor: '#efefef' }}>
      <div style={{ padding: '20px 200px 0px 200px', height: '1000px' }}>
        <h2>Trang chủ</h2>
        <ProductDetailComponent />
      </div>
      <FooterComponent></FooterComponent>
    </div>
  )
}

export default ProductDetailPage