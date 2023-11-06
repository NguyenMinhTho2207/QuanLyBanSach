import React from 'react'
import { WrapperFooterContainer } from './style'

const FooterComponent = () => {
  return (
    <div>
        <WrapperFooterContainer>
            <div>
                <h3>THÔNG TIN LIÊN HỆ</h3>
                <p>CÔNG TY TNHH ĐẦU TƯ GIÁO DỤC KHAI MINH</p>
                <p>Địa chỉ: Số 2, đường 30, phường Tân Quy, quận 7, Tp.HCM</p>
                <p>Hotline: 0918.191.613</p>
                <p>Email: khaiminhedu.co@gmail.com</p>
            </div>
            <div>
                <h3>LIÊN KẾT NHANH</h3>
                <p>→ Trang chủ</p>
                <p>→ Giới thiệu</p>
                <p>→ Danh mục sản phẩm</p>
                <p>→ Tin tức</p>
                <p>→ Liên hệ</p>
            </div>
            <div>
                <h3>GOOGLE MAP</h3>
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.8715591021955!2d106.70314357495698!3d10.744381089402403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f9e081088e9%3A0xe82bbb1d52f16074!2zMzAgxJAuIFPhu5EgMiwgVMOibiBRdXksIFF14bqtbiA3LCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmgsIFZpZXRuYW0!5e0!3m2!1sen!2s!4v1697899278263!5m2!1sen!2s" 
                    width="500" 
                    height="200" 
                    style={{ border: 0 }} 
                    title="Địa chỉ" 
                    loading="lazy" 
                ></iframe>
            </div>
        </WrapperFooterContainer>
    </div>
  )
}

export default FooterComponent