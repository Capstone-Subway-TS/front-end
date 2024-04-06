// Header.jsx

import React, { useState } from 'react';
import Logo from '../header/Logo';
import Menu from '../header/Menu';
import Sns from '../header/Sns';
import Top from '../header/Top';


const Header = () => {    
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);

    const toggleHeader = () => {
        setIsHeaderVisible(!isHeaderVisible);
    };

    const closeHeader = () => {
        if (isHeaderVisible) {
            setIsHeaderVisible(false);
        }
    };

    return (
        <div className="header-container">
            <button className="toggle-button" onClick={toggleHeader}>{isHeaderVisible ? "닫기" : "메뉴"}</button>
            <div className="top-container">
                <Top />
            </div>
            
            <header id='header' className={isHeaderVisible ? '' : 'hidden'} role='banner' onClick={closeHeader}>
                <Logo />
                <Menu />
                <Sns />
            </header>
            
        </div>
    );
};

export default Header;
