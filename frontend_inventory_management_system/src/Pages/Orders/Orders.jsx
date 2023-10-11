import GlobalStyle from "../../Components/styles/global.js";
import styled from "styled-components";
import OrdersForm from "./OrdersForm.js";
import GridOrders from "./GridOrders.js";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Container = styled.div`
  width: 100%;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

function OrderItem() {
    const [users, setUsers] = useState([]);
    const [onEdit, setOnEdit] = useState(null);

    const getUsers = async () => {
        try {
            const res = await axios.get("http://localhost:2001/orderslist");
            setUsers(res.data.sort((a, b) => (a.order_id > b.order_id ? 1 : -1)));
        } catch (error) {
            toast.error(error);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <>
            <h1 className="title-3">Order Items</h1>
            <Container>
                <OrdersForm onEdit={onEdit} setOnEdit={setOnEdit} getUsers={getUsers} />
                <GridOrders setOnEdit={setOnEdit} users={users} setUsers={setUsers} />
            </Container>
            <ToastContainer autoClose={3000} position={toast.POSITION.BOTTOM_LEFT} />
            <GlobalStyle />
        </>
    );
}

export default OrderItem;
