type OrbsProps = {
  className?: string;
};

/**
 * گوی‌های نورانی شناور (بنفش و فیروزه‌ای).
 * Server Component است: حرکت فقط با CSS (`.orb-*` در globals.css) انجام می‌شود،
 * پس جاوااسکریپت اضافه‌ای به کلاینت نمی‌رسد و با prefers-reduced-motion خودکار متوقف می‌شود.
 */
export default function Orbs({ className = "" }: OrbsProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <span className="orb orb-a" />
      <span className="orb orb-b" />
      <span className="orb orb-c" />
      <span className="orb orb-d" />
    </div>
  );
}
