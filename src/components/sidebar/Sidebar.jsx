import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './sidebar.css'
import logo from '../../assets/images/logo of feeds.jpg'
import sidebar_items from '../../assets/JsonData/sidebar_routes.json'

const SidebarItem = props => {
    const active = props.active ? 'active' : ''

    return (
        <div className="sidebar__item">
            <div className={`sidebar__item-inner ${active}`}>
                <i className={props.icon}></i>
                <span>{props.title}</span>
            </div>
        </div>
    )
}

const Sidebar = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const activeItem = sidebar_items.findIndex(item => item.route === location.pathname)

    const handleLogout = () => {
        localStorage.clear()   // 👈 clear all tokens/session data
        navigate("/")          // 👈 redirect to SignIn page
    }

    return (
        <div className='sidebar'>
            <div className="sidebar__logo">
                <img src={logo} alt="company logo" /> SULTAN FEEDS
            </div>
            {
                sidebar_items.map((item, index) => {
                    if (item.display_name === "LogOut") {
                        return (
                            <div key={index} onClick={handleLogout} style={{ cursor: 'pointer' }}>
                                <SidebarItem
                                    title={item.display_name}
                                    icon={item.icon}
                                    active={index === activeItem}
                                />
                            </div>
                        )
                    }
                    return (
                        <Link to={item.route} key={index}>
                            <SidebarItem
                                title={item.display_name}
                                icon={item.icon}
                                active={index === activeItem}
                            />
                        </Link>
                    )
                })
            }
        </div>
    )
}

export default Sidebar
