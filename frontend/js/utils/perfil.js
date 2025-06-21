document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Sessão expirada. Faça login novamente.');
    window.location.href = 'login.html';
    return;
  }

  // Descodifica o token para obter o user_id
  let userId;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    userId = payload.user_id;
  } catch {
    alert('Token inválido. Faça login novamente.');
    window.location.href = 'login.html';
    return;
  }

  // Vai buscar os dados do utilizador à API
  try {
    const res = await fetch(`http://localhost:3000/api/users/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Erro ao obter dados do utilizador');
    const user = await res.json();

    // Preenche o perfil no HTML
    document.querySelector('#profile-name').textContent = user.name;
    document.querySelector('#profile-role').textContent = user.role === 'operator' ? 'Administrador' : 'Condutor';
    document.getElementById('nome').textContent = user.name.split(' ')[0];
    document.getElementById('sobrenome').textContent = user.name.split(' ').slice(1).join(' ');
    document.getElementById('email').textContent = user.email;
    document.getElementById('cargo').textContent = user.role === 'operator' ? 'Administrador' : 'Condutor';
    // Adiciona outros campos conforme o teu HTML

  } catch (err) {
    alert('Erro ao carregar perfil.');
  }
});