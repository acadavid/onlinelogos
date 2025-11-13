// Entry point for the build script in your package.json
import "@hotwired/turbo-rails"
import "./controllers"
import uitoolkit from "@zoom/videosdk-ui-toolkit"
import { createApp } from "vue"
import * as VueComponents from "./components"

window.uitoolkit = uitoolkit
window.createVueApp = createApp
window.VueComponents = VueComponents
