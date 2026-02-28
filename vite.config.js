const { defineConfig } = require('vite');

module.exports = defineConfig(async () => {
  const { default: react } = await import('@vitejs/plugin-react');

  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['public/index.html'],
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.[jt]sx?$/,
      exclude: [],
    },
    server: {
      port: 5173,
    },
  };
});
