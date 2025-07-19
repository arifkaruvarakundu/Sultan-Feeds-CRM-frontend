import React from 'react'
import TopCustomersChart from "../components/customers/topCustomers"
import CustomersTable from "../components/customers/customersTable"
import CustomerClassificationTables from "../components/customers/cutomerTableBasedOrderNo"
import CustomerSpendingClassificationTables from "../components/customers/CustomerSpendingClassificationTables";


function CustomerAnalysis() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Customer Analysis</h2>
      <TopCustomersChart/>
      <CustomersTable/>
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
    </div>
  )
}

export default CustomerAnalysis

