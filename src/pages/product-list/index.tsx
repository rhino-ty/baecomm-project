import { useEffect, useState } from 'react';
import { Product } from '../../types/product.types';
import './index.css';
import { Link } from 'react-router-dom';

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://dummyjson.com/products')
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className='loading'>Loading...</div>;

  return (
    <main className='main-contatiner'>
      <h1>Product List</h1>
      <div className='products'>
        {products.map((product) => (
          <Link
            key={product?.id}
            to={`/product/${product?.id}`}
            className='product'
          >
            <img src={product?.thumbnail} alt={product?.title} />
            <div>
              <div>{product?.brand}</div>
              <div>{product?.title}</div>
            </div>
            <div>${product?.price}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
