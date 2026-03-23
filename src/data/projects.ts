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
    title: 'Sportfest Organizasyon Programı',
    status: 'Yakında',
    category: 'Organizasyon',
    homeDescription: 'Dört branşta takımların yarıştığı çok alanlı, okullar arası spor organizasyonu.',
    projectsDescription:
      'Farklı okulların dört branşta takımlar oluşturarak yarıştığı çok alanlı spor organizasyonu.',
    detailTo: '/projeler?sportfest',
  },
  {
    title: 'LÖSEV Farkındalık Çalıştayı Serisi',
    status: 'Yakında',
    category: 'Sosyal Sorumluluk',
    homeDescription: 'Öğrencileri sosyal projelere dahil eden toplumsal farkındalık odaklı çalıştay serisi.',
    projectsDescription:
      'Toplumsal farkındalık odağında planlanan ve öğrencileri sosyal projelere dahil eden çalıştay serisi.',
    detailTo: '/projeler?losev',
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
