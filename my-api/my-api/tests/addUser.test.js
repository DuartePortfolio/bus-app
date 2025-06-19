const {Builder, By, until} = require('selenium-webdriver');

(async function testAddUser() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        // Vai para o dashboard de admin
        await driver.get('http://127.0.0.1:5500/frontend/html/adminDashboard.html');

        // Abre o modal de adicionar utilizador
        await driver.wait(until.elementLocated(By.css('button[data-bs-target="#modalAdicionarUtilizador"]')), 5000).click();

        // Preenche o formulário
        await driver.wait(until.elementLocated(By.name('name')), 5000).sendKeys('Teste Selenium');
        await driver.findElement(By.name('email')).sendKeys('selenium@teste.com');
        await driver.findElement(By.name('password')).sendKeys('123456');
        await driver.findElement(By.name('role')).sendKeys('driver');
        await driver.findElement(By.name('contact')).sendKeys('912345678');

        // Submete o formulário
        await driver.findElement(By.css('#modalAdicionarUtilizador .btn.btn-primary')).click();

        console.log('Teste de adicionar utilizador concluído com sucesso');
    } catch (err) {
        console.error('Erro no teste de adicionar utilizador:', err);
    } finally {
        await driver.quit();
    }
})();