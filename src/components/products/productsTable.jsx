import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Table from '../table/Table'
import API_BASE_URL from '../../../api_config'

const ProductTable = () => {
  const [products, setProducts] = useState([])

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/products-table`)
      setProducts(res.data)
    } catch (err) {
      console.error('Error fetching products:', err)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const headData = [
    'ID',
    'Name',
    'Short Description',
    'Regular Price',
    'Sales Price',
    'Total Sales',
    'Category',
    'Stock Status',
    'Weight',
    'Date Created',
    'Date Modified'
  ]

  const renderHead = (item, index) => <th key={index}>{item}</th>

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{item.id}</td>
      <td>{item.name}</td>
      <td dangerouslySetInnerHTML={{ __html: item.short_description }}></td>
      <td>{item.regular_price}</td>
      <td>{item.sales_price}</td>
      <td>{item.total_sales}</td>
      <td>{item.categories}</td>
      <td>{item.stock_status}</td>
      <td>{item.weight}</td>
      <td>{new Date(item.date_created).toLocaleDateString()}</td>
      <td>{new Date(item.date_modified).toLocaleDateString()}</td>
    </tr>
  )

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Products</h2>

      <div className="col-12">
        <div className="card">
          <div className="card__header">
            <h3>Product Table</h3>
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
            {/* <Link to='/products'>View all products</Link> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTable
