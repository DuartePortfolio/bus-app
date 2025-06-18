document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = form.email.value;
    const password = form.password.value;

    try {
      const response = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok && data.token) {
        // Guarda o token na local storage
        localStorage.setItem('token', data.token);

        // Descodifica o token para obter o role (operator ou driver)
        const decodedToken = JSON.parse(atob(data.token.split('.')[1]));
        if (decodedToken.role === 'operator') {
          window.location.href = '../html/adminDashboard.html';
        } else if (decodedToken.role === 'driver') {
          window.location.href = '../html/condutorDashboard.html';
        } else {
          alert('Role desconhecido.');
        }
      } else {
        alert(data.error || 'Login falhou');
      }
    } catch (err) {
      alert('Erro ao comunicar com o servidor.');
    }
  });
});