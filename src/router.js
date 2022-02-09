import { createRouter, createWebHashHistory } from "vue-router";
import downloadMainPanel from "./components/download/download-main-panel.vue";
import dataManagerMainPanel from "./components/data-manager/data-manager-main-panel.vue";
import viewerMainPanel from "./components/viewer/viewer-main-panel.vue";
import home from "./components/home.vue";
const routes = [
    { name: 'home', path: '/', component: home },
    { name: 'download', path: '/download', component: downloadMainPanel },
    { name: 'data-manager', path: '/data-manager', component: dataManagerMainPanel },
    { name: 'viewer', path: '/viewer', component: viewerMainPanel },
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})