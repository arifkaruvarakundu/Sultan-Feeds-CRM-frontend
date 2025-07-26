import React, { useEffect, useState } from 'react'
import Table from '../table/Table' // Adjust path if needed


function OrdersTable() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch("http://127.0.0.1:8000/orders-by-location")
      .then(res => {
        if (!res.ok) {
          throw new Error("Network response was not ok")
        }
        return res.json()
      })
      .then(data => {
        // Sort orders descending by 'orders'
        const sorted = data.sort((a, b) => b.orders - a.orders)
        setOrders(sorted)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const headData = ["City", "Orders"]
  const renderHead = (item, index) => <th key={index}>{item}</th>

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{item.city}</td>
      {/* <td>{item.coordinates.join(', ')}</td> */}
      <td>{item.orders}</td>
    </tr>
  )

  if (loading) return <div className="p-4">Loading orders...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>

  return (
    <div className="col-12">
      <div className="card">
        <div className="card__header">
          <h3>Orders based on Location Table</h3>
          {/* <p className="text-sm text-gray-600 mt-2">
            Showing <span className="font-semibold">{orders.length}</span> order
            {orders.length !== 1 ? 's' : ''} in selected date range
          </p> */}
        </div>
        <div className="card__body">
          <Table
            limit="10"
            headData={headData}
            renderHead={renderHead}
            bodyData={orders}
            renderBody={renderBody}
          />
        </div>
        <div className="card__footer">{/* Optional footer content */}</div>
      </div>
    </div>
  )
}

export default OrdersTable
