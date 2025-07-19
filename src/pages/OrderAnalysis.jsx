import React from 'react';
import OrdersInRangeGraph from '../components/orders/ordersInRangeGraph';
// import TopSellingProductsChartInbetween from '../components/products/topSellingProductsInbetween';
// import ProductSalesTable from '../components/products/ProductSalesTable'
// import ProductTable from '../components/products/productsTable'
const OrderAnalysis = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Order Analysis</h2>
      <OrdersInRangeGraph />
      {/* <TopSellingProductsChartInbetween />
      <ProductSalesTable />
      <ProductTable/> */}
    </div>
  );
};

export default OrderAnalysis;