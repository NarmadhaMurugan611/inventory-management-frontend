import React from "react";
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { toast } from "react-toastify";

const Grid = ({ users, setUsers, setOnEdit }) => {
  const handleEdit = (item) => {
    setOnEdit(item);
  };

  const handleDelete = async (inventory_id) => {
    await axios
      .delete("http://localhost:2001/deleteInventory/" + inventory_id)
      .then(({ data }) => {
        const newArray = users.filter((user) => user.inventory_id !== inventory_id);  //filtered id of an array
        setUsers(newArray);
        toast.success(data);
      })
      .catch(({ data }) => toast.error(data));
    //setOnEdit(null);
  };

  return (
    <div className='emplist-container'>
      <DataTable value={users} tableStyle={{ minWidth: '50rem' }} paginator rows={2} emptyMessage="No products found">
        <Column field="inventory_id" header="Inventory Id" style={{ width: '40%' }} />
        <Column field="product_id" header="Product Id" style={{ width: '40%' }} />
        <Column field="quantity" header="Quantity" style={{ width: '40%' }} />
        <Column header="Edit" body={(rowData) => (
          <Button icon="pi pi-pencil" onClick={() => handleEdit(rowData)} />
        )} />
        <Column header="Delete" body={(rowData) => (
          <Button icon="pi pi-trash" onClick={() => handleDelete(rowData.inventory_id)} />
        )} />
      </DataTable>
    </div>
  );
};

export default Grid;
