import React, { useState} from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { toast } from "react-toastify";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import axios from "axios";

const Grid = ({ users, setUsers, setOnEdit }) => {
  const [first, setFirst] = useState(0);

  const handleEdit = (item) => {
    setOnEdit(item);
  };

  const handleDelete = async (order_id) => {
    await axios
      .delete("http://localhost:2001/deleteOrder/" + order_id)
      .then(({ data }) => {
        const newArray = users.filter((user) => user.order_id !== order_id);
        setUsers(newArray);
        toast.success(data);
      })
      .catch(({ data }) => toast.error(data));
    setOnEdit(null);
  };

  const handleStatusChange = async (order_id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "closed" : "active";
    if (currentStatus === "active") {
      try {
        await axios.put(`http://localhost:2001/orders/${order_id}`, { status: newStatus });
        await axios.put(`http://localhost:2001/changeProductCount/${order_id}`)
        const updatedUsers = users.map((user) => {
          if (user.order_id === order_id) {
            return { ...user, status: newStatus };
          }
          return user;
        });
        setUsers(updatedUsers);
        toast.success(`Order status changed to ${newStatus}`);
      } catch (error) {
        console.error("Error changing order status:", error);
        toast.error("Error changing order status");
      }
    }
  };

  return (
    <div className="p-fluid">
      <DataTable value={users} first={first} paginator rows={3}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
        onPage={(e) => setFirst(e.first)}
        totalRecords={users.length}
        emptyMessage="No records found"
        className="p-datatable">
        <Column field="order_id" header="Order Id"></Column>
        <Column field="phoneno" header="Phone No"></Column>
        <Column field="status" header="Status"></Column>
        <Column field="order_date" header="Order Date"></Column>
        <Column
          header="Status Change"
          body={(rowData) => (
            <div>
              <Button
                label={rowData.status === "active" ? "active" : "closed"}
                icon={rowData.status === "active" ? "pi pi-check" : "pi pi-times"}
                className={rowData.status === "active" ? "p-button-rounded p-button-success p-button-sm" : "p-button-rounded p-button-danger p-button-sm"}
                onClick={() => handleStatusChange(rowData.order_id, rowData.status)}
              />
            </div>
          )}
        />
        <Column
          header="Action"
          body={(rowData) => (
            <div>
              <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-success p-button-sm"
                onClick={() => handleEdit(rowData)}
              />
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger p-button-sm"
                onClick={() => handleDelete(rowData.order_id)}
              />
            </div>
          )}
        />
      </DataTable>
    </div>
  );
};

export default Grid;
