import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "../styles/pages.css";

export default function Login(){

const [email,setEmail]=useState("");
const [senha,setSenha]=useState("");

const navigate=useNavigate();

async function handleLogin(e){

e.preventDefault();

try{

await authService.login(email,senha);

navigate("/dashboard");

}catch(error){

alert("Login inválido");

}

}

return(

<div className="loginContainer">

<form
className="loginCard"
onSubmit={handleLogin}
>

<h2 className="loginTitle">

Login

</h2>

<input
className="input"
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<input
className="input"
type="password"
placeholder="Senha"
value={senha}
onChange={(e)=>setSenha(e.target.value)}
/>

<button className="button">

Entrar

</button>

</form>

</div>

)

}