import React, { useState } from "react";
import "../styles/pages.css";
const topicos = [
{
id:1,
titulo:"Materiais de Estrutura e Alvenaria",
itens:[
"Cimento CP I (comum)",
"Cimento CP II (comum e pozolânico)",
"Cimento CP III (alto-força)",
"Cimento rápido (desmoldante)",
"Areia fina (para argamassa de acabamento)",
"Areia média (para concreto)",
"Areia grossa (para fundações)",
"Pedra brita 0 (concreto leve)",
"Pedra brita 1, 2, 3 (concreto e base de piso)",
"Blocos de concreto",
"Blocos cerâmicos maciços",
"Blocos cerâmicos de vedação",
"Tijolos maciços",
"Tijolos furados",
"Argamassa pronta",
"Cal hidratada",
"Ferro / Vergalhão",
"Tela de aço",
"Chumbadores",
"Escoras metálicas",
"Concreto pronto"
]
},

{
id:2,
titulo:"Materiais Hidráulicos",
itens:[
"Tubos PVC",
"Tubos PPR",
"Conexões PVC",
"Registros",
"Torneiras",
"Caixa d’água",
"Bombas",
"Ralos",
"Fita veda rosca"
]
},

{
id:3,
titulo:"Materiais Elétricos",
itens:[
"Cabos elétricos",
"Eletrodutos",
"Quadro de distribuição",
"Disjuntores",
"Tomadas",
"Luminárias",
"Fita isolante",
"Aterramento"
]
}

];

function Requests(){

const [expanded,setExpanded] = useState(null);
const [selecionados,setSelecionados] = useState({});

const toggleTopico = (id)=>{
setExpanded(expanded === id ? null : id);
};

const toggleItem = (item)=>{

setSelecionados(prev=>({

...prev,
[item]:!prev[item]

}));

};

const itensSelecionados = Object.keys(selecionados)
.filter(item=>selecionados[item]);

return(

<div className="page">

<h1>Solicitação de Compras</h1>


{topicos.map(topico=>(

<div className="card" key={topico.id}>

<div
className="cardTitle"
onClick={()=>toggleTopico(topico.id)}
>

{topico.titulo}

</div>


{expanded === topico.id && (

<div className="cardContent">

{topico.itens.map((item,index)=>(

<label className="checkboxItem" key={index}>

<input
type="checkbox"
checked={!!selecionados[item]}
onChange={()=>toggleItem(item)}
/>

<span>{item}</span>

</label>

))}

</div>

)}

</div>

))}



<div className="card">

<h2>Resumo</h2>

{itensSelecionados.length === 0 && (

<p>Nenhum item selecionado</p>

)}

{itensSelecionados.map((item,index)=>(

<div key={index}>
• {item}
</div>

))}

</div>



<button className="primaryButton">

Enviar Solicitação

</button>



</div>

)

}

export default Requests;