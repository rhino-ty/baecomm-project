import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductListPage from './pages/product-list';
import ProductDetailPage from './pages/product-detail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<ProductListPage />} />
        <Route path='/product/:productId' element={<ProductDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
