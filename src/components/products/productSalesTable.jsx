import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Table from '../table/Table'
import API_BASE_URL from '../../../api_config';
import { useNavigate } from 'react-router-dom';


const ProductSalesTable = () => {
  const [products, setProducts] = useState([])
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)))
  const [endDate, setEndDate] = useState(new Date())

  const navigate = useNavigate()

  const fetchSales = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/products-sales-table`, {
        params: {
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString()
        }
      })
      setProducts(res.data)
    } catch (err) {
      console.error('Error fetching product sales:', err)
    }
  }

  useEffect(() => {
    fetchSales()
  }, [startDate, endDate])

  const headData = ['ID', 'Name', 'Category', 'Total Sales']

  const renderHead = (item, index) => <th key={index}>{item}</th>

  const renderBody = (item, index) => (
    <tr key={index} onClick={() => navigate(`/product-sales/${item.id}`, {
        state: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          productName: item.name  // optional, for display
        }
      })}
      >
      <td>{item.id}</td>
      <td>{item.name}</td>
      <td>{item.category}</td>
      <td>{item.total_sales}</td>
    </tr>
  )

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Product Sales (By Date Range)</h2>

      <div className="flex gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={date => setStartDate(date)}
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={date => setEndDate(date)}
            className="border p-2 rounded"
          />
        </div>
      </div>

      <div className="col-12">
                    <div className="card">
                        <div className="card__header">
                            <h3>Sales per product</h3>
                        </div>
                        <div className="card__body">
                            <Table
                              limit="10"
                              headData={headData}
                              renderHead={renderHead}
                              bodyData={products}
                              renderBody={renderBody}
                            />
                        </div>
                        <div className="card__footer">
                            {/* <Link to='/'>view all</Link> */}
                        </div>
                    </div>
                </div>

      
    </div>
  )
}

export default ProductSalesTable
