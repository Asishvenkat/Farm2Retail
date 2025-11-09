import React, { useEffect, useState } from "react";
import { userRequest } from "../../requestMethods";
import { format } from "timeago.js";
import styled from "styled-components";

// Styled Components
const Wrapper = styled.div`
  display: flex;
`;

const Main = styled.div`
  flex: 4;
  padding: 20px;

  margin-right:200px
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Thead = styled.thead``;

const Tr = styled.tr`
  background-color: #f9f9f9;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 15px;
  border-bottom: 2px solid #ccc;
`;

const Td = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
`;

const Button = styled.button`
  padding: 5px 10px;
  margin-left: 10px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  text-transform: capitalize;
  color: white;
  background-color: ${(props) =>
    props.type === "Coming"
      ? "orange"
      : props.type === "Delivering"
      ? "royalblue"
      : props.type === "Delivered"
      ? "green"
      : "gray"};
`;

const Select = styled.select`
  padding: 5px;
  border-radius: 5px;
`;

export default function AllTransactions() {
  const [orders, setOrders] = useState([]);
  const [updatedStatus, setUpdatedStatus] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await userRequest.get("orders");
        const sorted = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sorted);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = (orderId, value) => {
    setUpdatedStatus((prev) => ({
      ...prev,
      [orderId]: value,
    }));
  };

  const handleUpdate = async (orderId) => {
    try {
      const newStatus = updatedStatus[orderId];
      if (!newStatus) return;

      await userRequest.put(`/orders/${orderId}`, {
        status: newStatus,
      });

      // Update UI
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <Wrapper>
      <Main>
        <Title>All Transactions</Title>
        <Table>
          <Thead>
            <Tr>
              <Th>Transaction ID</Th>
              <Th>Customer</Th>
              <Th>Date</Th>
              <Th>Amount</Th>
              <Th>Status</Th>
              <Th>Update</Th>
            </Tr>
          </Thead>
          <tbody>
            {orders.length === 0 ? (
              <Tr>
                <Td colSpan="6">No transactions found.</Td>
              </Tr>
            ) : (
              orders.map((order) => (
                <Tr key={order._id}>
                  <Td>{order._id}</Td>
                  <Td>{order.userId}</Td>
                  <Td>{format(order.createdAt)}</Td>
                  <Td>₹ {order.amount}</Td>
                  <Td>
                    <Button type={order.status}>{order.status}</Button>
                  </Td>
                  <Td>
                    <Select
                      value={updatedStatus[order._id] || order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                    >
                      <option value="Coming">Coming</option>
                      <option value="Delivering">Delivering</option>
                      <option value="Delivered">Delivered</option>
                    </Select>
                    <Button
                      onClick={() => handleUpdate(order._id)}
                      type={updatedStatus[order._id]}
                    >
                      Update
                    </Button>
                  </Td>
                </Tr>
              ))
            )}
          </tbody>
        </Table>
      </Main>
    </Wrapper>
  );
}
