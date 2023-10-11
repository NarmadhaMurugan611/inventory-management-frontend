import axios from 'axios';
import { Chart } from 'primereact/chart';
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FaSearch } from 'react-icons/fa';


function Dashboard() {
    const [tableData, setTableData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [first, setFirst] = useState(0);

    useEffect(() => {
        axios.get("http://localhost:2001/productlist").then((response) => {
            setTableData(response.data);
        })
    }, [])


    const data = {
        labels: tableData.map((item) => item.product_name),
        datasets: [
            {
                data: tableData?.map((item) => item.price),
                backgroundColor: [
                    'rgb(255, 192, 203)',
                    'rgb(255, 255, 0)',
                    'rgb(144, 238, 144)',
                    ' rgb(135, 206, 235)'
                ],
                borderColor: [
                    'rgb(255, 159, 64)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)'
                ],
                borderWidth: 1
            }
        ]
    }
    const options = {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: false
                }
            }
        }
    };
    const filteredData = tableData.filter((item) => {
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
            <div className="display-chart">
                <Chart type="pie" data={data} width='30%' height='5%' options={options} />
                <div className="dashboard">
                    <div className="search-bar">
                        <InputText
                            placeholder="Search by any field"
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                            className="search-input"
                        />
                        <FaSearch className="search-icon" />
                    </div>
                    <br />
                    <div className="table-container">
                        <DataTable
                            value={filteredData}
                            resizableColumns
                            columnResizeMode="fit"
                            className="p-datatable-custom"
                            first={first}
                            rows={5}
                            paginator={true}
                            onPage={(e) => setFirst(e.first)}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport" // Customize paginator template
                            totalRecords={tableData.length}
                            emptyMessage="No records found"
                        >
                            <Column field="product_name" header="Product Name" sortable />
                            <Column field="description" header="Description" sortable />
                            <Column field="price" header="Price" sortable />
                            <Column field="quantity" header="Quantity" sortable />
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;

