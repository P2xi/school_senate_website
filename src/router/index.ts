import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import MainPage from '@/views/MainPage.vue'

const HakkimizdaPage = () => import('@/views/HakkimizdaPage.vue')
const EkibimizPage = () => import('@/views/EkibimizPage.vue')
const ProjelerPage = () => import('@/views/ProjelerPage.vue')
const DuyurularPage = () => import('@/views/DuyurularPage.vue')
const IletisimPage = () => import('@/views/IletisimPage.vue')
const AvrupaBirligiSimulasyonuPage = () => import('@/views/AvrupaBirligiSimulasyonuPage.vue')
const UyelikPage = () => import('@/views/UyelikPage.vue')

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
        { path: 'uyelik', name: 'membership', component: UyelikPage },
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

