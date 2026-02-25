import { useState } from "react";
import { createPurchase } from "../services/purchasesService";
import "../styles/pages.css";

function NovaSolicitacao() {

const [selecionados, setSelecionados] = useState({});
const [mensagem, setMensagem] = useState("");
const [loading, setLoading] = useState(false);

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

setLoading(true);
const itemsPayload = itens.map((descricao) => ({ descricao }));
await createPurchase(itemsPayload);

setMensagem("Solicitação enviada");

setSelecionados({});

}catch{

setMensagem("Erro ao enviar");

}finally{

setLoading(false);

}

};

return (

<div className="page-container">

<h2>Nova Solicitação</h2>

<button
className="button-primary"
onClick={enviarSolicitacao}
disabled={loading}
>
{loading ? "Enviando..." : "Enviar Solicitacao"}
</button>

<p>{mensagem}</p>

</div>

);

}

export default NovaSolicitacao;