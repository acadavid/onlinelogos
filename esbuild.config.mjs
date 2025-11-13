import esbuild from 'esbuild'
import vuePlugin from 'esbuild-plugin-vue3'

const isWatch = process.argv.includes('--watch')

const config = {
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
}

if (isWatch) {
  const context = await esbuild.context(config)
  await context.watch()
  console.log('👀 Watching for changes...')
} else {
  await esbuild.build(config)
}
