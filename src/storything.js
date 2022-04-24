import {createApp} from 'vue'
import Tagify from '@yaireo/tagify'
import Papa from 'papaparse'

let tagify = new Tagify(document.getElementById("tags"))

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

const app = createApp({
    data() {
        return {
            stories: [],
            allStories: []
        }
    },

    methods: {
        handleTagChange(evt) {
            let filterTags = evt.detail
            if (filterTags.length == 0) { this.stories = this.allStories }
            else {
                this.stories = this.allStories.filter(s => filterTags.every(ft => s.Tags.includes(ft)))
            }
        },

        addTag(tag) {
            tagify.addTags([tag])
        },
    },
    mounted: async function() {
        let data = await new Promise(resolve => {
            Papa.parse("stories.csv", {
                download: true,
                header: true,
                complete: function(results) {
                    let stories = results.data

                    // convert tags to arrays
                    stories = stories.filter(x => x.Title.length > 0).map(x => ({...x, Tags: x.Tags.split(',').map(t => t.trim())}))
                    resolve(stories)
                }
            })
        })

        console.log(data)

        this.allStories = data
        this.stories = data
        tagify.whitelist = [... new Set(data.flatMap(x => x.Tags).sort())]

        document.addEventListener('tagchange', this.handleTagChange)
    }
})
app.mount('#app')


