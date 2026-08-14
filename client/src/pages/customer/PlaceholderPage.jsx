import Container from '@/components/ui/Container';

/**
 * Structural placeholder for pages whose backend/data layer is built in a
 * later phase (see project roadmap). Intentionally plain — no fake data,
 * no dead interactive elements — so it's honest about its own state.
 */
export default function PlaceholderPage({ title, note }) {
  return (
    <Container className="py-24 sm:py-32 flex flex-col items-center text-center gap-4 min-h-[50vh]">
      <span className="tracking-label text-xs uppercase text-gold-dark">Coming Soon</span>
      <h1 className="font-display text-3xl sm:text-4xl text-espresso">{title}</h1>
      {note && <p className="text-muted text-sm max-w-md">{note}</p>}
    </Container>
  );
}
