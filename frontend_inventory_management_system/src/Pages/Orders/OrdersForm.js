import axios from "axios";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";

const FormContainer = styled.form`
  display: flex;
  align-items: flex-end;
  gap: 10px;
  flex-wrap: wrap;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 5px;
`;
const InputArea = styled.div`
  display: flex;
  flex-direction: column;
`;
const Input = styled.input`
  width: 120px;
  padding: 0 10px;
  border: 1px solid #bbb;
  border-radius: 5px;
  height: 40px;
`;
const Label = styled.label``;
const Button = styled.button`
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  background-color: #2c73d2;
  color: white;
  height: 42px;
`;

const Form = ({ getUsers, onEdit, setOnEdit }) => {

  const ref = useRef();
  useEffect(() => {
    if (onEdit) {
      const user = ref.current;
      user.phoneno.value = onEdit.phoneno;
      user.status.value = onEdit.status;
      user.order_date.value = onEdit.order_date;
    }
  }, [onEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = ref.current;
    const phoneno = user.phoneno.value;
    const status = user.status.value;
    const orderDateInput = user.order_date.value;

    if (!phoneno || !status || !orderDateInput) {
      return toast.warn("Please enter all order details");
    }

    const orderDate = new Date(orderDateInput).toISOString().split('T')[0];

    try {
      if (onEdit) {
        await axios.put(`http://localhost:2001/updateOrder/${onEdit.order_id}`, {
          phoneno: phoneno,
          status: status,
          order_date: orderDate,
        });
        toast.success("Order updated successfully");
      } else {
        await axios.post("http://localhost:2001/addOrders", {
          phoneno: phoneno,
          status: status,
          order_date: orderDate,
        });
        toast.success("Order added successfully");
      }

      user.phoneno.value = "";
      user.status.value = "";
      user.order_date.value = "";
      setOnEdit(null);
      getUsers();
    } catch (error) {
      toast.error(error.response.data);
    }
  };


  return (
    <div className="p-fluid-1">
      <FormContainer ref={ref} onSubmit={handleSubmit}>
        <InputArea>
          <strong><Label>Phone No</Label></strong>
          <Input name="phoneno" type="number" className="order-style" required />
        </InputArea>
        <InputArea>
          <strong><Label>Status</Label></strong>
          <Input name="status" type="text" className="order-style" />
        </InputArea>
        <InputArea>
          <strong><Label>Order Date</Label></strong>
          <Input name="order_date" type="date" className="order-style" />
        </InputArea>
        <Button type="submit" className="order_item_add">Add</Button>
      </FormContainer>
    </div>
  );
};

export default Form;
