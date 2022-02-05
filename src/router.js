import { createRouter, createWebHashHistory } from "vue-router";
import home from "./components/home.vue";
const routes = [
    { name: 'home', path: '/', component: home },
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})