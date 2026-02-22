import { Link } from "react-router-dom";

function Dashboard() {

return (

<div>

<h1>Sistema Obras</h1>

<Link to="/medicao">
<button>Enviar Medição</button>
</Link>

<Link to="/solicitacao">
<button>Solicitação</button>
</Link>

<Link to="/relatorios">
<button>Relatórios</button>
</Link>

</div>

);

}

export default Dashboard;