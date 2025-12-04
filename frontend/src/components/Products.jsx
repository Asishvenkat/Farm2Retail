import styled from 'styled-components';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mobile } from '../responsive';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Container for all product cards
const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: ${({ center }) => (center ? 'center' : 'space-between')};
`;
// Individual product card with hover effect
const ProductCard = styled.div`
  flex: 0 0 32%;
  margin-bottom: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;

  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }

  ${mobile({ flex: '0 0 100%' })}
`;

const Image = styled.img`
  width: 100%;
  height: 250px;
  object-fit: contain;
  background-color: #fff;
  transition: all 0.3s ease;

  ${ProductCard}:hover & {
    filter: brightness(1.05) contrast(1.1);
    transform: scale(1.03);
  }
`;

const Info = styled.div`
  padding: 10px 15px;
`;

const Title = styled.h3`
  font-size: 18px;
  margin: 10px 0 5px;
  transition: color 0.3s;

  ${ProductCard}:hover & {
    color: teal;
  }
`;

const Price = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: teal;
`;

// Product component
const Product = ({ item }) => (
  <ProductCard>
    <Link
      to={`/product/${item._id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <Image src={item.images?.[0] || item.img} alt={item.name || item.title} />
      <Info>
        <Title>{item.name || item.title}</Title>
        <Price>₹{item.price}</Price>
      </Info>
    </Link>
  </ProductCard>
);

// Main Products component
const Products = ({ cat, filters, sort }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(
          cat
            ? `${API_BASE_URL}products?category=${cat}`
            : `${API_BASE_URL}products`
        );
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    getProducts();
  }, [cat]);

  useEffect(() => {
    if (cat) {
      if (filters && Object.keys(filters).length > 0) {
        const filtered = products.filter((item) =>
          Object.entries(filters).every(([key, value]) =>
            item[key]?.includes(value)
          )
        );
        setFilteredProducts(filtered);
      } else {
        setFilteredProducts(products);
      }
    } else {
      setFilteredProducts(products.slice(0, 6));
    }
  }, [products, cat, filters]);

  useEffect(() => {
    if (sort && filteredProducts.length > 0) {
      if (sort === 'newest') {
        setFilteredProducts((prev) =>
          [...prev].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
      } else if (sort === 'asc') {
        setFilteredProducts((prev) =>
          [...prev].sort((a, b) => a.price - b.price)
        );
      } else {
        setFilteredProducts((prev) =>
          [...prev].sort((a, b) => b.price - a.price)
        );
      }
    }
  }, [sort, filteredProducts.length]);

  return (
    <Container center={filteredProducts.length < 3}>
      {filteredProducts.length > 0 ? (
        filteredProducts.map((item) => (
          <Product item={item} key={item._id || item.id} />
        ))
      ) : (
        <div>No products found</div>
      )}
    </Container>
  );
};

export default Products;
