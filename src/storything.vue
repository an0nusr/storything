<template>
    <div id="app" class="flex flex-wrap justify-around">
            <article class="hidden ba mv4 ma2 w-40-ns w-100" v-for="story in stories" :key="story.Link">
                <h1 class="f4 bg-near-black white mv0 pv2 ph3">
                    <a class="link white dim" :href="story.Link" v-text="story.Title"></a>
                </h1>
                <div class="pa3 bt">
                    <p class="f6 f5-ns lh-copy measure mv0" v-html="story.Summary.replaceAll('\n', '<br/>')"></p>
                </div>
                <div class="pa3">
                    <a v-for="tag in story.Tags" :key=tag class="bg-light-blue white pa2 ma1 dib link dim" v-text="tag" href="#" @click="addTag(tag)"></a>
                </div>
            </article>
        </div>
</template>
<script>
import Papa from 'papaparse'

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

export default {
    data() {
        return {
            stories: [],
            allStories: [],
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

        this.allStories = data
        this.stories = data
        
        tagify.whitelist = [... new Set(data.flatMap(x => x.Tags).sort())]

        document.addEventListener('tagchange', this.handleTagChange)
    }
}
</script>
