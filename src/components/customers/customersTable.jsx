import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Table from '../table/Table'; // Update path based on your actual file structure
import API_BASE_URL from '../../../api_config';
import { useNavigate } from 'react-router-dom';

const CustomersTable = () => {
    const [topCustomers, setTopCustomers] = useState([]);

    const navigate = useNavigate();

    const topCustomerHead = ["User", "Total Orders", "Total Spending"];

    const renderCustomerHead = (item, index) => <th key={index}>{item}</th>;

    const renderCustomerBody = (item, index) => (
        <tr 
            key={index} 
            onClick={() => navigate(`/customer-details/${item.id}`)} 
            style={{ cursor: 'pointer' }}
        >
            <td>{item.user}</td>
            <td>{item.total_orders}</td>
            <td>{item.total_spending}</td>
        </tr>
    );

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/customers-table`);
                setTopCustomers(response.data);
            } catch (error) {
                console.error('Error fetching customer data:', error);
            }
        };

        fetchCustomers();
    }, []);

    return (
        <div className="col-12">
            <div className="card">
                <div className="card__header">
                    <h3>Customers</h3>
                </div>
                <div className="card__body">
                    <Table
                        limit="10"
                        headData={topCustomerHead}
                        renderHead={renderCustomerHead}
                        bodyData={topCustomers}
                        renderBody={renderCustomerBody}
                    />
                </div>
                {/* <div className="card__footer">
                    <Link to="/">View All</Link>
                </div> */}
            </div>
        </div>
    );
};

export default CustomersTable;
