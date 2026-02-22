import { useState } from "react";
import api from "../services/api";
import "../styles/pages.css";

function NovaSolicitacao() {

const [selecionados, setSelecionados] = useState({});
const [mensagem, setMensagem] = useState("");

const toggleItem = (item) => {
setSelecionados(prev => ({
...prev,
[item]: !prev[item]
}));
};

const enviarSolicitacao = async () => {

const itens = Object.keys(selecionados)
.filter(i => selecionados[i]);

if(itens.length === 0){
setMensagem("Selecione pelo menos 1 item");
return;
}

try{

await api.post("/solicitacoes",{
descricao: itens
});

setMensagem("Solicitação enviada");

setSelecionados({});

}catch{

setMensagem("Erro ao enviar");

}

};

return (

<div className="page-container">

<h2>Nova Solicitação</h2>

<button
className="button-primary"
onClick={enviarSolicitacao}
>
Enviar Solicitação
</button>

<p>{mensagem}</p>

</div>

);

}

export default NovaSolicitacao;