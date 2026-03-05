/**
 * Validação centralizada de senha.
 * Usada em Register.jsx e Profile.jsx para garantir política uniforme.
 *
 * Regras:
 *  - Mínimo 8 caracteres
 *  - Ao menos uma letra maiúscula
 *  - Ao menos um número
 *
 * @param {string} senha
 * @returns {string|null} mensagem de erro ou null se válida
 */
export function validarSenha(senha) {
  if (!senha || senha.length < 8) {
    return "A senha deve ter pelo menos 8 caracteres.";
  }
  if (!/[A-Z]/.test(senha)) {
    return "A senha deve conter ao menos uma letra maiúscula.";
  }
  if (!/[0-9]/.test(senha)) {
    return "A senha deve conter ao menos um número.";
  }
  return null;
}
