<template>
    <div class="page-foot">
        <a href="https://github.com/nostalgic-css/NES.css" target="_blank">
            <i class="nes-icon github"></i>
            Theme Support by NES.css
        </a>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component
export default class PageFoot extends Vue {}
</script>

<style>
.page-foot {
    position: fixed;
    left: 20px;
    bottom: 10px;
}
</style>
