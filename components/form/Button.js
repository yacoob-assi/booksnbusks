// Button.jsx
import React from 'react';

const Button = ({ children, className, onClick }) => {
    return (
        <button className={`button-inverted mr-4 ${className}`} onClick={onClick}>
            {children}
        </button>
    );
}

export default Button;