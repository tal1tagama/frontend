import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/pages.css";

function StatusSolicitacao(){

const [solicitacoes,setSolicitacoes]=useState([]);

useEffect(()=>{

api.get("/solicitacoes")
.then(res=>{
setSolicitacoes(res.data || []);
})
.catch(err=>{
console.log("Erro solicitacoes:",err);
});

},[]);

return(

<div className="page-container">

<h2>Status Solicitações</h2>

{solicitacoes.length===0 && (

<p>Nenhuma solicitação encontrada</p>

)}

{solicitacoes.map(s=>(

<div key={s.id} className="card">

<p><b>ID:</b> {s.id}</p>

<p><b>Status:</b> {s.status}</p>

</div>

))}

</div>

);

}

export default StatusSolicitacao;