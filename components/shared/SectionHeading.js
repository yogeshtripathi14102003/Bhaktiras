export default function SectionHeading({ eyebrow, title, description, align = "left" }) {
  const isCenter = align === "center";
  return (
    <div className={`max-w-2xl ${isCenter ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className="section-eyebrow text-peacock">{eyebrow}</p>}
      <h2 className="mt-2 font-display text-3xl font-semibold text-indigo sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 font-body text-sm text-indigo/70 sm:text-base">{description}</p>
      )}
    </div>
  );
}
