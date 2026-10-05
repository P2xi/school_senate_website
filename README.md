# senato

## Supabase üyelik sistemi

1. Supabase panelinde bir proje oluşturun.
2. `.env.example` dosyasını `.env.local` adıyla kopyalayın.
3. `VITE_SUPABASE_URL` ve `VITE_SUPABASE_PUBLISHABLE_KEY` değerlerini Supabase projenizin **Connect** ekranından alın.
4. Supabase **Authentication > URL Configuration** bölümünde site URL'nizi ve `/uyelik` dönüş adresini izinli yönlendirme adreslerine ekleyin.

Yerel geliştirme için örnek dönüş adresi: `http://localhost:5173/uyelik`

> Tarayıcı uygulamasına yalnızca publishable (veya eski projelerde anon) key ekleyin. `service_role` anahtarını hiçbir zaman istemci tarafında kullanmayın.

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
