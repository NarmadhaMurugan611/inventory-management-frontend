import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import GlobalStyle from "../../Components/styles/global.js";
import styled from "styled-components";
import Form from "./InventoryForm.js";
import Grid from "./GridInventory.js";
import RealTime from "./RealTime"
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;


function Inventory() {
    const [users, setUsers] = useState([]);
    const [onEdit, setOnEdit] = useState(null);

    const getUsers = async () => {
        try {
            const res = await axios.get("http://localhost:2001/inventorylist");
            setUsers(res.data.sort((a, b) => (a.quantity > b.quantity ? 1 : -1)));
        } catch (error) {
            toast.error(error);
        }
    };

    useEffect(() => {
        getUsers();
    }, [setUsers]);

    return (
        <>
            <h1 className="title-3">Inventory Tracking</h1>
            <Container>
                <RealTime></RealTime>
                <Form onEdit={onEdit} setOnEdit={setOnEdit} getUsers={getUsers} />
                <Grid setOnEdit={setOnEdit} users={users} setUsers={setUsers} />
            </Container>
            <ToastContainer autoClose={3000} position={toast.POSITION.BOTTOM_LEFT} />
            <GlobalStyle />
        </>
    );
}

export default Inventory;