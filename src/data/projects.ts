export type ProjectStatus = 'Yakında' | 'Devam Ediyor' | 'Tamamlandı' | 'Planlanıyor'

export type ProjectCategory = 'Organizasyon' | 'Sosyal Sorumluluk' | 'Altyapı'

export type ProjectContent = {
  title: string
  status: ProjectStatus
  category: ProjectCategory
  homeDescription: string
  projectsDescription: string
  detailTo: string
}

export const projectsContent: ProjectContent[] = [
  {
    title: 'Avrupa Birliği Simülasyonu Programı',
    status: 'Yakında',
    category: 'Organizasyon',
    homeDescription:
      'Öğrencilerin diplomasi, müzakere ve karar alma becerilerini geliştirdiği çok komiteli simülasyon programı.',
    projectsDescription:
      'Avrupa Birliği kurumlarını modelleyen komitelerde, temsil ve karar süreçlerine odaklanan uygulamalı simülasyon programı.',
    detailTo: '/projeler/avrupa-birligi-simulasyonu',
  },
  {
    title: 'E-Spor Turnuvası Etkinliği',
    status: 'Yakında',
    category: 'Organizasyon',
    homeDescription:
      'Takımların strateji, koordinasyon ve fair-play odağında yarıştığı çok okullu e-spor turnuvası.',
    projectsDescription:
      'Farklı okullardan takımların katıldığı, eleme ve final aşamalarından oluşan rekabetçi e-spor turnuvası etkinliği.',
    detailTo: '/projeler?e-spor-turnuvasi',
  },
  {
    title: 'Senato Karar Takip Paneli',
    status: 'Planlanıyor',
    category: 'Altyapı',
    homeDescription: 'Karar süreçlerini görünür kılan ve öğrenci erişimine açık şeffaf takip sistemi.',
    projectsDescription: 'Karar süreçlerini görünür kılan ve öğrenci erişimine açık şeffaf takip sistemi.',
    detailTo: '/projeler?karar-paneli',
  },
]

export const getProjectsPortfolioMetric = () => ({
  numeric: 30,
  display: '30+',
})

export const getProjectStatusCount = (status: ProjectStatus): number =>
  projectsContent.filter((project) => project.status === status).length
