import React, { Component } from 'react';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';

class Checkout extends Component {
    state = {
        ingredients: {
            salad: 1,
            meat: 1,
            cheese: 1,
            bacon: 1
        }
    }

    componentDidMount() {
        //!NOTE: parse data tu ingredient de build cai hamburger cho dung

        const query = new URLSearchParams(this.props.location.search);
        const ingredients = {};
        for (let param of query.entries()) {
            //moi param co syntax la ['salad', '1']
            ingredients[param[0]] = +param[1];
        }
        this.setState({ ingredients: ingredients });
    }

    checkoutCancelledHandler = () => {
        this.props.history.goBack(); //go back to the previous page
    }

    checkoutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data');
        // this.props.history.push('/checkout/contact-data');
    }

    render() {
        return (
            <div>
                <CheckoutSummary
                    ingredients={this.state.ingredients}
                    checkoutCancelled={this.checkoutCancelledHandler}
                    checkoutContinued={this.checkoutContinuedHandler} />
            </div>
        )
    }
}

export default Checkout;