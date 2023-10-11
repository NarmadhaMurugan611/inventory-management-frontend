import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { toast } from "react-toastify";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const Grid = ({ users, setUsers, setOnEdit, setProducts }) => {
  const [first, setFirst] = useState(0);
  const [productMap, setProductMap] = useState({});

  const handleEdit = (item) => {
    setOnEdit(item);
  };

  const handleDelete = async (order_item_id) => {
    await axios
      .delete("http://localhost:2001/deleteOrderItem/" + order_item_id)
      .then(({ data }) => {
        const newArray = users.filter((user) => user.order_item_id !== order_item_id);
        setUsers(newArray);
        toast.success(data);
      })
      .catch(({ data }) => toast.error(data));
    setOnEdit(null);
  };

  useEffect(() => {
    axios.get("http://localhost:2001/productlist").then((response) => {
      const productData = response.data;
      const productMapping = {};
      productData.forEach((product) => {
        productMapping[product.product_id] = product.product_name;
      });
      setProductMap(productMapping);
      console.log("Product", setProductMap)
    });
  }, []);

  return (
    <div className="p-fluid">
      <DataTable value={users} first={first} paginator rows={3}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
        onPage={(e) => setFirst(e.first)}
        totalRecords={users.length}
        emptyMessage="No records found"
        className="p-datatable">
        <Column field="order_item_id" header="Order Item Id"></Column>
        <Column field="order_id" header="Order Id"></Column>
        <Column field="product_id" header="Product Id"></Column>
        <Column field="quantity" header="Quantity"></Column>
        <Column field="product_id" header="Product Name"
          body={(rowData) => productMap[rowData.product_id] || ""}
        ></Column>
        <Column
          body={(rowData) => (
            <Button
              icon="pi pi-pencil"
              className="p-button-rounded p-button-success"
              onClick={() => handleEdit(rowData)}
            />
          )}
        ></Column>
        <Column
          body={(rowData) => (
            <Button
              icon="pi pi-trash"
              className="p-button-rounded p-button-danger"
              onClick={() => handleDelete(rowData.order_item_id)}
            />
          )}
        ></Column>
      </DataTable>
    </div>
  );
};

export default Grid;
