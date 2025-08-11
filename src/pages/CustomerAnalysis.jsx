import React,{useState, useEffect} from 'react'
import TopCustomersChart from "../components/customers/topCustomers"
import CustomersTable from "../components/customers/customersTable"
import CustomerClassificationTables from "../components/customers/cutomerTableBasedOrderNo"
import CustomerSpendingClassificationTables from "../components/customers/CustomerSpendingClassificationTables";
import LowChurnCustomers from "../components/customers/CustomersWithLowChurnRisk";
import API_BASE_URL from "../../api_config";
import axios from "axios";

function CustomerAnalysis() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // 🔄 Fetch customers
  useEffect(() => {
  async function fetchCustomers() {
    try {
      const res = await axios.get(`${API_BASE_URL}/customers-table`);
      console.log("Customer sample:", res.data[0]);  // <-- Add this
      setCustomers(res.data);
      setFilteredCustomers(res.data);
    } catch (err) {
      console.error("Error fetching customers", err);
    }
  }
  fetchCustomers();
}, []);


   // 🔍 Filter when searchTerm changes
  useEffect(() => {
  const rawSearch = searchTerm.trim().toLowerCase();
  const digitSearch = rawSearch.replace(/\D/g, '');

  const filtered = customers.filter((customer) => {
    const name = (customer.user || '').toLowerCase();
    const phone = (customer.phone || '').replace(/\D/g, '');

    const isNameMatch = name.includes(rawSearch);
    const isPhoneMatch = digitSearch && phone.includes(digitSearch);

    return isNameMatch || isPhoneMatch;
  });

  setFilteredCustomers(filtered);
}, [searchTerm, customers]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Customer Analysis</h2>
      <TopCustomersChart/>
      {/* 🔍 Search Bar */}
      <div className="mb-6 max-w-xl">
        <input
          type="text"
          placeholder="Search by name or phone number"
          className="w-full px-4 py-2 border rounded shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <CustomersTable customers={filteredCustomers}/>
      <div className="flex justify-center my-8">
        <div className="bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-300 shadow-md rounded-2xl px-6 py-4 text-center w-full max-w-3xl">
          <h3 className="text-2xl font-bold text-blue-800 tracking-wide">
            Classification of Customers Based on Order Numbers
          </h3>
        </div>
      </div>
      <CustomerClassificationTables/>
      <div className="flex justify-center my-8">
        <div className="bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-300 shadow-md rounded-2xl px-6 py-4 text-center w-full max-w-3xl">
          <h3 className="text-2xl font-bold text-blue-800 tracking-wide">
            Classification of Customers Based on Amount Spending
          </h3>
        </div>
      </div>
      <CustomerSpendingClassificationTables/>
      <div className="flex justify-center my-8">
        <div className="bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-300 shadow-md rounded-2xl px-6 py-4 text-center w-full max-w-3xl">
          <h3 className="text-2xl font-bold text-blue-800 tracking-wide">
            Table of Customers with low Churn Risk
          </h3>
        </div>
      </div>
      <LowChurnCustomers/>
    </div>
  )
}

export default CustomerAnalysis

