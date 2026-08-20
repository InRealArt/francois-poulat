import { guarantees } from "@/lib/content";

const icons: Record<string, React.ReactNode> = {
  certificate: (
    <path d="M12 15l-4 4V6a2 2 0 012-2h8a2 2 0 012 2v13l-4-4-2 2-2-2zM9 8h6M9 11h6" />
  ),
  crate: <path d="M3 7l9-4 9 4-9 4-9-4zm0 0v10l9 4 9-4V7M12 11v10" />,
  shield: <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4zM9 12l2 2 4-4" />,
  wallet: (
    <path d="M3 7a2 2 0 012-2h12a2 2 0 012 2v3M3 7v10a2 2 0 002 2h14a2 2 0 002-2v-6h-5a2 2 0 100 4h5" />
  ),
};

export default function Guarantees() {
  return (
    <section
      id="garanties"
      className="border-b border-white/10 bg-[var(--background-grey)] py-20 md:py-28"
    >
      <div className="mx-auto max-w-[1440px] px-3 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-number mx-auto">
            {"// Excellence & Engagement"}
          </span>
          <h2 className="serif text-3xl italic sm:text-4xl">
            Garanties &amp; Confiance InRealArt
          </h2>
          <p className="mt-4 text-sm leading-loose text-gray-300 md:text-base">
            Chaque tirage physique est une pièce de collection préparée avec
            une rigueur d&rsquo;ingénierie et d&rsquo;artisanat d&rsquo;art.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-sm border border-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {guarantees.map((item) => (
            <div key={item.title} className="advantage-box">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.3}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-gold"
                aria-hidden
              >
                {icons[item.icon]}
              </svg>
              <h3 className="serif mt-4 text-lg italic text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
