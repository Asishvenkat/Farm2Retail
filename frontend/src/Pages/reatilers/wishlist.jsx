import { 
  FavoriteBorder, 
  ShoppingCart, 
  Delete, 
  ArrowBack 
} from "@mui/icons-material";
import styled from "styled-components";
import { mobile } from "../../responsive";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeFromWishlist, clearWishlist } from "../../redux/wishlistRedux";
import { addProduct } from "../../redux/cartRedux";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 20px;
  ${mobile({ padding: "10px" })}
`;

const Title = styled.h1`
  font-weight: 300;
  text-align: center;
  margin-bottom: 30px;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  ${mobile({ flexDirection: "column", alignItems: "stretch" })}
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
`;

const BackButton = styled(Button)`
  border: 1px solid #ccc;
  background-color: white;
  color: #333;
  
  &:hover {
    background-color: #f5f5f5;
    transform: translateY(-2px);
  }
`;

const ClearButton = styled(Button)`
  background-color: #e91e63;
  color: white;
  
  &:hover {
    background-color: #c2185b;
    transform: translateY(-2px);
  }
`;

const ItemCount = styled.span`
  font-weight: 500;
  color: #666;
  ${mobile({ textAlign: "center", order: "-1" })}
`;

const TopActions = styled.div`
  display: flex;
  gap: 10px;
  ${mobile({ width: "100%", justifyContent: "space-between" })}
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  ${mobile({ gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "15px" })}
`;

const Card = styled.div`
  border: 1px solid #eee;
  border-radius: 12px;
  background: white;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  cursor: pointer;
  overflow: hidden;
  height: 250px;
  
  &:hover img {
    transform: scale(1.05);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
`;

const Info = styled.div`
  padding: 15px;
  cursor: pointer;
`;

const Name = styled.h3`
  font-size: 18px;
  margin: 0 0 8px 0;
  color: #333;
  line-height: 1.3;
  transition: color 0.3s ease;
  
  &:hover {
    color: #e91e63;
  }
`;

const Price = styled.span`
  color: #e91e63;
  font-weight: bold;
  font-size: 20px;
`;

const ProductDetails = styled.div`
  padding: 0 15px;
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
`;

const Actions = styled.div`
  padding: 15px;
  display: flex;
  gap: 10px;
  border-top: 1px solid #f0f0f0;
`;

const ActionButton = styled(Button)`
  flex: 1;
  justify-content: center;
  font-size: 14px;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const AddToCartButton = styled(ActionButton)`
  background-color: #006666;
  color: white;
  
  &:hover {
    background-color: #004d4d;
  }
`;

const RemoveButton = styled(ActionButton)`
  background-color: rgb(220, 35, 21);
  color: white;
  
  &:hover {
    background-color: rgb(180, 25, 15);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  margin: 100px 0;

  h2 {
    font-size: 24px;
    color: #666;
    margin: 20px 0 10px 0;
  }

  p {
    margin: 10px 0 30px;
    color: #999;
    font-size: 16px;
  }
`;

const FarmerInfo = styled.div`
  padding: 0 15px;
  font-size: 12px;
  color: #888;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const CategoryBadge = styled.span`
  background-color: #e8f5e8;
  color: #2d5016;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  margin-left: 8px;
`;

const Wishlist = () => {
  const wishlist = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemove = (id) => {
    dispatch(removeFromWishlist(id));
  };
  
  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear your entire wishlist?")) {
      dispatch(clearWishlist());
    }
  };
  
const handleAddToCart = (product) => {
  // Add to cart with the same structure as Product page
  dispatch(addProduct({
    ...product,
    quantity: 1, // Default quantity for wishlist items
    size: product.size, // Use the size that was selected when added to wishlist
    color: product.color // Use the color that was selected when added to wishlist
  }));
};


  const handleProductClick = (productId) => {
    // Navigate to product detail page
    navigate(`/product/${productId}`);
  };

  // Empty state
  if (wishlist.products.length === 0) {
    return (
      <Container>
        <Navbar />
        <Wrapper>
          <Title>YOUR WISHLIST</Title>
          <EmptyState>
            <FavoriteBorder style={{ fontSize: 80, color: "#ddd" }} />
            <h2>Your wishlist is empty</h2>
            <p>Save your favorite items here and never lose track of what you love!</p>
            <BackButton onClick={() => navigate("/")}>
              <ArrowBack /> Start Shopping
            </BackButton>
          </EmptyState>
        </Wrapper>
        <Footer />
      </Container>
    );
  }

  return (
    <Container>
      <Navbar />
      <Wrapper>
        <Title>YOUR WISHLIST</Title>
        <Top>
          <BackButton onClick={() => navigate("/")}>
            <ArrowBack /> Continue Shopping
          </BackButton>
          <ItemCount>
            {wishlist.quantity} {wishlist.quantity === 1 ? "item" : "items"}
          </ItemCount>
          <TopActions>
            <Button onClick={() => navigate("/cart")}>
              <ShoppingCart /> View Cart
            </Button>
            <ClearButton onClick={handleClear}>
              Clear All
            </ClearButton>
          </TopActions>
        </Top>
        
        <ProductsGrid>
          {wishlist.products.map((product) => (
            <Card key={product._id}>
              <ImageContainer onClick={() => handleProductClick(product._id)}>
                <Image 
                  src={product.img} 
                  alt={product.title || product.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x250?text=No+Image';
                  }}
                />
              </ImageContainer>
              
              <Info onClick={() => handleProductClick(product._id)}>
                <Name>{product.title || product.name}</Name>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Price>₹{product.price}</Price>
                  {product.unit && <span style={{ color: '#666', fontSize: '14px', marginLeft: '8px' }}>per {product.unit}</span>}
                  {product.category && <CategoryBadge>{product.category}</CategoryBadge>}
                </div>
              </Info>

              {product.farmerName && (
                <FarmerInfo>
                  👨‍🌾 {product.farmerName}
                  {product.location && <span> • 📍 {product.location}</span>}
                </FarmerInfo>
              )}

              {(product.color || product.size) && (
                <ProductDetails>
                  {product.color && <span>Color: {Array.isArray(product.color) ? product.color[0] : product.color}</span>}
                  {product.color && product.size && " • "}
                  {product.size && <span>Size: {Array.isArray(product.size) ? product.size[0] : product.size}</span>}
                </ProductDetails>
              )}

              <Actions>
                <AddToCartButton onClick={() => handleAddToCart(product)}>
                  <ShoppingCart /> Add to Cart
                </AddToCartButton>
                <RemoveButton onClick={() => handleRemove(product._id)}>
                  <Delete /> Remove
                </RemoveButton>
              </Actions>
            </Card>
          ))}
        </ProductsGrid>
      </Wrapper>
      <Footer />
    </Container>
  );
};

export default Wishlist;