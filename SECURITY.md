# Güvenlik kurulumu ve işletim kontrol listesi

## 1. Acil anahtar işlemi

Daha önce sohbet içinde paylaşılan Supabase secret key artık sızmış kabul edilmelidir.

1. Supabase Dashboard → **Settings → API Keys** bölümünde eski secret key'i iptal edin.
2. Gerekliyse yeni bir secret key oluşturun; bu anahtarı frontend, Git veya `VITE_` değişkenlerine eklemeyin.
3. Frontend yalnızca `VITE_SUPABASE_PUBLISHABLE_KEY` kullanmalıdır.

## 2. Güvenlik migration'ı ve Edge Function

Supabase SQL Editor'da şu dosyayı çalıştırın:

`supabase/migrations/202610120002_security_audit.sql`

Ardından Edge Function'ı dağıtın:

```powershell
npx supabase login
npx supabase link --project-ref aksbktcrzftimmjxluuj
npx supabase functions deploy record-login
```

Function, yalnızca doğrulanmış kullanıcı JWT'siyle çağrılır. Başarılı oturumlarda hesap, IP, ülke, tarayıcı, işletim sistemi, cihaz türü ve güvence seviyesi kaydedilir. Parola, access token ve refresh token kaydedilmez.

Yönetici hesabı tanımlamak için:

```sql
update public.profiles p
set role = 'admin', inbox_key = null
from auth.users u
where p.id = u.id
  and lower(u.email) = lower('YONETICI_EPOSTASI');
```

Admin paneli: `https://www.eskisehirmbasenato.org/guvenlik`

## 3. Supabase Auth URL ve denetim günlükleri

Parola sıfırlama ve e-posta onayının localhost'a gitmemesi için Supabase Dashboard → **Authentication → URL Configuration** alanında:

- **Site URL:** `https://www.eskisehirmbasenato.org`
- **Redirect URLs:** `https://www.eskisehirmbasenato.org/uyelik`
- **Redirect URLs:** `https://www.eskisehirmbasenato.org/uyelik?mode=reset`

değerlerini kaydedin. Custom e-posta şablonu kullanılıyorsa Reset Password bağlantısı `{{ .ConfirmationURL }}` kullanmalıdır; sabit bir localhost adresi veya `{{ .SiteURL }}` ile elle oluşturulmuş bağlantı kullanmayın.

CLI ile aynı ayarları göndermek için `supabase/config.toml` hazırdır:

```powershell
npx supabase login
npx supabase link --project-ref aksbktcrzftimmjxluuj
npx supabase config push
```

Değişiklikten önce oluşturulmuş e-postalar eski localhost adresini taşımaya devam eder. Ayarı kaydettikten sonra yeni bir doğrulama veya parola sıfırlama e-postası gönderin.

Custom panel yalnızca uygulamanın kaydettiği başarılı oturumları gösterir. Yetkili ve eksiksiz Auth kaydı için:

1. Supabase Dashboard → **Authentication → Audit Logs** bölümüne gidin.
2. **Write audit logs to the database** seçeneğini açın.
3. Auth rate limitlerini **Authentication → Rate Limits** bölümünde kontrol edin.
4. E-posta doğrulamasını açık, anonim girişi kapalı tutun.

## 4. Cloudflare Turnstile

1. Cloudflare Dashboard → **Turnstile** → Add widget.
2. İzinli hostname olarak `eskisehirmbasenato.org` ve `www.eskisehirmbasenato.org` ekleyin.
3. Site key'i Vercel ortam değişkenine `VITE_TURNSTILE_SITE_KEY` adıyla ekleyip yeniden deploy edin.
4. Secret key'i Supabase Dashboard → **Authentication → Bot and Abuse Protection** bölümünde Cloudflare Turnstile sağlayıcısına ekleyin.
5. Turnstile korumasını yalnızca frontend site key deploy edildikten sonra etkinleştirin.

## 5. Cloudflare proxy ve WAF

Alan adının nameserver'ları Cloudflare'da olsa da canlı site şu anda doğrudan Vercel yanıtı veriyor. Cloudflare DNS ekranında web kayıtları için proxy durumunu **Proxied (turuncu bulut)** yapın.

Önerilen ayarlar:

- **SSL/TLS → Overview:** Full (strict)
- **Edge Certificates:** Always Use HTTPS açık
- **Minimum TLS Version:** TLS 1.2
- **TLS 1.3:** açık
- **HSTS:** `max-age=63072000`, includeSubDomains, preload
- **Security → Settings:** Bot Fight Mode açık
- **Security → WAF:** Cloudflare Managed Ruleset ve plan destekliyorsa OWASP Core Ruleset açık
- **Security → Rate limiting:** `/uyelik`, `/iletisim` ve `/guvenlik` için IP bazlı uygun eşikler

Cloudflare yalnızca sitenin alan adına gelen trafiği korur. Tarayıcının doğrudan `*.supabase.co` adresine yaptığı Auth/API çağrıları için Supabase rate limits, RLS ve Turnstile ayrıca gereklidir.

## 6. Veri saklama ve gizlilik

IP ve user-agent kişisel veridir. `login_events` kayıtları varsayılan olarak 90 günden uzun tutulmamalıdır:

```sql
select public.purge_old_login_events(90);
```

Bu sorguyu aylık bir Supabase Cron göreviyle çalıştırın. Güvenlik panelini yalnızca gerçekten ihtiyaç duyan `admin` hesaplarına verin ve kullanıcıları güvenlik günlüğü tutulduğu konusunda gizlilik metninde bilgilendirin.
