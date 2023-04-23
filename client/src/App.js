import {useEffect} from 'react';
import './App.css';
import Header from './components/Layout/Header/Header.js';
import Footer from './components/Layout/Footer/Footer.js';
import Home from  './components/Home/Home.js';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import WebFont from "webfontloader"
import LoginSignup from './User/LoginSignup';



function App() {

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto:300,400,500,700"],
      },
    });
    
  })


  return (
      <BrowserRouter>
      <Routes>
      {/* <Header /> */}
      <Route exact path='/' Component={Home}/>
      <Route exact path='/login' Component={LoginSignup}/>

      {/* <Footer /> */}
      </Routes>
      </BrowserRouter>
  );
}

export default App;
