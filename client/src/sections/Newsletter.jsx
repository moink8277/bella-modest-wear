import { useState } from 'react';
import Container from '@/components/ui/Container';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      // Wired to POST /api/newsletter/subscribe in Phase 10.
      await new Promise((resolve) => setTimeout(resolve, 400));
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="py-16 sm:py-20">
      <Container className="flex flex-col items-center text-center gap-5 max-w-lg">
        <h2 className="font-display text-2xl sm:text-3xl text-espresso">
          Join the Bella Circle
        </h2>
        <p className="text-sm text-muted">
          New arrivals, styling edits and early access — straight to your inbox.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full">
          <Input
            type="email"
            required
            placeholder="Enter your email"
            aria-label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="primary" loading={status === 'loading'}>
            Subscribe
          </Button>
        </form>
        {status === 'success' && (
          <p className="text-xs text-emerald" role="status">Thank you — you're on the list.</p>
        )}
        {status === 'error' && (
          <p className="text-xs text-maroon" role="alert">Something went wrong. Please try again.</p>
        )}
      </Container>
    </section>
  );
}
