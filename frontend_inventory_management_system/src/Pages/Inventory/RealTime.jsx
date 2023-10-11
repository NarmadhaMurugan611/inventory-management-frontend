import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'boxicons/css/boxicons.min.css';

const RealTime = () => {
    const [inventory, setInventory] = useState([]);
    const [error, setError] = useState(null);
    const [totalQuantity, setTotalQuantity] = useState(0);

    useEffect(() => {
        axios.get('http://localhost:2001/api/inventory')
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error('Network response was not ok');
                }
                return response.data;
            })
            .then((data) => {
                setInventory(data);
                setError(null);

                // Calculate total quantity
                const total = data.reduce((acc, item) => acc + item.quantity, 0);
                setTotalQuantity(total);
            })
            .catch((error) => {
                setError(error.message);
                console.error('Error fetching inventory:', error);
            });
    }, []);

    useEffect(() => {
        const pollInterval = setInterval(() => {
            axios.get('http://localhost:2001/api/inventory')
                .then((response) => {
                    if (response.status !== 200) {
                        throw Error('Network response was not ok');
                    }
                    return response.data;
                })
                .then((data) => {
                    setInventory(data);
                    setError(null);

                    // Calculate total quantity
                    const total = data.reduce((acc, item) => acc + item.quantity, 0);
                    setTotalQuantity(total);
                })
                .catch((error) => {
                    setError(error.message);
                    console.error('Error fetching inventory:', error);
                });
        }, 5000);

        return () => {
            clearInterval(pollInterval);
        };
    }, []);

    return (
        <>
            <div>
                {error ? (
                    <p>Error: {error}</p>
                ) : (
                    <div>
                        <div class="home-content">
                            <div class="overview-boxes">
                                <div className="box" >
                                    <div className="right-side">
                                        <div class="box-topic">Total Quantity</div>
                                        <div class="number">{totalQuantity} </div>
                                        <div class="indicator">
                                            <i class='bx bx-up-arrow-alt'></i>
                                            <span class="text">Up From Today</span>
                                        </div>
                                    </div>
                                    <i class='bx bx-cart-alt cart'></i>
                                </div>
                            </div>
                        </div>
                        <ul>
                            {inventory.map((item) => (
                                <li key={item.product_id}>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </>
    );
};

export default RealTime;
