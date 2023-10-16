// html-routes.js
const path = require('path');

module.exports = function (app) {
  app.get('/', (req, res) => {
    res.render('main');
  });

  app.get('/dashboard', (req, res) => {
    res.render('dashboard');
  });

  app.get('/login', (req, res) => {
    res.render('login');
  });
};
