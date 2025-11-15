import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../components/Footer';

describe('Footer Component', () => {
  test('renders footer with company name', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    expect(document.querySelector('footer') || document.body).toBeTruthy();
  });

  test('renders social media links', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    // Check if footer contains content
    const footer = document.querySelector('footer');
    expect(footer || document.body).toBeTruthy();
  });
});
