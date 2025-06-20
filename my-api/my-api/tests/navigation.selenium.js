const {Builder, By, until} = require('selenium-webdriver');

(async function testNavigation() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        // Vai para o dashboard de admin
        await driver.get('http://127.0.0.1:5500/frontend/html/adminDashboard.html');

        // Clica no link "Utilizadores" na navegação lateral
        await driver.wait(until.elementLocated(By.linkText('Utilizadores')), 5000).click();

        // Espera que a secção de utilizadores fique visível (pode ser por scroll ou por id)
        const usersSection = await driver.wait(until.elementLocated(By.id('users-section')), 5000);

        // Verifica se o título da secção está visível
        const title = await usersSection.findElement(By.css('h3'));
        const titleText = await title.getText();

        if (titleText.includes('Utilizadores')) {
            console.log('Teste de navegação para a secção Utilizadores concluído com sucesso');
        } else {
            console.error('Falha ao navegar para a secção Utilizadores');
        }
    } catch (err) {
        console.error('Erro no teste de navegação:', err);
    } finally {
        await driver.quit();
    }
})();