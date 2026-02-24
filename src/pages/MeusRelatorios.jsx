import { useEffect,useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import "../styles/pages.css";

function MeusRelatorios(){

const [medicoes,setMedicoes]=useState([]);

useEffect(()=>{

api.get("/medicoes")
.then(res=>{
setMedicoes(res.data || []);
})
.catch(err=>{
console.log("Erro medicoes:",err);
});

},[]);

return(

<Layout>
  <div className="page-container">

    <h2 className="page-title">Meus Relatórios</h2>

{medicoes.length===0 && (

<p>Nenhuma medição enviada</p>

)}

{medicoes.map(m=>(

<div key={m.id} className="card">

<p>{m.descricao}</p>

<img
src={`http://localhost:5000/${m.foto}`}
alt={m.descricao || "Foto da medição"}
width="200"
/>

</div>

))}

  </div>
</Layout>

);

}

export default MeusRelatorios;