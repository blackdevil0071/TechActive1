const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = 3001; // Choose any available port

// Define the proxy middleware
const apiProxy = createProxyMiddleware('/api', {
  target: 'https://crudcrud.com/api/b62037ad58424e37bb12e80d53876ca1',
  changeOrigin: true,
  pathRewrite: { '^/api': '' }, // Remove '/api' prefix from the request
});

// Use the proxy middleware
app.use('/api', apiProxy);

app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});
