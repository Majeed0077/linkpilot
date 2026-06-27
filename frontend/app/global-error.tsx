"use client";

export default function GlobalError({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            background: "#f7f4ee",
            color: "#1f2328",
            fontFamily:
              '"Plus Jakarta Sans", Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            padding: "24px"
          }}
        >
          <section
            style={{
              width: "min(720px, 100%)",
              background: "rgba(255, 255, 255, 0.76)",
              border: "1px solid rgba(255, 255, 255, 0.62)",
              boxShadow: "0 24px 60px rgba(31, 35, 40, 0.18)",
              padding: "40px"
            }}
          >
            <p
              style={{
                margin: "0 0 16px",
                color: "#e57f00",
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "0.18em",
                textTransform: "uppercase"
              }}
            >
              LinkPilot
            </p>
            <h1 style={{ margin: 0, fontSize: "32px", lineHeight: 1.15 }}>
              Something went wrong.
            </h1>
            <p style={{ margin: "18px 0 0", color: "#6d7480", lineHeight: 1.7 }}>
              Please retry the page. If this keeps happening, the request may need to be refreshed.
            </p>
            <button
              type="button"
              onClick={reset}
              style={{
                marginTop: "28px",
                border: 0,
                background: "#ff9f1a",
                color: "#111827",
                padding: "12px 18px",
                fontWeight: 800,
                cursor: "pointer"
              }}
            >
              Try again
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
