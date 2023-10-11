import React, { useState } from "react";
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { toast } from "react-toastify";
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { FaSearch } from 'react-icons/fa';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const Grid = ({ users, setUsers, setOnEdit }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const hideDetails = () => {
    setDialogVisible(false);
  };

  const handleEdit = (item) => {
    setOnEdit(item);
  };

  const handleDelete = async (product_id) => {
    await axios
      .delete("http://localhost:2001/deleteProduct/" + product_id)
      .then(({ data }) => {
        const newArray = users.filter((user) => user.product_id !== product_id);
        setUsers(newArray);
        toast.success(data);
      })
      .catch(({ data }) => toast.error(data));
    setOnEdit(null);
  };

  const handleQuantityChange = async (product, newQuantity) => {
    const updatedProduct = { ...product, quantity: newQuantity };

    try {
      await axios.put(`http://localhost:2001/updateProduct/${product.product_id}`, updatedProduct);
      const updatedUsers = users.map((user) => {
        if (user.product_id === product.product_id) {
          return updatedProduct;
        }
        return user;
      });
      setUsers(updatedUsers);
      toast.success(`Quantity updated to ${newQuantity}`);
    } catch (error) {
      console.error("Error changing quantity:", error);
      toast.error("Error changing quantity");
    }
  };

  const filteredData = users.filter((item) => {
    for (const key in item) {
      if (item[key] && item[key].toString().toLowerCase().includes(searchQuery.toLowerCase())) {
        return true;
      }
    }
    return false;
  });

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <div className="search-bar-1">
        <InputText
          placeholder="Search by any field"
          value={searchQuery}
          onChange={handleSearchInputChange}
          className="search-input-1"
        />
      </div>
      <div><FaSearch className="search-icon-1" /></div>
      <div className='emplist-container'>

        {filteredData.length > 0 ? (
          <DataTable value={filteredData} tableStyle={{ minWidth: '50rem' }} paginator rows={3} emptyMessage="No products found">
            <Column field="product_name" header="Product Name" style={{ width: '40%' }} />
            <Column field="description" header="Description" style={{ width: '40%' }} />
            <Column field="price" header="Price" style={{ width: '40%' }} />
            <Column field="quantity" header="Quantity" style={{ width: '40%' }} />
            <Column field="name" header="Category Name" style={{ width: '40%' }} />
            <Column header="Edit" body={(rowData) => (
              <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-outlined p-button-success"
                onClick={() => handleEdit(rowData)}
              >
                Edit
              </Button>
            )} />
            <Column header="Delete" body={(rowData) => (
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-outlined p-button-danger"
                onClick={() => handleDelete(rowData.product_id)}
              >
                Delete
              </Button>
            )} />
            <Column header="Add Quantity" body={(rowData) => (
              <div className="p-inputgroup">
                <Button
                  icon="pi pi-plus"
                  className="p-button-rounded p-button-outlined p-button-success"
                  onClick={() => handleQuantityChange(rowData, rowData.quantity + 1)}
                />
                <input
                  type="number"
                  className="inc_center"
                  value={rowData.quantity}
                  onChange={(e) => handleQuantityChange(rowData, parseInt(e.target.value))}
                  style={{ width: "50px" }}
                />
                <Button
                  icon="pi pi-minus"
                  className="p-button-rounded p-button-outlined p-button-danger"
                  onClick={() => handleQuantityChange(rowData, rowData.quantity - 1)}
                />
              </div>
            )} />
          </DataTable>
        ) : (
          <p>No products found</p>
        )}

        <Dialog
          visible={dialogVisible}
          onHide={hideDetails}
          header="Product Details"
          modal
          style={{ width: '30rem' }}
          contentStyle={{ background: '#f5f5f5', color: 'black', border: '2px solid #dddddd' }}
        >
          {selectedProduct && (
            <div>
              <p><strong>Product Name</strong> {selectedProduct.product_name}</p>
              <p><strong>Description</strong> {selectedProduct.description}</p>
              <p><strong>Price</strong> {selectedProduct.price}</p>
              <p><strong>Quantity</strong> {selectedProduct.quantity}</p>
              <p><strong>Category Id</strong> {selectedProduct.category_id}</p>
            </div>
          )}
        </Dialog>
      </div>
    </>
  );
};

export default Grid;

