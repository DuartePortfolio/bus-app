// server.js
const app = require('./app');
const db = require('./models');

const PORT = process.env.PORT || 3000;

db.sequelize.sync({ force: false })
  .then(() => {
    console.log('✅ Base de dados sincronizada');
    app.listen(PORT, () => {
      console.log(`🚀 Server a correr em http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Erro ao sincronizar a BD:', err);
  });
