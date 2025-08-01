import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import API_BASE_URL from "../../../api_config";

const TopCustomersChart = () => {
  const [series, setSeries] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/top-customers`).then((res) => {
      const names = res.data.map((c) => c.user);
      const totalSpent = res.data.map((c) => c.total_spending);

      setCategories(names);
      setSeries([
        {
          name: "Total Spent",
          data: totalSpent,
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
      text: "Top 5 Customers by Spending",
      align: "center",
    },
    tooltip: {
      y: {
        formatter: (val) => `$${val.toFixed(2)}`
      }
    }
  };

  return <Chart options={options} series={series} type="bar" height={350} />;
};

export default TopCustomersChart;
