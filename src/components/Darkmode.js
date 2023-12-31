import React, { useState, useEffect } from 'react';
import "../styles/overall.css";
import sunIcon from "../img/sun.svg";
import moonIcon from "../img/moon.svg";



export function Darkmode() {
    const [theme, setTheme] = useState('light');
    const [icon, setIcon] = useState(moonIcon);

    
    const toggleTheme = () => {
        if (theme === 'light') {
            setTheme('dark');
            setIcon(sunIcon);
        } else {
            setTheme('light');
            setIcon(moonIcon);
        }
    };


    useEffect(() => {
        document.body.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    return (
        <div>
            <button onClick={toggleTheme} id='toggleButton'> <img src={icon} id="toggleIcon"></img> </button>
        </div>
        
    )
}