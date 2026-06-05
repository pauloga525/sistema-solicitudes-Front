import { useState } from 'react';
import {
  GraduationCap,
  MapPin,
  Phone,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import logo from '../assets/Logo_PagWEBFuturo.png';

const campuses = [
  {
    name: 'Campus Carlos Crespi',
    address: 'Calle Tarqui y Pío Bravo',
    phone: '072-844-207',
  },
  {
    name: 'Campus María Auxiliadora',
    address: 'Calle Vega Muñoz y Padre Aguirre',
    phone: '072-850-642',
  },
  {
    name: 'Campus Yanuncay',
    address: 'Av. Don Bosco y Felipe II',
    phone: '072-814-274 / 072-882-606',
  },
];

const MAPS = [
  {
    label: 'Campus Carlos Crespi',
    src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3980!2d-79.00649746935194!3d-2.890576190306007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91cd199217c41347%3A0x45d6ec59a2beec86!2sUnidad%20Educativa%20T%C3%A9cnico%20Salesiano%20-%20Campus%20Carlos%20Crespi!5e0!3m2!1ses!2sec!4v1780678109926!5m2!1ses!2sec',
  },
  {
    label: 'Campus María Auxiliadora',
    src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3980!2d-79.00609740393985!3d-2.8919010227969015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91cd199645d42d79%3A0xa07c641345f081e6!2sUnidad%20Educativa%20T%C3%A9cnico%20Salesiano%20-%20Campus%20Mar%C3%ADa%20Auxiliadora!5e0!3m2!1ses!2sec!4v1780678220852!5m2!1ses!2sec',
  },
  {
    label: 'Campus Yanuncay',
    src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3980!2d-79.01642203237041!3d-2.9156254561750115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91cd187974d0ee41%3A0x5ee9dceea7b23bcd!2sUnidad%20Educativa%20T%C3%A9cnico%20Salesiano!5e0!3m2!1ses!2sec!4v1780678241925!5m2!1ses!2sec',
  },
];

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.3a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.84a8.18 8.18 0 0 0 4.78 1.52V6.9a4.85 4.85 0 0 1-1.01-.21z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const SpotifyIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 14.36c-.2.32-.62.42-.94.22-2.56-1.56-5.78-1.92-9.58-1.05-.36.08-.72-.14-.8-.5-.08-.36.14-.72.5-.8 4.16-.95 7.73-.54 10.6 1.19.32.2.42.62.22.94zm1.24-2.77c-.24.38-.76.5-1.14.26-2.93-1.8-7.4-2.32-10.87-1.27-.42.12-.86-.12-.98-.54-.12-.42.12-.86.54-.98 3.96-1.2 8.89-.62 12.23 1.45.38.24.5.76.22 1.08zm.11-2.89c-3.52-2.09-9.32-2.28-12.68-1.26-.5.15-1.02-.13-1.17-.62-.15-.5.13-1.02.62-1.17 3.86-1.17 10.28-.95 14.33 1.46.46.27.61.86.34 1.32-.27.46-.86.61-1.44.27z" />
  </svg>
);

const socialLinks = [
  {
    Icon: FacebookIcon,
    href: 'https://www.facebook.com/uetscuenca',
    label: 'Facebook',
  },
  {
    Icon: InstagramIcon,
    href: 'https://www.instagram.com/uetscuenca',
    label: 'Instagram',
  },
  {
    Icon: TikTokIcon,
    href: 'https://www.tiktok.com/@uetscuenca',
    label: 'TikTok',
  },
  {
    Icon: YoutubeIcon,
    href: 'https://www.youtube.com/c/UET%C3%A9cnicoSalesiano',
    label: 'YouTube',
  },
  { Icon: XIcon, href: 'https://x.com/uetscue', label: 'X' },
  {
    Icon: SpotifyIcon,
    href: 'https://open.spotify.com/intl-es/artist/5gLwRDP95HalLhHv7P6eeC?si=da2U8mfkS_aYOiv2YXXeaA&nd=1&dlsi=058d2f9871e24ca1',
    label: 'Spotify',
  },
];

export function Footer() {
  const [currentMap, setCurrentMap] = useState(0);

  function prev() {
    setCurrentMap((i) => (i - 1 + MAPS.length) % MAPS.length);
  }
  function next() {
    setCurrentMap((i) => (i + 1) % MAPS.length);
  }

  return (
    <footer className="bg-slate-900 text-white px-4 md:px-8 py-8">
      <div className="max-w-6xl mx-auto flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-6">
          {/* Col 1 — Logo */}
          <div className="flex flex-col items-start gap-3">
            <div className="flex items-center gap-2">
              <GraduationCap size={18} />
              <span className="font-semibold text-base">
                Unidad Educativa Técnico Salesiano
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              ¡Cómo no te voy a querer! #SomosElTécnicoDelFuturo
            </p>
            <img src={logo} alt="Logo UETS" className="h-45 w-auto mt-1" />
          </div>

          {/* Col 2 — Campus */}
          <div className="space-y-5">
            <h4 className="font-semibold text-amber-400">Nuestros Campus</h4>
            {campuses.map((campus) => (
              <div key={campus.name} className="space-y-1">
                <p className="text-white text-sm font-semibold">
                  {campus.name}
                </p>
                <div className="flex items-start gap-1.5 text-slate-400 text-xs">
                  <MapPin size={12} className="shrink-0 mt-0.5" />
                  <span>{campus.address}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                  <Phone size={12} className="shrink-0" />
                  <span>{campus.phone}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Col 3 — Redes sociales + Mapas */}
          <div className="space-y-4">
            <h4 className="font-semibold text-amber-400">Redes Sociales</h4>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-amber-400 hover:text-slate-900 transition-colors"
                >
                  <Icon />
                </a>
              ))}
            </div>

            {/* ── Carrusel de mapas ── */}
            <div className="pt-2">
              <h4 className="font-semibold text-amber-400 mb-3">Ubícanos</h4>

              {/* Cabecera: nombre + flechas */}
              <div className="flex items-center justify-between mb-2">
                <p className="text-white text-xs font-medium">
                  {MAPS[currentMap].label}
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={prev}
                    className="w-6 h-6 rounded-full bg-slate-800 hover:bg-amber-400 hover:text-slate-900 text-slate-400 flex items-center justify-center transition-colors"
                    aria-label="Mapa anterior"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    onClick={next}
                    className="w-6 h-6 rounded-full bg-slate-800 hover:bg-amber-400 hover:text-slate-900 text-slate-400 flex items-center justify-center transition-colors"
                    aria-label="Mapa siguiente"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Iframe del mapa activo */}
              <div
                className="rounded-xl overflow-hidden"
                style={{ height: 180 }}
              >
                <iframe
                  key={currentMap}
                  src={MAPS[currentMap].src}
                  width="100%"
                  height="180"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={MAPS[currentMap].label}
                />
              </div>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-3">
                {MAPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentMap(i)}
                    aria-label={`Ver mapa ${MAPS[i].label}`}
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: i === currentMap ? 20 : 8,
                      backgroundColor: i === currentMap ? '#f59e0b' : '#475569',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} Unidad Educativa Técnico Salesiano -
          Departamento de Sistemas. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
