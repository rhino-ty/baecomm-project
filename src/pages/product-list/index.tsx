import { useEffect, useState } from 'react';
import { Product } from '../../types/product.types';
import './index.css';
import { Link } from 'react-router-dom';

export default function ProductListPage() {
  // Product 데이터, 더보기 및 검색 시 상태 갱신
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // 검색어 string
  const [searchQuery, setSearchQuery] = useState('');
  // 더보기 클릭 관련 상태
  const [skip, setSkip] = useState(0);
  // 총 상품 개수 상태
  const [totalProducts, setTotalProducts] = useState(0);

  // 첫 렌더링 및 "더보기" 버튼을 위한 상품 로드 함수
  const loadMoreProducts = () => {
    // 로딩 상태를 true로 설정하여 데이터 로딩 중임을 표시
    setLoading(true);

    // 기본 상품 목록을 요청하고, skip에 따라 갱신됨
    fetch(`${process.env.REACT_APP_API_URL}/products?limit=10&skip=${skip}`)
      .then((response) => response.json())
      .then((data) => {
        // 응답으로 받은 총 상품 개수를 상태에 저장
        setTotalProducts(data.total);
        // 첫 페이지를 로드할 때는 상품 목록을 새 데이터로 갱신
        if (skip === 0) {
          setProducts(data.products);
        } else {
          // "더보기" 버튼 클릭 시 기존 상품 목록에 새로 로드한 상품을 추가
          setProducts((prevProducts) => [...prevProducts, ...data.products]);
        }
        // 데이터 로드가 완료되면 로딩 상태를 false로 설정
        setLoading(false);
      })
      .catch((error) => {
        // 데이터 로드 중 오류가 발생하면 콘솔에 에러 메시지 출력
        console.error('Error fetching data: ', error);
        setLoading(false); // 오류 발생 시에도 로딩 상태를 false로 설정
      });
  };

  // 첫 렌더링 시 기본 상품 목록 로드, 그 이후 skip이 변경됐을 때 실행하는 useEffect
  useEffect(() => {
    loadMoreProducts();
  }, [skip]);

  // search 실행 함수
  const handleSearch = () => {
    setSkip(0); // 검색 시 skip을 0으로 재설정
    fetchSearchResults(); // 검색어를 포함하여 상품 목록 갱신
  };

  // 검색 결과 로딩 함수
  const fetchSearchResults = () => {
    setLoading(true);
    fetch(
      `${process.env.REACT_APP_API_URL}/products/search?q=${searchQuery}&limit=10&skip=${skip}`,
    )
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.products);
        setTotalProducts(data.total);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
        setLoading(false);
      });
  };

  return (
    <main className='main-container'>
      <h1>상품 리스트</h1>
      <input
        type='text'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
        placeholder='상품 관련 정보를 입력해주세요.'
      />
      <button onClick={handleSearch}>검색</button>
      {loading ? (
        <div className='loading'>Loading...</div>
      ) : (
        <div className='products'>
          {products?.map((product) => (
            <Link
              key={`${product?.title}-${product?.id}`}
              to={`/product/${product?.id}`}
              className='product'
            >
              <img src={product?.thumbnail} alt={product?.title} />
              <div className='brand-title'>
                <div>{product?.brand}</div>
                <div>{product?.title}</div>
              </div>
              <div className='price'>${product?.price}</div>
            </Link>
          ))}
        </div>
      )}

      {/* products가 가진 데이터보다 total이 더 많을 때 더보기 버튼 생략 */}
      {products?.length < totalProducts && (
        // skip 상태를 변경시켜 fetch 실행
        <button
          className='skip'
          onClick={() => setSkip((currentSkip) => currentSkip + 10)}
        >
          상품 더보기
        </button>
      )}
    </main>
  );
}
