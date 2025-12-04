import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { mobile } from '../../responsive';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fdf8 0%, #e8f5e8 100%);
  padding: 20px;
`;

const Header = styled.div`
  position: relative;
  min-height: 500px; /* Increased height for better image display */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-image: url('https://www.thestatesman.com/wp-content/uploads/2020/05/farmer.jpg');
  background-size: cover; /* This ensures the image covers the entire area */
  background-position: center center; /* Centers the image both horizontally and vertically */
  background-repeat: no-repeat;
  background-attachment: local; /* Ensures proper rendering */

  color: white;
  padding: 80px 30px; /* Increased padding for better spacing */
  border-radius: 20px;
  margin-bottom: 40px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  z-index: 1;
  overflow: hidden;

  /* Enhanced overlay for better text readability */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(130, 188, 133, 0.75),
      rgba(108, 218, 115, 0.5)
    );
    z-index: 1;
  }

  /* Ensure text content appears above the overlay */
  h1,
  p {
    position: relative;
    z-index: 2;
    max-width: 700px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3); /* Added text shadow for better readability */
  }

  ${mobile({
    minHeight: '350px',
    padding: '50px 20px',
    backgroundPosition:
      'center center' /* Ensure proper positioning on mobile */,
  })}
`;

const Title = styled.h1`
  font-size: 3rem;
  margin: 0 0 15px 0;
  font-weight: 800;
  letter-spacing: 1px;
  ${mobile({ fontSize: '2.2rem' })}
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  margin: 0;
  opacity: 0.95;
  font-weight: 300;
  ${mobile({ fontSize: '1.1rem' })}
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 35px 25px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(76, 175, 80, 0.1);

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 60px rgba(76, 175, 80, 0.15);
  }
`;

const Icon = styled.div`
  font-size: 3.5rem;
  margin-bottom: 20px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
`;

const CardTitle = styled.h2`
  color: #1b5e20;
  margin: 0 0 15px 0;
  font-size: 1.6rem;
  font-weight: 600;
`;

const Description = styled.p`
  color: #666;
  margin: 0 0 25px 0;
  line-height: 1.6;
  font-size: 1rem;
`;

const ActionButton = styled(Link)`
  display: inline-block;
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  padding: 14px 28px;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);

  &:hover {
    background: linear-gradient(135deg, #45a049 0%, #388e3c 100%);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
    transform: translateY(-2px);
  }
`;

const features = [
  {
    icon: '🌾',
    title: 'My Products',
    description:
      'View and manage all your listed products. Update prices, quantities, and availability for retailers.',
    link: '/farmer/products',
    action: 'Manage Products',
  },
  {
    icon: '📦',
    title: 'Add New Product',
    description:
      'List fresh produce from your farm. Set competitive prices and showcase your quality harvests.',
    link: '/farmer/add-product',
    action: 'Add Product',
  },
  {
    icon: '📋',
    title: 'Orders Received',
    description:
      'Track incoming orders from retailers, manage fulfillment, and monitor delivery progress.',
    link: '/farmer/orders',
    action: 'View Orders',
  },
];

const FarmerHomePage = () => {
  return (
    <>
      <Navbar />
      <Container>
        <Header>
          <Title>Welcome Back, Farmer</Title>
          <Subtitle>
            Your digital marketplace to connect with retailers and grow your
            business
          </Subtitle>
        </Header>

        <FeatureGrid>
          {features.map((feature, index) => (
            <FeatureCard key={index}>
              <Icon>{feature.icon}</Icon>
              <CardTitle>{feature.title}</CardTitle>
              <Description>{feature.description}</Description>
              <ActionButton to={feature.link}>{feature.action}</ActionButton>
            </FeatureCard>
          ))}
        </FeatureGrid>
      </Container>

      <Footer />
    </>
  );
};

export default FarmerHomePage;
