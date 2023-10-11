import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

const Form = ({ getUsers, onEdit, setOnEdit }) => {
  const ref = useRef();

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editedData, setEditedData] = useState({
    product_id: "",
    quantity: "",

  });

  useEffect(() => {
    if (onEdit) {
      setIsFormVisible(true);
      setEditedData(onEdit);
    }
  }, [onEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = ref.current;

    if (
      !user.product_id.value ||
      !user.quantity.value
    ) {
      return toast.warn("Please enter product details");
    }

    if (onEdit) {
      await axios
        .put("http://localhost:2001/updateInventory/" + onEdit.inventory_id, {
          product_id: editedData.product_id,
          quantity: editedData.quantity,
        })
        .then(({ data }) => {
          toast.success(data);
          setIsFormVisible(false);
          setOnEdit(null);
          setEditedData({
            product_id: "",
            quantity: "",
          });
          getUsers();
        })
        .catch(({ data }) => toast.error(data));
    } else {
      await axios
        .post("http://localhost:2001/addInventory", {
          product_id: editedData.product_id,
          quantity: editedData.quantity,
        })
        .then(({ data }) => {
          toast.success(data);
          setIsFormVisible(false);
          setEditedData({
            product_id: "",
            quantity: "",
          });
          setOnEdit(null);
          getUsers();
        })
        .catch(({ data }) => toast.error(data));
    }
  };

  return (
    <>
      <div className="form-container">
        <Button icon="pi pi-plus"
          className="p-button-rounded  form-button" onClick={() => setIsFormVisible(true)}>
          {onEdit ? "Edit" : "Add"}
        </Button>
        <Dialog
          header={onEdit ? "Edit Product" : "Add Inventory"}
          visible={isFormVisible}
          style={{ width: "30vw" }}
          onHide={() => {
            setIsFormVisible(false);
            setOnEdit(null);
            setEditedData({
              product_id: "",
              quantity: "",
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
                    product_id: "",
                    quantity: "",
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
                <label htmlFor="product_id">Product Id</label>
                <InputText
                  id="product_id"
                  name="product_id"
                  value={editedData.product_id}
                  onChange={(e) =>
                    setEditedData({ ...editedData, product_id: e.target.value })
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
            </div>
          </form>
        </Dialog>
      </div>
    </>
  );
};

export default Form;
