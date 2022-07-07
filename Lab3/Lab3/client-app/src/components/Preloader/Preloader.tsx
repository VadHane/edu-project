import React, { FunctionComponent } from 'react';
import './Preloader.css';

const Preloader: FunctionComponent = () => {
    return (
        <div className="preloader-background">
            <div className="lds-dual-ring"></div>
        </div>
    );
};

export default Preloader;
