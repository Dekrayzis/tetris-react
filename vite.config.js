const { defineConfig } = require('vite');

module.exports = defineConfig(async () => {
  const { default: react } = await import('@vitejs/plugin-react');

  return {
    plugins: [react()],
    server: {
      port: 5173,
    },
  };
});
