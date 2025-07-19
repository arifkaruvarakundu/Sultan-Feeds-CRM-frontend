import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../../api_config';
import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import StatusCard from '../components/status-card/StatusCard';
import Table from '../components/table/Table';
import Badge from '../components/badge/Badge';
// import statusCards from '../assets/JsonData/status-card-data.json';

const chartOptions = {
    series: [{
        name: 'Online Customers',
        data: [40,70,20,90,36,80,30,91,60]
    }, {
        name: 'Store Customers',
        data: [40, 30, 70, 80, 40, 16, 40, 20, 51, 10]
    }],
    options: {
        color: ['#6ab04c', '#2980b9'],
        chart: {
            background: 'transparent'
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
        },
        legend: {
            position: 'top'
        },
        grid: {
            show: false
        }
    }
}

const topCustomerHead = ["User", "Total Orders", "Total Spending"];

const renderCustomerHead = (item, index) => <th key={index}>{item}</th>;

const renderCustomerBody = (item, index) => (
    <tr key={index}>
        <td>{item.user}</td>
        <td>{item.total_orders}</td>
        <td>{item.total_spending}</td>
    </tr>
);

const renderCusomerBody = (item, index) => (
    <tr key={index}>
        <td>{item.username}</td>
        <td>{item.order}</td>
        <td>{item.price}</td>
    </tr>
)

const orderStatus = {
    "Cancelled": "danger",
    "pending": "warning",
    "completed": "success",
    "failed": "danger",
    "processing": "primary"
}

const renderOrderHead = (item, index) => (
    <th key={index}>{item}</th>
)

const renderOrderBody = (item, index) => (
    <tr key={index}>
        <td>{item.id}</td>
        <td>{item.user}</td>
        <td>{item.price.replace('$', 'KD ')}</td>
        <td>{item.date}</td>
        <td>
            <Badge type={orderStatus[item.status]} content={item.status}/>
        </td>
    </tr>
)

const Dashboard = () => {

    const [orders, setOrders] = useState([])
    const [statusCards, setStatusCards] = useState([])
    const [topCustomers, setTopCustomers] = useState([])
    const [salesComparison, setSalesComparison] = useState(null)

    useEffect(() => {
        axios.get(`${API_BASE_URL}/latest-orders`)
            .then(response => {
                console.log("Latest orders:", response.data)
                setOrders(response.data)
            })
            .catch(error => console.error("Failed to fetch orders:", error))
    }, [])

    useEffect(() => {
        axios.get(`${API_BASE_URL}/top-customers`)
            .then(response => {
                console.log("Top Customers:", response.data)
                setTopCustomers(response.data)
            })
            .catch(error => console.error("Failed to fetch top customers:", error))
    }, [])

    useEffect(() => {
    const fetchStatusCards = async () => {
        try {
            const totalOrdersRes = await axios.get(`${API_BASE_URL}/total-orders-count`);
            const { title, count } = totalOrdersRes.data[0];
            const totalSalesRes = await axios.get(`${API_BASE_URL}/total-sales`);
            const { titlesales, totalamount } = totalSalesRes.data[0];
            const aovRes = await axios.get(`${API_BASE_URL}/aov`);
            const {titleaov, amount} = aovRes.data[0]
            const totalCustomersRes = await axios.get(`${API_BASE_URL}/total-customers`);
            const {titlecustomers, countcustomers} = totalCustomersRes.data[0]

            // Add icons manually based on title or order
            const cards = [
                {
                    title:titlesales,
                    count:totalamount,
                    icon: "bx bx-shopping-bag"
                },
                {
                    title: titleaov,
                    count: amount,
                    icon: "bx bx-cart"
                },
                {
                    title: titlecustomers,
                    count: countcustomers,
                    icon: "bx bx-dollar-circle"
                },
                {
                    title,
                    count,
                    icon: "bx bx-receipt"
                }
            ];

            setStatusCards(cards);
        } catch (error) {
            console.error("Failed to fetch status card data", error);
        }
    };

    fetchStatusCards();
}, []);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/sales-comparison`)
            .then((res) => {
                setSalesComparison(res.data);
            })
            .catch((err) => console.error("Failed to fetch sales comparison data:", err));
    }, []);

    const getSalesChartData = (data) => {
    const maxDay = Math.max(
        ...data.previousMonth.map(item => item.day),
        ...data.currentMonth.map(item => item.day)
    );

    const labels = Array.from({ length: maxDay }, (_, i) => `${i + 1}`);

    const prevSeries = Array(maxDay).fill(0);
    const currSeries = Array(maxDay).fill(0);

    data.previousMonth.forEach(({ day, total }) => {
        prevSeries[day - 1] = total;
    });

    data.currentMonth.forEach(({ day, total }) => {
        currSeries[day - 1] = total;
    });

    return {
        series: [
            {
                name: 'Previous Month',
                data: prevSeries
            },
            {
                name: 'This Month',
                data: currSeries
            }
        ],
        options: {
            chart: {
                background: 'transparent'
            },
            stroke: {
                curve: 'smooth'
            },
            dataLabels: {
                enabled: false
            },
            xaxis: {
                categories: labels,
                title: {
                    text: 'Day of Month'
                }
            },
            yaxis: {
                title: {
                    text: 'Sales (KD)'
                },
                labels: {
                    formatter: val => Number(val).toFixed(3)
                }
            },

            legend: {
                position: 'top'
            },
            theme: {
                mode: themeReducer === 'theme-mode-dark' ? 'dark' : 'light'
            },
            tooltip: {
                y: {
                    formatter: val => `KD ${val.toFixed(2)}`
                }
            },
            grid: {
                show: false
            }
        }
    };
};

    const orderHeaders = ["order id", "user", "total price", "date", "status"]

    const themeReducer = useSelector(state => state.ThemeReducer.mode)

    return (
        <div>
            <h2 className="page-header">Dashboard</h2>
            <div className="row">
                <div className="col-6">
                    <div className="row">
                        {
                            statusCards.map((item, index) => (
                                <div className="col-6" key={index}>
                                    <StatusCard
                                        icon={item.icon}
                                        count={item.count}
                                        title={item.title}
                                    />
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="col-6">
                    <div className="card full-height">
                        {
                            salesComparison ? (
                                <Chart
                                    options={getSalesChartData(salesComparison).options}
                                    series={getSalesChartData(salesComparison).series}
                                    type='line'
                                    height='100%'
                                />
                            ) : (
                                <p>Loading chart...</p>
                            )
                        }
                    </div>
                </div>

                <div className="col-4">
                    <div className="card">
                        <div className="card__header">
                            <h3>top customers</h3>
                        </div>
                        <div className="card__body">
                            <Table
                                headData={topCustomerHead}
                                renderHead={renderCustomerHead}
                                bodyData={topCustomers}
                                renderBody={renderCustomerBody}
                            />
                        </div>
                        <div className="card__footer">
                            <Link to='/CustomerAnalysis'>view all</Link>
                        </div>
                    </div>
                </div>
                <div className="col-8">
                    <div className="card">
                        <div className="card__header">
                            <h3>latest orders</h3>
                        </div>
                        <div className="card__body">
                            <Table
                                headData={orderHeaders}
                                renderHead={(item, index) => renderOrderHead(item, index)}
                                bodyData={Array.isArray(orders) ? orders : []}
                                renderBody={(item, index) => renderOrderBody(item, index)}
                            />
                        </div>
                        <div className="card__footer">
                            <Link to='/dashboard'>view all</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
