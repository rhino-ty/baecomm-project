export interface Product {
  id: number;
  title: string;
  thumbnail: string;
  price: number;
  brand: string;
}

export interface ProductDetail extends Product {
  description: string;
  images: string[];
}
