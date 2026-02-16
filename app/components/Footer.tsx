import { FaEnvelope, FaGithub, FaGlobe, FaLinkedin } from 'react-icons/fa';

const footerLinks = [
  { label: 'Portfolio', href: 'https://portfolio-next16.vercel.app/', icon: FaGlobe, external: true },
  { label: 'GitHub', href: 'https://github.com/Qamrul-Hassan', icon: FaGithub, external: true },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/md-qamrul-hassan-a44b3835b/',
    icon: FaLinkedin,
    external: true,
  },
  { label: 'Contact', href: '/contact', icon: FaEnvelope, external: false },
];

export default function Footer() {
  return (
    <footer className="relative z-10 mt-auto px-4 pb-0 pt-3 sm:px-6 sm:pb-0 sm:pt-4">
      <div className="glass-panel accent-glow mx-auto w-full max-w-5xl rounded-3xl border border-white/65 bg-white/85 px-5 py-4 shadow-[0_18px_48px_rgba(15,23,42,0.16)] sm:px-7 dark:border-slate-600/60 dark:bg-slate-900/65">
        <div className="grid gap-3 text-center sm:grid-cols-[1fr_auto] sm:items-center sm:text-left">
          <div>
            <p className="text-sm font-extrabold tracking-[0.14em] text-slate-900 sm:text-base dark:text-slate-100">
              QAMRUL HASSAN SHAJAL
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-300">
              Smart Dictionary
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:justify-end">
            {footerLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noreferrer' : undefined}
                aria-label={link.label}
                className="footer-icon inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 transition hover:border-sky-300 hover:text-sky-700 dark:border-slate-500 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-cyan-300 dark:hover:text-cyan-200"
                style={{ animationDelay: `-${index * 0.35}s` }}
              >
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>

        <div className="mt-3 border-t border-slate-200/80 pt-2.5 dark:border-slate-600/70">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 dark:text-slate-300">
            Copyright {new Date().getFullYear()} Qamrul Hassan Shajal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
