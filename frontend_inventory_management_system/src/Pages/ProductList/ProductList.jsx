import axios from 'axios';
import { useEffect, useState } from 'react';
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';



function ProductList() {
  const [tableData, setTableData] = useState([]);
  const [first, setFirst] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:2001/productlist').then((response) => {
      setTableData(response.data);
    });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:2001/productlists').then((response) => {
      setTableData(response.data);
      const filteredYear = [...new Set(response.data.map((item) => item.name))];
      setCategory(filteredYear.map((category) => ({ label: category, value: category })));
    });
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      axios.get(`http://localhost:2001/category/${selectedCategory}`).then((response) => {
        setTableData(response.data);
      });
    }
  }, [selectedCategory]);

  const onCategoryChange = (e) => {
    setSelectedCategory(e.value);
  };

  const clearFilter = () => {
    setSelectedCategory(null);
    axios.get('http://localhost:2001/productlist').then((response) => {
      setTableData(response.data);
    });
  };

  const customDropdownStyle = {
    width: '200px',
  };

  const DropDown = (
    <Dropdown
      value={selectedCategory}
      options={category}
      onChange={onCategoryChange}
      placeholder="Select category name"
      className="custom-dropdown"
      style={customDropdownStyle}
    />
  );

  return (
    <>
      <div className="drop-down">
        {DropDown}
        <Button
          label="Clear"
          icon="pi pi-times"
          onClick={clearFilter}
          className="p-button-danger p-button-outlined"
        ></Button>
      </div>
      <br />
      <div className="card">
        <TreeTable
          value={tableData}
          tableStyle={{ minWidth: '50rem' }}
          first={first}
          paginator
          rows={5}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
          onPage={(e) => setFirst(e.first)}
          totalRecords={tableData.length}
          emptyMessage="No records found"
        >
          <Column
            field="name"
            header="Product Name"
            body={(rowData) => rowData.product_name}
            expander
            sortable
          />
          <Column
            field="size"
            header="Description"
            body={(rowData) => rowData.description}
            sortable
          />
          <Column
            field="type"
            header="Price"
            body={(rowData) => rowData.price}
            sortable
          />
          <Column
            field="type"
            header="Quantity"
            body={(rowData) => rowData.quantity}
            sortable
          />
          <Column
            field="type"
            header="Category Name"
            body={(rowData) => rowData.name}
            sortable
          />
        </TreeTable>
      </div>
    </>
  );
}

export default ProductList;
