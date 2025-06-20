const {Builder, By, until} = require('selenium-webdriver');

(async function testLogin() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        // Navega para a página de login
        await driver.get('http://127.0.0.1:5500/frontend/html/login.html');

        // Espera e encontra os campos
        await driver.wait(until.elementLocated(By.id('email')), 5000);
        const emailField = await driver.findElement(By.id('email'));

        await driver.wait(until.elementLocated(By.id('password')), 5000);
        const passwordField = await driver.findElement(By.id('password'));

        await driver.wait(until.elementLocated(By.id('login-button')), 5000);
        const loginButton = await driver.findElement(By.id('login-button'));

        // Preenche e submete
        await emailField.sendKeys("Admin");
        await passwordField.sendKeys("Esmad");
        await loginButton.click();

        console.log('Teste ao login concluido com sucesso')
    } catch (err) {
        console.error('An error occurred:', err);
    } finally {
        await driver.quit();
    }
})();