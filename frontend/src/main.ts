import { createApp } from 'vue'
import App from './App.vue'
import './styles.css'
import router from './router'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

createApp(App).use(router).use(Toast, {
    transition: "Vue-Toastification__bounce",
    maxToasts: 5,
    newestOnTop: true,
    position: "bottom-center",
    timeout: 3000,
}).mount('#app')
