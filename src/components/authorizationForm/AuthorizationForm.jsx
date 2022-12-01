import React from 'react';
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { useState } from "react";
import { AppContext } from '../../App';
import style from './authorizationForm.module.css';

const AuthorizationForm = () => {

  let urlAPI = "http://localhost:8081"
  // let urlAPI = "https://api.render.com/deploy/srv-cdsd74o2i3mrfomtaif0?key=P9LBS1EtT5A"

  // использование навигации - переброс на другой url
  let navigate = useNavigate()
  // использование контекста
  const context = React.useContext(AppContext)

  const [loginError, setloginError] = useState('');  // ошибка в логине
  const [passwordError, setPasswordError] = useState('');  // ошибка в пароле

  // state для пользователя
  const [user, setUser] = useState({
    login: "",
    password: ""
  })

  // объект пользователя с логином и паролем
  const { login, password } = user

  // при изменении в полях логина и пароля изменяются поля в объекте
  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  // обработка отправки формы
  const onSubmit = async (e) => {
    e.preventDefault();
    setloginError('') // обнуление полей ошибок
    setPasswordError('')
    await axios.post(urlAPI + "/api/login", user) // отправка запроса
      .then((response) => response.data)
      .then((data) => {
        if (data.fieldErrors) { // если есть ошибки
          data.fieldErrors.forEach(fieldError => {
            if (fieldError.field === 'loginError') {
              setloginError(fieldError.message);
            }
            if (fieldError.field === 'passwordError') {
              setPasswordError(fieldError.message);
            }
          });
        } else { // если нет ошибок
          localStorage.clear();
          let token = data.token
          localStorage.setItem('JSESSIONID', token); // записываем токен в браузер
          localStorage.setItem('USERNAME', password);
          localStorage.setItem('PASSWORD', login);
          // console.log("user.login: " + user.login)
          // context.setPasswordUser(user.password)
          // context.setLoginUser(user.login)
          // console.log("context.loginUser: " + context.loginUser)
          navigate('/personal');
        }
      })
      .catch((err) => err);
  }

  return (
    <div className={style["main-div"]}>

      <div>
        <form className={style["form-reg"]} method="POST" onSubmit={onSubmit}>

          <h3>Вход</h3>

          <div className={style["input-div"]}>
            <label>Введите логин</label><br />
            <input type="text"
              placeholder="Логин"
              id="login" name="login"
              value={login}
              onChange={(e) => onInputChange(e)} /><br />
            { loginError ? <span style={{ color: 'red', fontSize: '12px' }}>{loginError}</span> : '' }
          </div>

          <div className={style["input-div"]}>
            <label>Введите пароль</label><br />
            <input type="password"
              placeholder="Пароль"
              id="password" name="password"
              value={password}
              onChange={(e) => onInputChange(e)} /><br />
            { passwordError ? <span style={{ color: 'red', fontSize: '12px' }}>{passwordError}</span> : '' }
          </div>
          <button className={style["btn-submit"]} type="submit">Войти</button>
        </form>
      </div>

      <div className={style["blue-div"]}>
        <div className={style["computer-man"]}>
          <img src="./img/man.png" alt="man"></img>
          <div>
            <h2>Login to name</h2>
            <p>Lorem Ipsum is simply </p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default AuthorizationForm