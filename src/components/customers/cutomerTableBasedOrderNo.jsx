import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../table/Table";
import axios from "axios";
import API_BASE_URL from "../../../api_config";

const tableHead = ["Customer Name", "Total Orders", "Churn Risk"];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const renderBody = (item, index, navigate) => (
  <tr
    key={index}
    onClick={() => navigate(`/customer-details/${item.customer_id}`)}
    style={{ cursor: "pointer" }}
  >
    <td>{item.customer_name}</td>
    <td>{item.order_count}</td>
    <td>{item.churn_risk}</td>
    {/* <td>{item.segment}</td> */}
  </tr>
);

const CustomerClassificationTables = () => {
  const [groupedCustomers, setGroupedCustomers] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/full-customer-classification`);
        const data = res.data;
        console.log("data classification:", data)

        const grouped = data.reduce((acc, item) => {
          const key = item.classification || "Unclassified";
          if (!acc[key]) acc[key] = [];
          acc[key].push(item);
          return acc;
        }, {});

        // Sort "New" customers by last_order_date DESC
        if (grouped["New"]) {
          grouped["New"].sort(
            (a, b) => new Date(b.last_order_date) - new Date(a.last_order_date)
          );
        }

        // Sort all other groups by order_count DESC
        Object.keys(grouped).forEach((key) => {
          if (key !== "New") {
            grouped[key].sort((a, b) => b.order_count - a.order_count);
          }
        });

        setGroupedCustomers(grouped);
      } catch (error) {
        console.error("Failed to fetch classified customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  const classificationOrder = [
  { key: "Loyal", label: "Loyal Customers", criteria: "Orders > 16" },
  { key: "Frequent", label: "Frequent Customers", criteria: "6 - 15 Orders" },
  { key: "Occasional", label: "Occasional Customers", criteria: "2 - 5 Orders" },
  { key: "New", label: "New Customers", criteria: "1 Order in 2025 or later" },
  { key: "Dead", label: "Dead Customers", criteria: "1 Order before 2025" },
  { key: "No Orders", label: "No Orders", criteria: "0 Orders" },
];

  return (
    <div className="row">
  {classificationOrder.map(({ key, label, criteria }) =>
    groupedCustomers[key]?.length > 0 ? (
      <div className="col-6" key={key}>
        <div className="card">
          <div className="bg-gradient-to-r from-indigo-100 to-indigo-200 border border-indigo-300 rounded-xl px-4 py-3 mb-4 shadow-sm text-center">
  <h3 className="text-xl font-semibold text-indigo-800 tracking-wide">
    {label} <span className="text-sm text-indigo-600">({groupedCustomers[key].length})</span>
  </h3>
  <p className="text-sm text-indigo-700 mt-1 italic">{criteria}</p>
</div>
          <div className="card__body">
            <Table
              limit="10"
              headData={tableHead}
              renderHead={renderHead}
              bodyData={groupedCustomers[key]}
              renderBody={(item, index) =>
                renderBody(item, index, navigate)
              }
            />
          </div>
        </div>
      </div>
    ) : null
  )}
</div>
  );
};

export default CustomerClassificationTables;
