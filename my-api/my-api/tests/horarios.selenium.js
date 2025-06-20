const {Builder, By, until, Key} = require('selenium-webdriver');

(async function testHorariosSelect() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get('http://127.0.0.1:5500/frontend/horarios.html');

        // Seleciona Carreira pelo texto visível
        await driver.wait(until.elementLocated(By.id('carreira')), 5000);
        const carreira = await driver.findElement(By.id('carreira'));
        await carreira.sendKeys('Carreira 2');

        // Seleciona Percurso pelo texto visível
        await driver.wait(until.elementLocated(By.id('percurso')), 5000);
        const percurso = await driver.findElement(By.id('percurso'));
        await percurso.sendKeys('Percurso 3');

        // Seleciona Tipo de Dia pelo texto visível
        await driver.wait(until.elementLocated(By.id('tipodia')), 5000);
        const tipo = await driver.findElement(By.id('tipodia'));
        await tipo.sendKeys('Domingos');

        // Clica no botão de enviar/procurar
        await driver.wait(until.elementLocated(By.id('ver_horarios')), 5000);
        const enviarBtn = await driver.findElement(By.id('ver_horarios'));
        await enviarBtn.click();

        console.log('Teste de seleção e envio de horário concluído com sucesso!');
    } catch (err) {
        console.error('Erro no teste de seleção de horário:', err);
    } finally {
        await driver.quit();
    }
})();