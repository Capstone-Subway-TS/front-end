import React from 'react'
import { Link } from 'react-router-dom'
import { FaTrainSubway } from "react-icons/fa6";
import { RiFontColor } from 'react-icons/ri';

const Logo = ({ toggleMenu }) => {
    return (
        <h1 className='header__logo'>
            <Link to='/'>
            <FaTrainSubway /><span>TS-Subway Service</span>
            </Link>
        </h1>
    )
}

export default Logo