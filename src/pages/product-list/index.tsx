import { useEffect, useState } from 'react';
import { Product } from '../../types/product.types';
import './index.css';
import { useNavigate } from 'react-router-dom';
import useListStore from '../../store/list-store';

export default function ProductListPage() {
  // 상품 데이터, 검색어, 스크롤, 더보기 전역상태, 뒤로가기 시 데이터를 유지하기 위해 전역 상태 사용
  const {
    products,
    setProducts,
    skip,
    setSkip,
    totalProducts,
    setTotalProducts,
    searchTerm,
    setSearchTerm,
    scrollPosition,
    setScrollPosition,
  } = useListStore();

  // 로딩 상태
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 스크롤 위치 복원
  useEffect(() => {
    window.scrollTo(0, scrollPosition);
  }, []);

  // 디테일 페이지 이동 및 스크롤 저장 핸들러
  const handleDetail = (productId: number) => {
    setScrollPosition(window.scrollY);
    navigate(`/product/${productId}`);
  };

  /**
   * 상품 목록 로드 및 "더보기" 로직
   * @param skipReset Optional, skip 상태를 리셋시킬 지, 말 지의 param
   */
  const loadProducts = ({ skipReset = false }: { skipReset?: boolean }) => {
    setLoading(true);
    const query = searchTerm ? `search?q=${searchTerm}&` : '';
    const url = `${
      process.env.REACT_APP_API_URL
    }/products?${query}limit=10&skip=${skipReset ? 0 : skip}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setTotalProducts(data.total);
        setProducts(
          skipReset ? data.products : [...products, ...data.products],
        );
        setSkip(skipReset ? 10 : skip + 10);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (products.length === 0) {
      loadProducts({});
    }
  }, []);

  // "더보기" 버튼 클릭 핸들
  const handleLoadMore = () => loadProducts({});

  // 검색 실행
  const handleSearch = () => {
    setSkip(0);
    loadProducts({ skipReset: true });
  };

  return (
    <main className='main-container'>
      <h1>상품 리스트</h1>
      <input
        type='text'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
        placeholder='상품 관련 정보를 입력해주세요.'
      />
      <button onClick={handleSearch}>검색</button>
      {products?.length === 0 ? (
        <div className='data-status'>해당하는 상품이 없습니다.</div>
      ) : (
        <div className='products'>
          {products?.map((product) => (
            <div
              key={`${product?.title}-${product?.id}`}
              onClick={() => handleDetail(product?.id)}
              className='product'
            >
              <img src={product?.thumbnail} alt={product?.title} />
              <div className='brand-title'>
                <div>{product?.brand}</div>
                <div>{product?.title}</div>
              </div>
              <div className='price'>${product?.price}</div>
            </div>
          ))}
        </div>
      )}

      {/* products가 가진 데이터보다 total이 더 많을 때 더보기 버튼 생략 */}
      {products?.length < totalProducts && (
        // skip 상태를 변경시켜 fetch 실행
        <button className='skip' onClick={handleLoadMore}>
          상품 더보기
        </button>
      )}
    </main>
  );
}
