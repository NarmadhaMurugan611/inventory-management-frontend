import axios from "axios";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { useState } from "react";

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

  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");

  useEffect(() => {
    axios.get("http://localhost:2001/productlist").then((response) => {
      setProducts(response.data);
    });
  }, []);

  useEffect(() => {
    if (onEdit) {
      const user = ref.current;
      user.order_id.value = onEdit.order_id;
      user.product_id.value = onEdit.product_id;
      user.quantity.value = onEdit.quantity;
    }
  }, [onEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = ref.current;
    if (!user.order_id.value || !selectedProductId || !user.quantity.value) {
      return toast.warn("Please enter order details");
    }
    if (onEdit) {
      await axios
        .put("http://localhost:2001/updateOrderItem/" + onEdit.order_item_id, {
          order_id: user.order_id.value,
          product_id: selectedProductId,
          quantity: user.quantity.value,
        })
        .then(({ data }) => toast.success(data))
        .catch(({ data }) => toast.error(data));
    } else {
      await axios
        .post("http://localhost:2001/addOrderItem", {
          order_id: user.order_id.value,
          product_id: selectedProductId,
          quantity: user.quantity.value,
        })
        .then(({ data }) => toast.success(data))
        .catch(({ data }) => toast.error(data));
    }
    user.order_id.value = "";
    setSelectedProductId("");
    user.quantity.value = "";
    setOnEdit(null);
    getUsers();
  };

  return (
    <div className="p-fluid-1">
      <FormContainer ref={ref} onSubmit={handleSubmit}>
        <InputArea>
          <strong><Label>Order Id</Label></strong>
          <Input name="order_id" type="number" className="order-style" />
        </InputArea>
        <InputArea>
          <strong><Label>Product</Label></strong>
          <select
            className="order-style-select"
            name="product_id"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product.product_id} value={product.product_id}>
                {product.product_name}
              </option>
            ))}
          </select>
        </InputArea>
        <InputArea>
          <strong><Label>Quantity</Label></strong>
          <Input name="quantity" type="number" className="order-style" />
        </InputArea>
        <Button type="submit" className="order_item_add">Add</Button>
      </FormContainer>
    </div>
  );
};

export default Form;