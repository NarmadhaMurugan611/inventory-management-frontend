import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
const Form = ({ getUsers, onEdit, setOnEdit }) => {
  const ref = useRef();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [editedData, setEditedData] = useState({
    product_name: "",
    description: "",
    price: "",
    quantity: "",
    category_id: "",
  });

  useEffect(() => {
    if (onEdit) {
      setIsFormVisible(true);
      setEditedData(onEdit);
    }

    fetchCategories();
  }, [onEdit]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:2001/categorylist");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = ref.current;

    if (
      !user.product_name.value ||
      !user.description.value ||
      !user.price.value ||
      !user.quantity.value ||
      !editedData.category_id
    ) {
      return toast.warn("Please enter product details");
    }
    if (onEdit) {
      await axios
        .put("http://localhost:2001/updateProduct/" + onEdit.product_id, {
          product_name: editedData.product_name,
          description: editedData.description,
          price: editedData.price,
          quantity: editedData.quantity,
          category_id: editedData.category_id,
        })
        .then(({ data }) => {
          toast.success(data);
          setIsFormVisible(false);
          setOnEdit(null);
          setEditedData({
            product_name: "",
            description: "",
            price: "",
            quantity: "",
            category_id: "",
          });
          getUsers();
        })
        .catch(({ data }) => toast.error(data));
    } else {
      await axios
        .post("http://localhost:2001/addProduct", {
          product_name: editedData.product_name,
          description: editedData.description,
          price: editedData.price,
          quantity: editedData.quantity,
          category_id: editedData.category_id,
        })
        .then(({ data }) => {
          toast.success(data);
          setIsFormVisible(false);
          setEditedData({
            product_name: "",
            description: "",
            price: "",
            quantity: "",
            category_id: "",
          });
          setOnEdit(null);
          getUsers();
        })
        .catch(({ data }) => toast.error(data));
    }

  };

  return (
    <div className="form-container">
      <Button
        label={onEdit ? "Edit" : "Add"}
        icon="pi pi-plus"
        className="p-button-rounded  form-button"
        onClick={() => setIsFormVisible(true)}
      />
      <Dialog
        header={onEdit ? "Edit Product" : "Add Product"}
        visible={isFormVisible}
        style={{ width: "30vw" }}
        onHide={() => {
          setIsFormVisible(false);
          setOnEdit(null);
          setEditedData({
            product_name: "",
            description: "",
            price: "",
            quantity: "",
            category_id: "",
          });
        }}
        footer={
          <div>
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={() => {
                setIsFormVisible(false);
                setOnEdit(null);
                setEditedData({
                  product_name: "",
                  description: "",
                  price: "",
                  quantity: "",
                  category_id: "",
                });
              }}
            />
            <Button
              label="Submit"
              icon="pi pi-check"
              onClick={handleSubmit}
            />
          </div>
        }
      >
        <form ref={ref} onSubmit={handleSubmit}>
          <div className="p-fluid">
            <div className="p-field">
              <label htmlFor="product_name">Product Name</label>
              <InputText
                id="product_name"
                name="product_name"
                value={editedData.product_name}
                onChange={(e) =>
                  setEditedData({ ...editedData, product_name: e.target.value })
                }
              />
            </div>
            <div className="p-field">
              <label htmlFor="description">Description</label>
              <InputText
                id="description"
                name="description"
                value={editedData.description}
                onChange={(e) =>
                  setEditedData({ ...editedData, description: e.target.value })
                }
              />
            </div>
            <div className="p-field">
              <label htmlFor="price">Price</label>
              <InputText
                id="price"
                name="price"
                value={editedData.price}
                onChange={(e) =>
                  setEditedData({ ...editedData, price: e.target.value })
                }
              />
            </div>
            <div className="p-field">
              <label htmlFor="quantity">Quantity</label>
              <InputText
                id="quantity"
                name="quantity"
                value={editedData.quantity}
                onChange={(e) =>
                  setEditedData({ ...editedData, quantity: e.target.value })
                }
              />
            </div>
            <div className="p-field">
              <label htmlFor="category_id">Category</label>
              <Dropdown
                id="category_id"
                name="category_id"
                value={editedData.category_id}
                options={categories.map((category) => ({
                  label: category.name,
                  value: category.category_id,
                }))}
                placeholder="Select a category"
                onChange={(e) =>
                  setEditedData({ ...editedData, category_id: e.value })
                }
              />
            </div>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default Form;

