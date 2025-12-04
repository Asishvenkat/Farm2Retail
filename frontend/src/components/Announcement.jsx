import styled, { keyframes } from 'styled-components';
import { mobile } from '../responsive'; // make sure this is defined in your project

// Animation for sliding effect
const slide = keyframes`
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
`;

const Container = styled.div`
  height: 30px;
  background: linear-gradient(90deg, #008080, #20b2aa);
  color: white;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  ${mobile({ fontSize: '12px', height: '25px' })}
`;

const SlidingText = styled.div`
  white-space: nowrap;
  display: inline-block;
  animation: ${slide} 10s linear infinite;
`;

const Announcement = () => {
  return (
    <Container>
      <SlidingText> Super Deal! Free Shipping on Orders Over ₹500 </SlidingText>
    </Container>
  );
};

export default Announcement;
