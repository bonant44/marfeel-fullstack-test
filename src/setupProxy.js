const { createProxyMiddleware: proxy } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    proxy({
      target: 'http://localhost:3001',
      pathRewrite: {'^/api' : ''},
      changeOrigin: true,
    })
  );
};
