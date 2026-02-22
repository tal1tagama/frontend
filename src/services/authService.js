const authService = {

async login(email, password){

const response = await fetch(
"http://localhost:5000/api/auth/login",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body: JSON.stringify({
email: email,
senha: password
})
}
);

const data = await response.json();

console.log("Resposta login:", data);

if(!response.ok){
throw new Error(data.message || "Erro no login");
}

// pega o token independente do formato
const token =
data.token ||
data.accessToken ||
data.data?.token;

if(token){
localStorage.setItem("token", token);
}

return data;

}

};

export default authService;