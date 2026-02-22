import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import EnviarMedicao from "./pages/EnviarMedicao";
import NovaSolicitacao from "./pages/NovaSolicitacao";
import MeusRelatorios from "./pages/MeusRelatorios";
import StatusSolicitacao from "./pages/StatusSolicitacao";

function App() {

return (

<BrowserRouter>

<Layout>

<Routes>

<Route path="/dashboard" element={<Dashboard/>}/>

<Route path="/medicao" element={<EnviarMedicao/>}/>

<Route path="/solicitacao" element={<NovaSolicitacao/>}/>

<Route path="/relatorios" element={<MeusRelatorios/>}/>

<Route path="/status" element={<StatusSolicitacao/>}/>

</Routes>

</Layout>

</BrowserRouter>

);

}

export default App;