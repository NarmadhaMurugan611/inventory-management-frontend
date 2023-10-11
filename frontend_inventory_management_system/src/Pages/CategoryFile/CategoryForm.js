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
    name: "",
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
      !user.name.value
    ) {
      return toast.warn("Please enter product details");
    }


    if (onEdit) {
      await axios
        .put("http://localhost:2001/updateCategory/" + onEdit.category_id, {
          name: editedData.name,
        })
        .then(({ data }) => {
          toast.success(data);
          setIsFormVisible(false);
          setOnEdit(null);
          setEditedData({
            name: "",
          });
          getUsers();
        })
        .catch(({ data }) => toast.error(data));
    } else {
      await axios
        .post("http://localhost:2001/addCategory", {
          name: editedData.name,
        })
        .then(({ data }) => {
          toast.success(data);
          setIsFormVisible(false);
          setEditedData({
            name: "",
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
          header={onEdit ? "Edit Category" : "Add Category"}
          visible={isFormVisible}
          style={{ width: "30vw" }}
          onHide={() => {
            setIsFormVisible(false);
            setOnEdit(null);
            setEditedData({
              name: "",
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
                    name: "",
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
                <label htmlFor="name">Category Name</label>
                <InputText
                  id="name"
                  name="name"
                  value={editedData.name}
                  onChange={(e) =>
                    setEditedData({ ...editedData, name: e.target.value })
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
