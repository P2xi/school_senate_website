# senato

## Supabase üyelik ve mesajlaşma sistemi

1. Supabase panelinde bir proje oluşturun.
2. `.env.example` dosyasını `.env.local` adıyla kopyalayın.
3. `VITE_SUPABASE_URL` ve `VITE_SUPABASE_PUBLISHABLE_KEY` değerlerini Supabase projenizin **Connect** ekranından alın.
4. Supabase **Authentication > URL Configuration** bölümünde site URL'nizi ve `/uyelik` dönüş adresini izinli yönlendirme adreslerine ekleyin.
5. Supabase **SQL Editor** ekranında [`supabase/migrations/202610120001_create_messaging.sql`](supabase/migrations/202610120001_create_messaging.sql) dosyasının tamamını çalıştırın.

Yerel geliştirme için örnek dönüş adresi: `http://localhost:5173/uyelik`

> Tarayıcı uygulamasına yalnızca publishable (veya eski projelerde anon) key ekleyin. `service_role` anahtarını hiçbir zaman istemci tarafında kullanmayın.

### Senato hesabı yetkilendirme

Bir kullanıcı normal şekilde hesap açtıktan sonra hesabı ilgili başkanlığın gelen kutusuna atamak için SQL Editor'da aşağıdaki sorguyu çalıştırın:

```sql
update public.profiles p
set role = 'senator', inbox_key = 'senato-baskani'
from auth.users u
where p.id = u.id
  and lower(u.email) = lower('senato-uyesi@okul.edu.tr');
```

Geçerli `inbox_key` değerleri:

- `senato-baskani`
- `teknoloji-baskani`
- `medya-iletisim-baskani`
- `proje-strateji-baskani`
- `kultur-sanat-baskani`
- `mali-isler-baskani`
- `sosyal-girisim-baskani`

Aynı başkanlığa birden fazla senato hesabı atanabilir. Tüm başkanlık mesajlarını yönetmesi gereken hesap için `role = 'admin'` ve `inbox_key = null` kullanın.

Mesaj tablolarında Row Level Security aktiftir. Normal üyeler yalnızca kendi konuşmalarını; senato hesapları yalnızca atandıkları gelen kutusunu; yöneticiler tüm başkanlık kutularını görebilir.

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
