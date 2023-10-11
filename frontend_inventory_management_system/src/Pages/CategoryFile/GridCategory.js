import React, { useState } from "react";
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { toast } from "react-toastify";
import { InputText } from 'primereact/inputtext';
import { FaSearch } from 'react-icons/fa';

const Grid = ({ users, setUsers, setOnEdit }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleEdit = (item) => {
    setOnEdit(item);
  };

  const handleDelete = async (category_id) => {
    await axios
      .delete("http://localhost:2001/deleteCategory/" + category_id)
      .then(({ data }) => {
        const newArray = users.filter((user) => user.category_id !== category_id);
        setUsers(newArray);
        toast.success(data);
      })
      .catch(({ data }) => toast.error(data));

    setOnEdit(null);
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
      <div className="search-bar-2">
        <InputText
          placeholder="Search by any field"
          value={searchQuery}
          onChange={handleSearchInputChange}
          className="search-input"
        />
        <FaSearch className="search-icon" />
      </div>
      <div className='emplist-container'>
        {filteredData.length > 0 ? (
          <DataTable value={filteredData} tableStyle={{ minWidth: '50rem' }} paginator rows={3}>
            <Column field="category_id" header="Category ID" style={{ width: '40%' }} />
            <Column field="name" header="Category Name" style={{ width: '40%' }} />
            <Column header="Edit" body={(rowData) => (
              <Button icon="pi pi-pencil" onClick={() => handleEdit(rowData)} />
            )} />
            <Column header="Delete" body={(rowData) => (
              <Button icon="pi pi-trash" onClick={() => handleDelete(rowData.category_id)} />
            )} />
          </DataTable>
        ) : (
          <p>No products found</p>
        )}
      </div>
    </>
  );
};

export default Grid;
