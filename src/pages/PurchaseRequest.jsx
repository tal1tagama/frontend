import { useState } from "react";
import Layout from "../components/Layout";
import { createPurchase } from "../services/purchasesService";
import { extractApiMessage } from "../services/response";
import "../styles/pages.css";

const topicos = [

{
id: 1,
titulo: "Materiais de Estrutura e Alvenaria",
itens: [
"Cimento CP I (comum)",
"Cimento CP II (comum e pozolânico)",
"Cimento CP III (alto-força)",
"Cimento rápido (desmoldante)",
"Areia fina (para argamassa de acabamento)",
"Areia média (para concreto)",
"Areia grossa (para fundações)",
"Pedra brita 0 (concreto leve)",
"Pedra brita 1, 2, 3 (concreto e base de piso)",
"Blocos de concreto (30x20x15, 40x20x15, etc.)",
"Blocos cerâmicos maciços",
"Blocos cerâmicos de vedação",
"Tijolos maciços",
"Tijolos furados",
"Argamassa pronta (assentamento e reboco)",
"Cal hidratada",
"Ferro / Vergalhão (4mm, 6mm, 8mm, 10mm, 12mm, 16mm)",
"Tela de aço / malha soldada (para lajes e pisos)",
"Chumbadores / buchas de ancoragem",
"Escoras metálicas e madeira para concretagem",
"Concreto pronto (se necessário)"
]
},

{
id: 2,
titulo: "Materiais para Lajes e Estruturas Metálicas",
itens: [
"Lajes pré-moldadas",
"Lajes maciças",
"Chapas metálicas",
"Perfis metálicos (IPE, H, U)",
"Arame galvanizado",
"Pregos e parafusos estruturais",
"Madeiramento para caixaria (caibros, vigas, ripas)",
"Manta térmica para lajes",
"Isolamento acústico"
]
},

{
id: 3,
titulo: "Materiais para Revestimentos e Acabamentos",
itens: [
"Revestimentos cerâmicos (pisos, paredes)",
"Pastilhas cerâmicas",
"Piso laminado, vinílico ou madeira",
"Rodapés (cerâmica, MDF, PVC)",
"Massa corrida",
"Gesso acartonado (drywall)",
"Tinta acrílica (paredes internas e externas)",
"Tinta esmalte (portas, janelas, metais)",
"Verniz / selador",
"Impermeabilizante (manta líquida, cimento + aditivo)",
"Argamassa colante",
"Rejunte",
"Textura ou grafiato",
"Adesivos decorativos"
]
},

{
id: 4,
titulo: "Materiais Hidráulicos",
itens: [
"Tubos PVC (água fria e esgoto)",
"Tubos PPR (água quente)",
"Tubos de cobre (água quente)",
"Conexões PVC e PPR (joelhos, T, luvas)",
"Válvulas de retenção e registros",
"Torneiras, misturadores, chuveiros",
"Caixas d’água (plástico, fibra, concreto)",
"Bombas de água",
"Filtros e purificadores",
"Abraçadeiras e suportes de tubos",
"Ralos, grelhas e sifões",
"Fitas veda rosca",
"Tubulações flexíveis para pressurização"
]
},

{
id: 5,
titulo: "Materiais Elétricos",
itens: [
"Cabos elétricos (cobre, alumínio, 1,5mm², 2,5mm², 4mm², 6mm²)",
"Eletrodutos (PVC, metálico)",
"Caixa de passagem e quadros de distribuição",
"Disjuntores (Diferencial e termomagnético)",
"Interruptores, tomadas e plugues",
"Luminárias e lâmpadas (LED, fluorescente, incandescente)",
"Conectores, bornes e fitas isolantes",
"Cabos de aterramento",
"Tomadas especiais (bancada, cozinha, banheiro)",
"Sensores de presença (opcional)"
]
},

{
id: 6,
titulo: "Ferramentas e Equipamentos",
itens: [
"Pá, enxada, picareta",
"Colher de pedreiro",
"Carrinho de mão",
"Baldes de 20L",
"Vassouras",
"Nível de bolha, prumo e esquadro",
"Trena 5m, 10m",
"Talhadeira, marreta e martelo",
"Betoneira",
"Serra manual e elétrica",
"Espátulas e desempenadeiras",
"Pulverizador para tinta",
"Brocas e furadeiras",
"Andaimes e escadas",
"Niveladora de piso"
]
},

{
id: 7,
titulo: "Materiais para Telhados e Coberturas",
itens: [
"Telhas cerâmicas, fibrocimento ou metálicas",
"Caibros, ripas, vigas de madeira",
"Pregos, parafusos, abraçadeiras",
"Isolantes térmicos",
"Calhas e rufos",
"Tela mosquiteira ou manta anti-inseto"
]
},

{
id: 8,
titulo: "Materiais de Proteção e Segurança",
itens: [
"Capacete",
"Luvas de proteção",
"Óculos de proteção",
"Bota de segurança",
"Cinto de segurança / talabarte",
"Máscaras respiratórias",
"Coletes refletivos",
"Fitas de sinalização",
"Protetor auricular"
]
},

{
id: 9,
titulo: "Materiais Diversos e Consumíveis",
itens: [
"Sacos plásticos",
"Fita crepe, fita isolante",
"Lonas de cobertura",
"Pregos, parafusos, grampos",
"Adesivos e selantes (silicone, PU)",
"Espuma expansiva",
"Cordas, cabos, arames",
"Limpeza: panos, escovas, detergentes",
"Lixas, esponjas, ferramentas de acabamento"
]
}

];

