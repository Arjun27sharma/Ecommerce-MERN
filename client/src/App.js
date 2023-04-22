import {useEffect} from 'react';
import './App.css';
import Header from './components/Layout/Header/Header.js';
import Footer from './components/Layout/Footer/Footer.js';
import Home from  './components/Home/Home.js';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import WebFont from "webfontloader"



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

      {/* <Footer /> */}
      </Routes>
      </BrowserRouter>
  );
}

export default App;
