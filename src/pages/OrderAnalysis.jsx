import React from 'react';
import OrdersInRangeGraph from '../components/orders/ordersInRangeGraph';
// import TopSellingProductsChartInbetween from '../components/products/topSellingProductsInbetween';
import AttributionPieChart from '../components/orders/AttributionPieChart'
import OrderTable from '../components/orders/ordersTable'
import LocationBasedOrders from '../components/orders/LocationBasedOrders';

const OrderAnalysis = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Order Analysis</h2>
      <OrdersInRangeGraph />
      {/* <TopSellingProductsChartInbetween /> */}
      <AttributionPieChart />
      <OrderTable/>
      <LocationBasedOrders />
    </div>
  );
};

export default OrderAnalysis;