export default function PurchaseRequest(){

const [expanded,setExpanded]=useState(null);
const [selecionados,setSelecionados]=useState({});
const [error,setError]=useState("");
const [success,setSuccess]=useState("");
const [loading,setLoading]=useState(false);

const toggleTopico=(id)=>{
setExpanded(expanded===id?null:id);
};

const toggleItem=(item)=>{
setSelecionados(prev=>({
...prev,
[item]:!prev[item]
}));
};

const itensSelecionados=
Object.keys(selecionados)
.filter(key=>selecionados[key]);

const enviarSolicitacao = async () => {

  setError("");
  setSuccess("");

  if (itensSelecionados.length === 0) {
    setError("Selecione pelo menos um item.");
    return;
  }

  try {
    setLoading(true);
    const itemsPayload = itensSelecionados.map((descricao) => ({
      descricao,
      quantidade: 1,
      unidade: "un",
      valorUnitario: null,
      observacoes: null,
    }));

    await createPurchase(itemsPayload);

    setSuccess("Solicitacao enviada com sucesso!");
    setSelecionados({});

  } catch (err) {
    setError("Erro ao enviar solicitacao: " + extractApiMessage(err));
  } finally {
    setLoading(false);
  }
};

return(

<Layout>
  <div className="page-container">

    <h2 className="page-title">Nova Solicitação de Materiais</h2>
    <p style={{ fontSize: "var(--tamanho-fonte-grande)", color: "var(--cor-texto-secundario)", marginBottom: "var(--espacamento-xl)", lineHeight: "1.6" }}>
      Selecione uma categoria e marque os materiais que você precisa para a obra
    </p>

    {topicos.map(topico=>(

<div key={topico.id} style={{ marginBottom: "var(--espacamento-md)" }}>

<button
className="topic-button"
onClick={()=>toggleTopico(topico.id)}
style={{ width: "100%", textAlign: "left" }}
>
{expanded === topico.id ? "▼" : "▶"} {topico.titulo}
</button>

{expanded===topico.id &&(

<div className="items-container">

{topico.itens.map((item,index)=>(

<div
key={index}
className={selecionados[item] ? "item selected" : "item"}
onClick={()=>toggleItem(item)}
>

<input
type="checkbox"
checked={selecionados[item]||false}
readOnly
/>

<span>{item}</span>

</div>

))}

</div>

)}

</div>

))}

    <div className="summary">
      <h3>Itens Selecionados</h3>

      {itensSelecionados.length===0&&(
        <p style={{ color: "var(--cor-texto-secundario)", fontStyle: "italic" }}>Nenhum item selecionado ainda</p>
      )}

      {itensSelecionados.length > 0 && (
        <ul style={{ marginTop: "var(--espacamento-sm)", paddingLeft: "20px" }}>
          {itensSelecionados.map((item,index)=>(
            <li key={index} style={{ marginBottom: "var(--espacamento-xs)" }}>
              {item}
            </li>
          ))}
        </ul>
      )}
      
      {itensSelecionados.length > 0 && (
        <p style={{ marginTop: "var(--espacamento-md)", fontWeight: 600 }}>
          Total: {itensSelecionados.length} {itensSelecionados.length === 1 ? "item" : "itens"}
        </p>
      )}
    </div>
    
    {error && <p className="erro-msg">{error}</p>}
    {success && <p className="success-msg">{success}</p>}

    <button 
      className="button-primary" 
      onClick={enviarSolicitacao} 
      disabled={loading || itensSelecionados.length === 0}
    >
      {loading ? "Enviando solicitação..." : `Enviar Solicitação (${itensSelecionados.length} ${itensSelecionados.length === 1 ? "item" : "itens"})`}
    </button>

  </div>
</Layout>

);

}