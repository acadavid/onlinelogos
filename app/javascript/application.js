// Entry point for the build script in your package.json
import "@hotwired/turbo-rails"
import "./controllers"
import uitoolkit from "@zoom/videosdk-ui-toolkit"
import { createApp } from "vue"
import VueKonva from "vue-konva"
import * as VueComponents from "./components"

window.uitoolkit = uitoolkit
window.VueComponents = VueComponents

window.createVueApp = (component) => {
  const app = createApp(component)
  app.use(VueKonva)
  return app
}
