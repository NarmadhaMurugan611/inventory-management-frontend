import React, { useState, useRef } from 'react';
import Axios from 'axios';
import WavesImg from '../assets/Images/waves.png'
import { AiFillEye } from 'react-icons/ai';
import { AiFillEyeInvisible } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Messages } from 'primereact/messages';
import './styles.css';

export const Login = () => {
  const [PasswordShow, setPasswordShow] = useState(false);
  const [emailLog, setEmailLog] = useState("");
  const [passwordLog, setPasswordLog] = useState("");
  const msgs = useRef(null);

  const togglePasswordShowValue = () => {
    setPasswordShow(!PasswordShow);
  };

  const navigate = useNavigate()

  const borderColorChange = (color) => {
    if (color === "green") {
      return "1px solid green";
    }
    else {
      return "1px solid red";
    }
  }
  const passwordValidation = (e) => {
    e.preventDefault();
    let email = document.getElementById("email");
    let password = document.getElementById("passwordArea-1");

    if (emailLog !== "") {
      email.style.border = borderColorChange("green");
    }
    else {
      email.style.border = borderColorChange("red");
    }

    if (passwordLog !== "") {
      password.style.border = borderColorChange("green");
    }
    else {
      password.style.border = borderColorChange("red");
    }

    const loginAuth = () => {
      Axios.post("http://localhost:2001/login", {
        email: emailLog,
        password: passwordLog
      }).then((response) => {
        if (response.status === 200) {
          localStorage.setItem("userToken", response.data.token);
          navigate('/home')
        }
      });
    }
    if (emailLog !== "" && passwordLog !== "") {
      msgs.current.show([
        { sticky: true, severity: 'error', summary: 'Error', detail: 'Email or password not Authorized', closable: true }]);
      loginAuth();
    }
  }
  return (
    <div className="registerPage">
      <div className="registerCard">
        <img className="wavesImg" src={WavesImg} alt="WavesImage" />
        <Messages ref={msgs} />
        <h1 className="registerTitle">Login</h1>
        <form className="registerForm" onSubmit={(e) => passwordValidation(e)}>
          <input id="email" type="email" placeholder="Email" onChange={(e) => { setEmailLog(e.target.value); }} required></input>
          <div className="inputField-eyeIcon">
            <input type={PasswordShow ? 'text' : 'password'} id="passwordArea-1" placeholder="Password" onChange={(e) => { setPasswordLog(e.target.value); }} required></input>
            <span className='login-eyeicon-1' onClick={togglePasswordShowValue}>{PasswordShow ? <AiFillEye /> : <AiFillEyeInvisible />}</span>
          </div>
          <h5 className="forget-pass"><Link to="/register">Create Account</Link></h5>
          <button type="submit" className="loginSubmitBtn">Login</button>
        </form>
      </div>
    </div>
  )
}
