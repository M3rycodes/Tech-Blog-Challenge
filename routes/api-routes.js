// api-routes.js
module.exports = function (app) {
    app.get('/api/message', (req, res) => {
      res.json({ message: 'This is an API route.' });
    });
  };
  