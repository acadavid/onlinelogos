import esbuild from 'esbuild'
import vuePlugin from 'esbuild-plugin-vue3'

esbuild.build({
  entryPoints: ['app/javascript/application.js'],
  bundle: true,
  sourcemap: true,
  format: 'esm',
  outdir: 'app/assets/builds',
  publicPath: '/assets',
  plugins: [vuePlugin()],
  loader: {
    '.vue': 'js'
  }
}).catch(() => process.exit(1))
