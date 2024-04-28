import React from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'

import Header from './Header'
import Footer from './Footer'
import Right from './Right'


const Main = ( props ) => {
    return (
        <HelmetProvider>
            <Helmet 
                titleTemplate="%s | 캡스톤디자인 TS" 
                defaultTitle="TS" 
                defer={false}
            >
                {props.title && <title>{props.title}</title>}
                <meta name="description" content={props.description} />
            </Helmet>

            <Header />
            <Right />
            <main id="main" role="main">
                {props.children}
            </main>
           
            
        </HelmetProvider>
    )
}

export default Main