import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import API_BASE_URL from '../../../api_config';

const OrdersInRangeGraph = () => {
  const [granularity, setGranularity] = useState('daily');
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7)));
  const [endDate, setEndDate] = useState(new Date());
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (startDate && endDate) {
      const fetchData = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/orders-in-range`, {
            params: {
              start_date: startDate.toISOString().split('T')[0],
              end_date: endDate.toISOString().split('T')[0],
              granularity: granularity
            }
          });
          setChartData(res.data);
        } catch (err) {
          console.error('Failed to fetch data:', err);
        }
      };

      fetchData();
    }
  }, [startDate, endDate, granularity]);

  const chartOptions = {
    chart: {
      id: 'orders-line-chart',
      background: 'transparent',
      toolbar: { show: false }
    },
    xaxis: {
      categories: chartData.map(item => item.date),
      title: {
        text: 'Date'
      }
    },
    yaxis: {
      title: {
        text: 'Total Amount (KD)'
      },
      labels: {
        formatter: val => val.toFixed(3)
      }
    },
    tooltip: {
      y: {
        formatter: val => `KD ${val.toFixed(3)}`
      }
    },
    stroke: {
      curve: 'smooth'
    },
    grid: {
      show: true
    }
  };

  const series = [
    {
      name: 'Total Order Amount',
      data: chartData.map(item => item.total_amount)
    }
  ];

  // 📅 Utility for month/year selection
  const renderDatePickers = () => {
    if (granularity === 'daily') {
      return (
        <>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontWeight: 500, marginBottom: '4px' }}>Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
              className="date-picker-input"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontWeight: 500, marginBottom: '4px' }}>End Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="yyyy-MM-dd"
              className="date-picker-input"
            />
          </div>
        </>
      );
    }

    if (granularity === 'monthly') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontWeight: 500, marginBottom: '4px' }}>Month</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
              const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
              setStartDate(firstDay);
              setEndDate(lastDay);
            }}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            className="date-picker-input"
          />
        </div>
      );
    }

    if (granularity === 'yearly') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontWeight: 500, marginBottom: '4px' }}>Year</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              const firstDay = new Date(date.getFullYear(), 0, 1);
              const lastDay = new Date(date.getFullYear(), 11, 31);
              setStartDate(firstDay);
              setEndDate(lastDay);
            }}
            dateFormat="yyyy"
            showYearPicker
            className="date-picker-input"
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="card">
      <div className="card__header">
        <div
          style={{
            display: 'flex',
            gap: '1.5rem',
            alignItems: 'center',
            marginTop: '1rem',
            flexWrap: 'wrap',
            backgroundColor: '#f9f9f9',
            padding: '1rem',
            borderRadius: '8px'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontWeight: 500, marginBottom: '4px' }}>Analysis Type</label>
            <select
              value={granularity}
              onChange={(e) => setGranularity(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px' }}
            >
              <option value="daily">Daily Analysis</option>
              <option value="monthly">Monthly Analysis</option>
              <option value="yearly">Yearly Analysis</option>
            </select>
          </div>
          {renderDatePickers()}
        </div>
      </div>
      <div className="card__body" style={{ marginTop: '1rem' }}>
        <Chart options={chartOptions} series={series} type="line" height={350} />
      </div>
    </div>
  );
};

export default OrdersInRangeGraph;
