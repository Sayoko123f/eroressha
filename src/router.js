import { createRouter, createWebHashHistory } from "vue-router";
import downloadMainPanel from "./components/download/download-main-panel.vue";
import dataManagerMainPanel from "./components/data-manager/data-manager-main-panel.vue";
import dataManagerShow from "./components/data-manager/data-manager-show.vue";
import viewerMainPanel from "./components/viewer/viewer-main-panel.vue";
import viewerAlbumDetail from "./components/viewer/viewer-album-detail.vue";
import viewerAlbumGallery from "./components/viewer/viewer-album-gallery.vue";
import home from "./components/home.vue";
const routes = [
    { name: 'home', path: '/', component: home },
    { name: 'download', path: '/download', component: downloadMainPanel },
    { name: 'data-manager', path: '/data-manager', component: dataManagerMainPanel },
    { name: 'data-manager-show', path: '/data-manager/:id', component: dataManagerShow },
    { name: 'viewer', path: '/viewer', component: viewerMainPanel },
    { name: 'viewer-album-detail', path: '/viewer/:id', component: viewerAlbumDetail },
    { name: 'viewer-album-gallery', path: '/viewer/:id/gallery', component: viewerAlbumGallery },
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})