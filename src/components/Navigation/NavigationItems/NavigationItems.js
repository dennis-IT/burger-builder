import React from 'react';

import classes from './NavigationItems.css';
import NavagationItem from './NavigationItem/NavigationItem';

const navigationItems = () => (
    <ul className={classes.NavigationItems}>
        <NavagationItem link="/" exact>Burger Builder</NavagationItem>
        <NavagationItem link="/orders">Orders</NavagationItem>
    </ul>
);

export default navigationItems;