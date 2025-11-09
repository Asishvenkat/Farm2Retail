import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { mobile } from "../../responsive";
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, #f0f4ff 0%, #ffffff 100%);
  padding: 20px;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #2196f3, #1565c0);
  color: white;
  padding: 40px 20px;
  border-radius: 16px;
  margin-bottom: 40px;
  text-align: center;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
`;

const WelcomeTitle = styled.h1`
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 12px;
  ${mobile({ fontSize: "2rem" })}
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.95;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
`;

const DashboardCard = styled.div`
  background: white;
  padding: 30px 25px;
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
  }
`;

const CardIcon = styled.div`
  font-size: 2.8rem;
  margin-bottom: 16px;
`;

const CardTitle = styled.h3`
  color: #1565c0;
  margin-bottom: 12px;
  font-size: 1.5rem;
`;

const CardDescription = styled.p`
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 24px;
  line-height: 1.6;
`;

const CardButton = styled(Link)`
  background-color: #2196f3;
  color: white;
  padding: 12px 24px;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  display: inline-block;

  &:hover {
    background-color: #1976d2;
  }
`;

const FeaturedSection = styled.div`
  background: white;
  padding: 30px 25px;
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  color: #1565c0;
  margin-bottom: 24px;
  font-size: 1.7rem;
  font-weight: 600;
`;

const FeaturedProducts = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
`;

const ProductCard = styled.div`
  background: #f4f6f8;
  padding: 18px;
  border-radius: 12px;
  text-align: center;
  border: 2px solid transparent;
  transition: all 0.3s ease;

  &:hover {
    border-color: #2196f3;
    background-color: #e3f2fd;
  }

  h4 {
    margin-bottom: 6px;
    font-weight: 600;
    font-size: 1.1rem;
  }

  p {
    color: #333;
    font-size: 0.95rem;
  }
`;

const QuickActions = styled.div`
  background: white;
  padding: 30px 25px;
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  margin-bottom: 50px;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const ActionButton = styled(Link)`
  background-color: #e3f2fd;
  color: #1565c0;
  padding: 14px 28px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 0.95rem;

  &:hover {
    background-color: #2196f3;
    color: white;
  }
`;

const RetailerHomePage = () => {
  return (
    <>
 
      <Navbar />
      <Container>
        <Header>
          <WelcomeTitle>Welcome, Retailer! 🏪</WelcomeTitle>
          <WelcomeSubtitle>
            Source fresh produce directly from trusted farmers.
          </WelcomeSubtitle>
        </Header>

        <DashboardGrid>
          <DashboardCard>
            <CardIcon>🛒</CardIcon>
            <CardTitle>Browse Products</CardTitle>
            <CardDescription>
              Explore fresh produce from local farmers. Filter by location, price, and stock.
            </CardDescription>
            <CardButton to="/products">Browse Now</CardButton>
          </DashboardCard>

          <DashboardCard>
            <CardIcon>📦</CardIcon>
            <CardTitle>My Orders</CardTitle>
            <CardDescription>
              View and manage your orders, check delivery status, and track past purchases.
            </CardDescription>
            <CardButton to="/orders">Track Orders</CardButton>
          </DashboardCard>

          <DashboardCard>
            <CardIcon>❤️</CardIcon>
            <CardTitle>Saved Products</CardTitle>
            <CardDescription>
              Your favorite products saved for quick access and repeat orders.
            </CardDescription>
            <CardButton to="/wishlist">View Wishlist</CardButton>
          </DashboardCard>
        </DashboardGrid>

        {/* <FeaturedSection>
          <SectionTitle>🔥 Fresh Today</SectionTitle>
          <FeaturedProducts>
            <ProductCard>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🥕</div>
              <h4>Fresh Carrots</h4>
              <p>₹40/kg</p>
            </ProductCard>
            <ProductCard>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🥬</div>
              <h4>Organic Lettuce</h4>
              <p>₹60/kg</p>
            </ProductCard>
            <ProductCard>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🍅</div>
              <h4>Farm Tomatoes</h4>
              <p>₹35/kg</p>
            </ProductCard>
            <ProductCard>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🥔</div>
              <h4>New Potatoes</h4>
              <p>₹25/kg</p>
            </ProductCard>
          </FeaturedProducts>
        </FeaturedSection> */}


      </Container>
      <Footer />
    </>
  );
};

export default RetailerHomePage;
