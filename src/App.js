import React, {useState, useEffect} from 'react'
import {commerce} from './lib/commerce'
import {Typography,AppBar, Button, Card, Cardactions, CardContent, CardMedia, CssBaseline, Grid, Toolbar, Container} from '@material-ui/core'
import { Products, Navbar, Cart, Checkout } from './components';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

import useStyles from './styles'

const App = () => {
    const [products, setProducts] =useState([])
    const [cart, setCart] = useState({})
    const [order, setOrder] = useState({})
    const [errorMessage, setErrorMessage] = useState('')

    const fetchProducts = async () => {
        const {data} = await commerce.products.list();

        setProducts(data);
    }

    const fetchCart = async () => {
        setCart(await commerce.cart.retrieve())
    }

    const handleAddToCart =  async (productId, quantity) => {
        const {cart} = await commerce.cart.add(productId, quantity)

        setCart(cart)
    }

    const handleUpdateCartQty = async (productId, quantity) => {
        const {cart} = await commerce.cart.update(productId, {quantity})

        setCart(cart)
    }

    const handleRemoveFromCart = async (productId) => {
        const {cart} = await commerce.cart.remove(productId)

        setCart(cart)
    }

    const handleEmptyCart = async () => {
        const {cart} = await commerce.cart.empty()

        setCart(cart)
    }

    const refreshCart = async () => {
        const newCart = await commerce.cart.refresh()

        setCart(newCart)
    }

    const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
        try {
            const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder)

            setOrder(incomingOrder)
            refreshCart()
        } catch (error) {
            setErrorMessage(error.data.error.message);
        }
    }
 
    useEffect(() => {
        fetchProducts();
        fetchCart();
    }, [])

    console.log(cart)

    const classes = useStyles()

    return (        
        <>
        <CssBaseline/>
        <AppBar position="relative">
            <Toolbar>               
               <Typography variant="h6">
                   The Roger Ridley Experience
                   </Typography> 
            </Toolbar>
        </AppBar>
        <main>
            <div className={classes.container}>
                <Container maxWidth="sm">
                    <Typography variant="h2" align="center" color="textPrimary" gutterBottom>
                        Gallery 
                    </Typography>
                    <Typography variant="h5" align="center" color="textSecondary" paragraph>
"My eyes grow dim, and I could no more gaze;
     A wave of longing through my body swept,
And, hungry for the old, familiar ways
     I turned aside and bowed my head and wept."
                    </Typography>
                </Container>
            </div>
        </main>
        <Router>
            <div>
                <Navbar totalItems={cart.total_items}/>
                <Switch>
                    <Route exact path="/">
                    <Products products={products} onAddToCart={handleAddToCart}/>                    
                    </Route>
                    <Route exact path="/cart">
                        <Cart 
                        cart={cart} 
                        handleUpdateCartQty={handleUpdateCartQty}
                        handleRemoveFromCart={handleRemoveFromCart}
                        handleEmptyCart={handleEmptyCart}
                        />
                    </Route>
                    <Route exact path="/checkout">
                        <Checkout 
                        cart={cart}
                        order={order}
                        onCaptureCheckout={handleCaptureCheckout}
                        error={errorMessage}
                        />                        
                    </Route>                                  
                </Switch>                
            </div>
        </Router>
        </>
    )
}

export default App
