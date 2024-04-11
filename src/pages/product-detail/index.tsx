import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductDetail } from '../../types/product.types';
import './index.css';

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetail>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://dummyjson.com/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load product details', error);
        setLoading(false);
      });
  }, [productId]);

  return (
    <main className='main-container'>
      <button onClick={() => navigate(-1)}>목록으로 돌아가기</button>
      {loading ? (
        <div className='data-status'>Loading...</div>
      ) : (
        product && (
          <div>
            <img
              src={product?.thumbnail}
              className='main'
              alt={product?.title}
            />
            <h1>{product?.title}</h1>
            <h2>{product?.brand}</h2>
            <p>${product?.price}</p>
            <p>{product?.description}</p>
            <div className='extra-images'>
              {product?.images?.map((image, index) => (
                <img key={index} src={image} alt={`추가 이미지 ${index + 1}`} />
              ))}
            </div>
          </div>
        )
      )}
    </main>
  );
}
