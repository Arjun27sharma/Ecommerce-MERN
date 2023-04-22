import React, { Fragment } from 'react'
import Header from '../Layout/Header/Header'
import Footer from '../Layout/Footer/Footer'
import './Home.css'
import Metadata from '../Layout/Metadata.js'

const Home = () => {
  return (
    <Fragment>
        <Metadata title="Home" />
        <Header />
        <div className="banner">
            <p>Welcome to Ecommerce</p>
            <h1>FIND AMAZINGN PRODUCTS BELOW</h1>
            <a href="">
                <button>
                    Scroll
                </button>
            </a>
        </div>
        <Footer />
    </Fragment>
  )
}

export default Home