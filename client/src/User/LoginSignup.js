import React, {Fragment} from 'react'
import "./LoginSignup.css"
import Loader from "../layout/Loader/Loader"
import {LockOpenIcon, MailOutlineIcon} from "@mui/icons-material"
import { Link } from 'react-router-dom'

const LoginSignup = () => {
  return (
    <Fragment>
        <div className="LoginSignupContainer">
            <div className="LoginSignupBox">
                <div>
                    <div className="login_signup_toggle">
                        <p onClick={(e) => switchTabs(e, "login")}>Login</p>
                        <p onClick={(e) => switchTabs(e, "register")}>Register</p>
                    </div>
                    <button ref={switcherTab}></button>
                </div>

                <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
                    <div className="loginEmail">
                        <MailOutlineIcon />
                        <input 
                            type="email" 
                            placeholder='Email'
                            required
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                        />
                    </div>

                    <div className="loginPassword">
                        <LockOpenIcon />
                        <input
                            type="password"
                            placeholder='Password'
                            required
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                        />
                    </div>
                    <Link to="/forget/password">Forget Password?</Link>
                    <input type="submit" value="Login" className='loginBtn'/>
                </form>
            </div>

        </div>

    </Fragment>
  )
}

export default LoginSignup