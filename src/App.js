import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './components/section/Main';

const Login = lazy(() => import('./pages/Login'));
const Nav = lazy(() => import('./pages/Nav'));
const Developer = lazy(() => import('./pages/Developer'));
const Tsteam = lazy(() => import('./pages/Tsteam'));
const Map = lazy(() => import('./pages/Map'));
const Signup = lazy(() => import('./pages/Signup'));
const Mypage = lazy(() => import('./pages/Mypage'));
const Arrival = lazy(() => import('./pages/Arrival'));

const App = () => { 
    return (
        <Router>
            <Suspense fallback={<Main />}>
                <Routes>
                    <Route path='/' element={<Map />} />
                    <Route path="/nav" element={<Nav />} />
                    <Route path="/developer" element={<Developer />} />
                    <Route path='/tsteam' element={<Tsteam />} />
                    <Route path='/map' element={<Map />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/signup' element={<Signup />} />
                    <Route path='/mypage' element={<Mypage />} />
                    <Route path='/arrival' element={<Arrival />} />
                </Routes>
            </Suspense>
        </Router>
    );
}

export default App;
