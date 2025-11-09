import { Send } from "@material-ui/icons";
import styled from "styled-components";
import { mobile } from "../responsive";
import { useState } from "react";

const Container = styled.div`
  height: 50vh;
  background-color: #fcf5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 50px;
  margin-bottom: 10px;
`;

const Desc = styled.div`
  font-size: 20px;
  font-weight: 300;
  margin-bottom: 30px;
  max-width: 600px;
  ${mobile({ fontSize: "16px" })}
`;

const InputContainer = styled.div`
  width: 100%;
  max-width: 500px;
  height: 50px;
  background-color: white;
  display: flex;
  border: 1px solid lightgray;
  border-radius: 25px;
  overflow: hidden;
  ${mobile({ width: "80%" })}
`;

const Input = styled.input`
  border: none;
  flex: 8;
  padding-left: 20px;
  font-size: 16px;
  outline: none;
`;

const Button = styled.button`
  flex: 1;
  border: none;
  background-color: teal;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #004d4d;
  }
`;

const Message = styled.div`
  margin-top: 20px;
  font-size: 18px;
  color: green;
`;

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = () => {
    if (!email || !email.includes("@")) {
      setMessage("Please enter a valid email address.");
      return;
    }

    // Simulate API call here
    setMessage("Thank you for subscribing!");
    setEmail("");

    // Optionally clear message after a few seconds
    setTimeout(() => setMessage(""), 4000);
  };

  return (
    <Container>
      <Title>Newsletter</Title>
      <Desc>Get timely updates from your favorite products.</Desc>
      <InputContainer>
        <Input
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button onClick={handleSubscribe}>
          <Send />
        </Button>
      </InputContainer>
      {message && <Message>{message}</Message>}
    </Container>
  );
};

export default Newsletter;
