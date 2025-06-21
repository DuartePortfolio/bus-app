export async function handleDelete(url, reloadFn) {
    if (confirm('Tem a certeza que deseja apagar este registo?')) {
        try {
            const res = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.ok) {
                reloadFn();
                alert('Registo apagado com sucesso!');
            } else {
                const error = await res.json();
                alert(error.error || 'Erro ao apagar registo.');
            }
        } catch (err) {
            alert('Internal server error');
        }
    }
}
