import "./nature.css";

const NATURE_COPY = [
  "I am developing a software/mobile application focused on the niche of camping, racing, and trail, building the project from scratch. Every technical decision — from choosing the stack, infrastructure, and architecture — is weighed based on the trade-offs involved, always evaluating whether the options are stable, performant, and suitable for the project.",
  "The API is built with Django 5.2 LTS, using native libraries and REST. The LTS version was chosen because it is the most stable, with long-term support and still receiving patches, ensuring security and sufficient performance for this type of software. Django keeps the code clean, the architecture lean, and development less extensive, although the cost is the framework's weight and raw performance that falls short of lighter stacks like Go or ASGI.",
  "PostgreSQL was adopted as the database for being secure, flexible, and performant in handling complex queries and non-linear reads, which are common in the application's domain. To prevent traffic spikes from overwhelming the database, I use Redis as a caching layer, ensuring the application remains fluid even under high demand and optimizing the user experience.",
  "On the frontend, the choice fell on Flutter, for the advantage of sharing a single codebase between iOS and Android, speeding up development and facilitating maintenance. The trade-off is dealing with platform-specific edges and working with Dart instead of two native stacks.",
] as const;

export function AppNatureSection() {
  return (
    <section id="app-nature" className="section-shell" aria-label="GO NATURE APP">
      <div className="nature-section">
        <article className="ui-card nature-card">
          <h2 className="text-card-title">
            GO NATURE{" "}
            <span className="nature-subtitle"> - App</span>
          </h2>
          <span className="text-body-muted nature-copy">
            {NATURE_COPY.map((paragraph) => (
              <span key={paragraph}>{paragraph}</span>
            ))}
          </span>
        </article>

        <article className="ui-card nature-card nature-video-card">
          <div className="nature-video-frame">
            <video
              src="/demos/go-nature.mp4"
              muted
              loop
              playsInline
              autoPlay
              preload="metadata"
              aria-label="Demonstração do aplicativo GO NATURE"
            />
          </div>
        </article>

        <article className="ui-card nature-card nature-arch-card">
          <h2 className="text-card-title">
            System architecture{" "}
            <span className="nature-subtitle"> - Specs</span>
          </h2>
          <p className="text-body-muted nature-arch-lead">
            Full product map: context, login, domain flows, and the specs behind
            GO NATURE — the same trade-offs described above, laid out end to end.
          </p>
          <div className="nature-arch-frame">
            <img
              src="/demos/go-nature-arch.png"
              alt="Diagrama de arquitetura e specs do aplicativo GO NATURE"
              width={1024}
              height={461}
            />
          </div>
        </article>
      </div>
    </section>
  );
}
