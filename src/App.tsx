import { useEffect, useState } from 'react';
import './App.css';
import { Product } from './types/product.types';

function App() {
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
    <div className='App'>
      <h1>Product List</h1>
      <div className='products'>
        {products?.map((product) => (
          <div key={product?.id} className='product'>
            <img src={product?.thumbnail} alt={product?.title} />
            <div>
              <div>{product?.brand}</div>
              <div>{product?.title}</div>
            </div>
            <div>${product?.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
