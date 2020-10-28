import React, { Component } from 'react';

import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

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
        ingredients: null,
        // ingredients: {
        //     bacon: 0,
        //     cheese: 0,
        //     meat: 0,
        //     salad: 0
        // },
        totalPrice: 4,          //Base price
        purchasable: false,     //For enable or disable Order Now button
        purchasing: false,
        loading: false,
        error: false
    }

    //!TODO: Adding method to get ingredients data from firebase
    componentDidMount() {
        console.log(this.props);

        axios.get('https://react-my-burger-f4ec9.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({ ingredients: response.data });
            })
            .catch(err => {
                this.setState({ error: true });
            });
    };

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
        const queryParams = [];
        for (let i in this.state.ingredients) {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        }

        queryParams.push('price=' + this.state.totalPrice);

        const queryString = queryParams.join('&');

        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        });
    }

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        };

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        //!NOTE: Add loading animation
        let orderSummary = null;

        //!TODO: Add something to wait while ingredients are pulled from firebase
        let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />
        if (this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        price={this.state.totalPrice}
                        purchasable={this.state.purchasable}
                        ordered={this.purchaseHandler} />
                </Aux>
            );

            orderSummary = <OrderSummary
                ingredients={this.state.ingredients}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
                price={this.state.totalPrice} />;
        }

        if (this.state.loading) {
            orderSummary = <Spinner />;
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal> {/*NOTE: A model for order summary */}

                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);