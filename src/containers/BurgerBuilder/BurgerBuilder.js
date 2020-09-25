import React, { Component } from 'react';

import Aux from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {

    //     }
    // }

    state = {
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },
        totalPrice: 4,          //Base price
        purchasable: false,     //For enable or disable Order Now button
        purchasing: false
    }

    //!TODO: Adding method to update purchase state
    updatePurchaseState(ingredients) {
        // const ingredients = {
        //     ...this.state.ingredients
        // };
        const sum = Object.keys(ingredients)    //!NOTE: use Object.keys(obj.) to enable array map function
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((accumulator, element) => {
                return accumulator + element;
            }, 0);

        this.setState({ purchasable: sum > 0 });
    }

    //!TODO: Adding methods to add and remove ingredients
    addIngredientHandler = type => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;

        //!NOTE: create onject immutable below to update ingredient
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;

        //!NOTE: create object immutable below to update the baase price
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;

        //!NOTE: update the state
        this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });

        //!NOTE: run update purchase state
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = type => {
        const oldCount = this.state.ingredients[type];

        if (oldCount <= 0) {
            return;
        }

        const updatedCount = oldCount - 1;

        //!NOTE: create onject immutable below to update ingredient
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;

        //!NOTE: create object immutable below to update the baase price
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;

        //!NOTE: update the state
        this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });

        //!NOTE: run update purchase state
        this.updatePurchaseState(updatedIngredients);

    }

    //!NOTE: The below code causes errors as the function is not using arrow -> issue with 'this' keyword
    // purchaseHandler() {
    //     this.setState({ purchasing: true });
    // }

    //!NOTE: change to arrow function
    purchaseHandler = () => {
        this.setState({ purchasing: true });
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false });
    }

    purchaseContinueHandler = () => {
        alert('You continued!');
    }

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        };

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    <OrderSummary
                        ingredients={this.state.ingredients}
                        purchaseCancelled={this.purchaseCancelHandler}
                        purchaseContinued={this.purchaseContinueHandler}
                        price={this.state.totalPrice}
                    />
                </Modal> {/*NOTE: A model for order summary */}

                <Burger ingredients={this.state.ingredients} />

                <BuildControls
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disabledInfo}
                    price={this.state.totalPrice}
                    purchasable={this.state.purchasable}
                    ordered={this.purchaseHandler}
                />
            </Aux>
        );
    }
}

export default BurgerBuilder;