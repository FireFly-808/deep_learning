import {FC} from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import {About} from './About';
import {Header} from './Header';
import {Home} from './Home';

const area = {
    header: 'header',
    element: 'element',
};

const style:React.CSSProperties = {
    display: 'grid',
    width: '100vw',
    height: '100vh',
    position: 'relative',
    overflowX: 'hidden',
    margin: 0,
    padding: 0,
    border: 0,
    background: '#282828',
    color: '#b8b7ad',
    gridTemplate: `
    " ${area.header} " 0.05fr
    " ${area.element} " 1fr
    / 1fr`
};

export const FireFly:FC = () => {
    return(
        <Router>
            <div style={style}>
                <Header style={{gridArea: area.header}} />
                <Routes>
                    <Route path="/" element={<Home style={{gridArea: area.element}}/>}/>
                    <Route path="/about" element={<About style={{gridArea: area.element}}/>}/>
                </Routes>
            </div>
        </Router>
    );
}

  