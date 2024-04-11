import { ChangeEvent, useEffect, useState } from 'react';
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
   * @param searchExe Optional, 검색 시 true로 할당해 skip 상태를 초기화함.
   */
  const loadProducts = ({ searchExe = false }: { searchExe?: boolean }) => {
    setLoading(true);
    const url = searchTerm
      ? `${process.env.REACT_APP_API_URL}/products/search?q=${searchTerm}&limit=10&skip=0`
      : `${process.env.REACT_APP_API_URL}/products?limit=10&skip=${skip}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setTotalProducts(data.total);
        setProducts(
          searchExe ? data.products : [...products, ...data.products],
        );
        setSkip(searchExe ? 0 : skip + 10);
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

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      // 초기화
      fetch(`${process.env.REACT_APP_API_URL}/products?limit=10&skip=0`)
        .then((response) => response.json())
        .then((data) => {
          setTotalProducts(data.total);
          setProducts(data.products);
          setSkip(0);
        });
    }
  };

  // 검색 실행
  const handleSearch = () => {
    if (searchTerm === '') {
      alert('검색어를 입력해주세요.');
      return;
    }
    setSkip(0);
    loadProducts({ searchExe: true });
  };

  return (
    <main className='main-container'>
      <h1>상품 리스트</h1>
      <input
        type='text'
        value={searchTerm}
        onChange={handleSearchInput}
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
