import { FaCodeBranch } from 'react-icons/fa6';

/** Logo, nama produk, dan deskripsi singkat di bagian atas panel kiri. */
export function BrandHeader() {
  return (
    <div className="relative z-10">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 animate-glow items-center justify-center rounded-xl border border-geek-accent bg-geek-accent/15 text-geek-accent shadow-neon-accent">
          <FaCodeBranch className="text-xl" />
        </div>
        <div>
          <span className="font-mono text-xs font-bold tracking-wider text-geek-cyan uppercase">
            {'// Docs OS v4.2'}
          </span>
          <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
            OMIHelpdesk
            <span className="rounded border border-geek-secondary/30 bg-geek-secondary/15 px-2 py-0.5 text-xs font-semibold text-geek-secondary">
              PROD
            </span>
          </h1>
        </div>
      </div>

      <p className="mb-6 font-mono text-xs leading-relaxed text-slate-600">
        &gt; Authenticate credentials to access technical documentation, API endpoints, system
        specs, and secret knowledge bases.
      </p>
    </div>
  );
}
