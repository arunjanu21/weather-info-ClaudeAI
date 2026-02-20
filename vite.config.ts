import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [
    angular({
      tsconfig: 'tsconfig.json',
      advanced: {
        supportedBrowsers: ['chrome', 'edge', 'firefox', 'safari']
      }
    })
  ],
  server: {
    port: 4200,
    open: true,
  },
  build: {
    target: 'esnext',
  },
  optimizeDeps: {
    include: ['@angular/core', '@angular/common', '@angular/platform-browser']
  }
});
