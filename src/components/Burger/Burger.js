import React from 'react';

import classes from './Burger.css'
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = props => {
    let transformedIngredients = Object.keys(props.ingredients)
        .map(igKey => {
            return [...Array(props.ingredients[igKey])] //!NOTE: this will create an array with length = props.ingredients[igKey]
                .map((_, i) => {
                    return <BurgerIngredient key={igKey + i} type={igKey} />
                });
        })
        //TODO: Flatten the array
        .reduce((accumulator, element) => {
            return accumulator.concat(element);
        }, []);

    // console.log(transformedIngredients);
    if (transformedIngredients.length === 0) {
        transformedIngredients = <p>Please start adding ingredients</p>
    }

    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top" />

            {/* NOTE: Static way to display ingredients */}
            {/* <BurgerIngredient type="cheese" />
            <BurgerIngredient type="meat" /> */}

            {/* NOTE: Dynamic way to display ingredients */}
            {transformedIngredients}

            <BurgerIngredient type="bread-bottom" />
        </div>
    );
}

export default burger;