import { useNavigate } from "react-router-dom";

export default function Navbar(){

const navigate = useNavigate();

function logout(){

localStorage.removeItem("token");

navigate("/");

}

return(

<div className="navbar">

<h3>Sistema</h3>

<button onClick={logout}>
Sair
</button>

</div>

)

}