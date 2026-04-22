import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import MainPage from '@/views/MainPage.vue'
import HakkimizdaPage from '@/views/HakkimizdaPage.vue'
import EkibimizPage from '@/views/EkibimizPage.vue'
import ProjelerPage from '@/views/ProjelerPage.vue'
import DuyurularPage from '@/views/DuyurularPage.vue'
import IletisimPage from '@/views/IletisimPage.vue'
import AvrupaBirligiSimulasyonuPage from '@/views/AvrupaBirligiSimulasyonuPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        { path: '', name: 'home', component: MainPage },
        { path: 'hakkimizda', name: 'about', component: HakkimizdaPage },
        { path: 'ekibimiz', name: 'team', component: EkibimizPage },
        { path: 'projeler', name: 'projects', component: ProjelerPage },
        {
          path: 'projeler/avrupa-birligi-simulasyonu',
          name: 'eu-simulation',
          alias: ['/ab', '/projects/ab-simulasyon'],
          component: AvrupaBirligiSimulasyonuPage,
        },
        { path: 'duyurular', name: 'announcements', component: DuyurularPage },
        { path: 'iletisim', name: 'contact', component: IletisimPage },
      ],
    },
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0 }
  },
})

export default router

