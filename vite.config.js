import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function reactPressCraManifest() {
  return {
    name: 'reactpress-cra-manifest',
    generateBundle(_, bundle) {
      const files = {
        'index.html': '/index.html',
      };
      const entrypoints = [];

      for (const chunk of Object.values(bundle)) {
        if (chunk.type !== 'asset' && chunk.type !== 'chunk') {
          continue;
        }

        const publicPath = `/${chunk.fileName}`;
        files[chunk.fileName] = publicPath;

        if (chunk.type === 'asset') {
          if (chunk.fileName.endsWith('.css')) {
            files.mainCss = publicPath;
            entrypoints.push(chunk.fileName);
          }
          continue;
        }

        if (chunk.isEntry) {
          files.mainJs = publicPath;
          entrypoints.push(chunk.fileName);
        }
      }

      this.emitFile({
        type: 'asset',
        fileName: 'asset-manifest.json',
        source: JSON.stringify(
          {
            files,
            entrypoints,
          },
          null,
          2
        ),
      });
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), reactPressCraManifest()],
  build: {
    outDir: 'build',
    assetsDir: 'static',
    rollupOptions: {
      output: {
        entryFileNames: 'static/js/[name]-[hash].js',
        chunkFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: ({ name }) => {
          if (name?.endsWith('.css')) {
            return 'static/css/[name]-[hash][extname]';
          }

          return 'static/media/[name]-[hash][extname]';
        },
      },
    },
  },
});
