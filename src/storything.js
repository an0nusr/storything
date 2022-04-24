import {createApp} from 'vue'
import Tagify from '@yaireo/tagify'

// this must be defined prior to importing the storything component
var tagify = new Tagify(document.getElementById("tags"))
window.tagify = tagify

import Storything from "./storything.vue"

document.getElementById("tags").addEventListener("change", (e) => {
    let tags = JSON.parse(e.target.value ? e.target.value : "[]")
    if (tags.length > 0) {
        tags = tags.map((x) => x.value)
    }
    
    let evt = new CustomEvent("tagchange", {detail: tags})
    document.dispatchEvent(evt)
})

window.addEventListener("keydown", (e) => {
    if (e.key == "Escape") {
        tagify.removeAllTags()
    }
})

const app = createApp(Storything)
app.mount("#app")

