export type ProjectStatus = 'Devam Ediyor' | 'Tamamlandı' | 'Planlanıyor'

export type ProjectCategory = 'Organizasyon' | 'Sosyal Sorumluluk' | 'Altyapı'

export type ProjectContent = {
  title: string
  status: ProjectStatus
  category: ProjectCategory
  homeDescription: string
  projectsDescription: string
  detailTo: string
}

export type UpcomingProjectContent = {
  title: string
  date: string
  status: 'Planlandı'
}

export const projectsContent: ProjectContent[] = [
  {
    title: 'Avrupa Birliği Simülasyonu Programı',
    status: 'Planlanıyor',
    category: 'Organizasyon',
    homeDescription:
      'Öğrencilerin diplomasi, müzakere ve karar alma becerilerini geliştirdiği çok komiteli simülasyon programı.',
    projectsDescription:
      'Avrupa Birliği kurumlarını modelleyen komitelerde, temsil ve karar süreçlerine odaklanan uygulamalı simülasyon programı.',
    detailTo: '/projeler/avrupa-birligi-simulasyonu',
  },
  {
    title: 'E-Spor Turnuvası Etkinliği',
    status: 'Planlanıyor',
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

export const upcomingProjectsContent: UpcomingProjectContent[] = [
  {
    title: 'LÖSEV Farkındalık Panosu',
    date: '2–8 Kasım 2026',
    status: 'Planlandı',
  },
  {
    title: 'Türk Dilleri ve Tarihi Topluluğu Üye Alımı',
    date: 'Kasım 2026',
    status: 'Planlandı',
  },
  {
    title: 'Engelsiz Yaşam Çalıştayı Başvuruları',
    date: 'Kasım 2026',
    status: 'Planlandı',
  },
  {
    title: 'Atatürk’ü Anma ve Farkındalık Faaliyetleri',
    date: '10–16 Kasım 2026',
    status: 'Planlandı',
  },
  {
    title: 'NASA Space Apps Challenge',
    date: '14–15 Kasım 2026',
    status: 'Planlandı',
  },
  {
    title: 'E-Spor Turnuvası',
    date: '16–22 Kasım 2026',
    status: 'Planlandı',
  },
  {
    title: 'Öğretmenler Günü Faaliyetleri',
    date: '24 Kasım 2026',
    status: 'Planlandı',
  },
  {
    title: 'Kasım Ayı Öğrenci Geri Bildirimleri ve Aralık Talepleri',
    date: '27 Kasım 2026',
    status: 'Planlandı',
  },
]

export const getProjectsPortfolioMetric = () => ({
  numeric: 30,
  display: '30+',
})

export const getProjectStatusCount = (status: ProjectStatus): number =>
  projectsContent.filter((project) => project.status === status).length
