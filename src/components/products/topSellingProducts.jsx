import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import API_BASE_URL from '../../../api_config';

const TopSellingProductsChart = () => {
  const [series, setSeries] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/top-selling-products`).then((res) => {
      const names = res.data.map((p) => p.name);
      const sales = res.data.map((p) => p.total_quantity_sold || p.total_sales);

      setCategories(names);
      setSeries([
        {
          name: "Sales",
          data: sales,
        },
      ]);
    });
  }, []);

  const options = {
    chart: {
      type: "bar",
    },
    xaxis: {
      categories: categories,
    },
    title: {
      text: "Top 5 Selling Products",
      align: "center",
    },
  };

  return <Chart options={options} series={series} type="bar" height={350} />;
};

export default TopSellingProductsChart;
