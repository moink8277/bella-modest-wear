import { Link } from 'react-router-dom';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <Container className="py-24 sm:py-32 flex flex-col items-center text-center gap-5 min-h-[60vh] justify-center">
      <span className="font-display text-6xl text-gold-dark">404</span>
      <h1 className="font-display text-2xl sm:text-3xl text-espresso">Page not found</h1>
      <p className="text-muted text-sm max-w-sm">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Button as={Link} to="/" variant="primary">
        Back to Home
      </Button>
    </Container>
  );
}
