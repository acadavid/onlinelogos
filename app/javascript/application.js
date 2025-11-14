// Entry point for the build script in your package.json
import "@hotwired/turbo-rails"
import "./controllers"
import uitoolkit from "@zoom/videosdk-ui-toolkit"
import { createApp, h } from "vue"
import VueKonva from "vue-konva"
import * as VueComponents from "./components"

window.uitoolkit = uitoolkit
window.VueComponents = VueComponents

window.createVueApp = (component, props = {}) => {
  const app = createApp({
    render: () => h(component, props)
  })
  app.use(VueKonva)
  return app
}
