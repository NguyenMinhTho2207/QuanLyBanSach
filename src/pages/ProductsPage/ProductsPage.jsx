import React from 'react'
import { WrapperButtonMore, WrapperProducts } from './style'
import CardComponent from '../../components/CardComponent/CardComponent'
import { useQuery } from '@tanstack/react-query'
import * as ProductService from '../../services/ProductService';

const ProductsPage = () => {
  const fetchProductAll = async () => {
    const res = await ProductService.getAllProduct();

    return res;
  }

  const { isLoading, data: products } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 1000,
  });

  return (
    <div className="container" style={{padding: '20px 200px 0px 200px', height: '1000px' }}>
        <WrapperProducts>
          {products?.data?.map((product) => {
            return (
              <CardComponent 
                key={product.id} 
                quantity={product.quantity} 
                description={product.description} 
                image={product.image}
                productName={product.product_name}
                price={product.price}
                rating={product.rating}
                categoryId={product.category_id}
                discount={product.discount}
                soldQuantity={product.sold_quantity}
                id={product.id} 
              ></CardComponent>
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

export default ProductsPage