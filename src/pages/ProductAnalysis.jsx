import React from 'react';
import TopSellingProductsChart from '../components/products/topSellingProducts';
import TopSellingProductsChartInbetween from '../components/products/topSellingProductsInbetween';
import ProductSalesTable from '../components/products/ProductSalesTable'
import ProductTable from '../components/products/productsTable'
const ProductAnalysis = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Product Sales Analysis</h2>
      <TopSellingProductsChart />
      <TopSellingProductsChartInbetween />
      <ProductSalesTable />
      <ProductTable/>
    </div>
  );
};

export default ProductAnalysis;
