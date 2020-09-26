import React from 'react';

import classes from './NavigationItems.css';
import NavagationItem from './NavigationItem/NavigationItem';

const navigationItems = () => (
    <ul className={classes.NavigationItems}>
        <NavagationItem link="/" active>Burger Builder</NavagationItem>
        <NavagationItem link="/">Checkout</NavagationItem>
    </ul>
);

export default navigationItems;