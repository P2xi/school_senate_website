export const SENATE_RECIPIENTS = [
  { key: 'senato-baskani', name: 'Ozan Biçici', role: 'Senato Başkanı' },
  { key: 'teknoloji-baskani', name: 'Arda Eşdoğan', role: 'Teknoloji Başkanı' },
  { key: 'medya-iletisim-baskani', name: 'Hasan Suat Tezcan', role: 'Medya İletişim Başkanı' },
  { key: 'proje-strateji-baskani', name: 'Mustafa Yağız Görgün', role: 'Proje Strateji Başkanı' },
  { key: 'kultur-sanat-baskani', name: 'Ela Tunga', role: 'Kültür ve Sanat Başkanı' },
  { key: 'mali-isler-baskani', name: 'Tuana Yıldırım', role: 'Mali İşler Başkanı' },
  { key: 'sosyal-girisim-baskani', name: 'Elif Sultan Gül', role: 'Sosyal Girişim Başkanı' },
] as const

export type SenateRecipientKey = (typeof SENATE_RECIPIENTS)[number]['key']

export const getRecipient = (key: string) =>
  SENATE_RECIPIENTS.find((recipient) => recipient.key === key)

