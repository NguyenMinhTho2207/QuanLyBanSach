import React, { useEffect } from 'react'
import ProductDetailComponent from '../../components/ProductDetailComponent/ProductDetailComponent'
import FooterComponent from '../../components/FooterComponent/FooterComponent'
import { useNavigate, useParams } from 'react-router-dom'

const ProductDetailPage = () => {
  const {id} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Khi component được hiển thị, cuộn lên đầu trang
    window.scrollTo(0, 0);
  }, []); // [] đảm bảo useEffect chỉ chạy sau khi component được render lần đầu tiên

  return (
    <div style={{ backgroundColor: '#efefef' }}>
      <div style={{ padding: '20px 200px 0px 200px', height: '1000px' }}>
        <h4><span style={{cursor: 'pointer'}} onClick={() => {navigate(`/`)}}>Trang chủ</span> - Chi tiết sản phẩm</h4>
        <ProductDetailComponent productId={id}/>
      </div>
      <FooterComponent></FooterComponent>
    </div>
  )
}

export default ProductDetailPage