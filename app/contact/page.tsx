import Link from 'next/link';
import { FaArrowLeft, FaEnvelope, FaGithub, FaGlobe, FaLinkedin } from 'react-icons/fa';

const contactItems = [
  {
    label: 'Portfolio',
    href: 'https://portfolio-next16.vercel.app/',
    icon: FaGlobe,
    blurb: 'See live products, experiments, and polished UI work.',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/Qamrul-Hassan',
    icon: FaGithub,
    blurb: 'Explore code, architecture choices, and implementation details.',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/md-qamrul-hassan-a44b3835b/',
    icon: FaLinkedin,
    blurb: 'Professional profile, experience, and collaboration history.',
  },
];

export default function ContactPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-app px-4 py-10 sm:px-6 sm:py-14">
      <div aria-hidden="true" className="decor-orb decor-orb-one" />
      <div aria-hidden="true" className="decor-orb decor-orb-two" />

      <section className="relative z-10 mx-auto w-full max-w-5xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 transition hover:border-sky-300 hover:text-sky-700 dark:border-slate-500 dark:bg-slate-800/80 dark:text-slate-100 dark:hover:border-cyan-300 dark:hover:text-cyan-200"
        >
          <FaArrowLeft />
          Back to Dictionary
        </Link>

        <article className="accent-glow relative mt-5 overflow-hidden rounded-[2rem] border border-cyan-200/35 bg-[linear-gradient(135deg,rgba(2,6,23,0.95),rgba(30,64,175,0.92),rgba(14,116,144,0.9))] p-6 shadow-[0_26px_70px_rgba(2,6,23,0.5)] sm:p-10">
          <div className="pointer-events-none absolute inset-0 opacity-90 [background-image:radial-gradient(circle_at_14%_20%,rgba(125,211,252,0.22),transparent_34%),radial-gradient(circle_at_84%_72%,rgba(129,140,248,0.22),transparent_34%)]" />
          <div className="pointer-events-none absolute inset-[10px] rounded-[1.5rem] border border-cyan-200/22" />

          <header className="relative">
            <p className="inline-flex rounded-full border border-cyan-200/70 bg-cyan-300/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-cyan-100">
              Contact
            </p>
            <h1 className="mt-3 bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-6xl">
              Let&apos;s Build Something Rare
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-cyan-50 sm:text-base">
              Connect with Qamrul Hassan Shajal for product design and frontend engineering
              collaborations.
            </p>
          </header>

          <section className="relative mt-8 grid gap-4 sm:grid-cols-3">
            {contactItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-2xl border border-cyan-200/45 bg-slate-900/24 p-4 transition hover:-translate-y-1 hover:border-cyan-200/70 hover:bg-slate-900/36"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cyan-200/65 bg-cyan-300/18 text-cyan-50 shadow-[0_8px_20px_rgba(6,182,212,0.25)]">
                    <Icon />
                  </span>
                  <p className="mt-3 text-lg font-extrabold text-white">{item.label}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-cyan-100">
                    {item.blurb}
                  </p>
                </a>
              );
            })}
          </section>

          <section className="relative mt-6 rounded-2xl border border-cyan-200/45 bg-slate-900/24 p-4">
            <p className="inline-flex items-center gap-2 text-sm font-bold text-cyan-50">
              <FaEnvelope />
              Direct Email
            </p>
            <a
              href="mailto:mdqamrul74@gmail.com"
              className="mt-2 block text-lg font-extrabold text-white underline decoration-cyan-200/70 underline-offset-4"
            >
              mdqamrul74@gmail.com
            </a>
          </section>
        </article>
      </section>
    </main>
  );
}
