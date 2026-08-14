import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import SEO from '@/components/common/SEO';
import { forgotPassword } from '@/services/authService';
import { validateEmail } from '@/utils/validators';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [status, setStatus] = useState('idle');
    const [serverError, setServerError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');

        const validationError = validateEmail(email);
        setError(validationError);
        if (validationError) return;

        setStatus('loading');
        try {
            await forgotPassword(email);
            setStatus('sent');
        } catch (err) {
            setStatus('error');
            setServerError(err.message || 'Something went wrong. Please try again.');
        }
    };

    if (status === 'sent') {
        return (
            <>
                <SEO title="Forgot Password" path="/forgot-password" noIndex />
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-emerald/10 flex items-center justify-center">
                        <Mail className="h-6 w-6 text-emerald" strokeWidth={1.5} />
                    </div>
                    <h1 className="font-display text-2xl text-espresso">Check Your Email</h1>
                    <p className="text-sm text-muted max-w-sm">
                        If an account exists for <strong className="text-ink">{email}</strong>, a password
                        reset link has been sent.
                    </p>
                    <Link to="/login" className="text-sm text-gold-dark hover:underline mt-2">
                        Back to Sign In
                    </Link>
                </div>
            </>
        );
    }

    return (
        <>
            <SEO title="Forgot Password" path="/forgot-password" noIndex />

            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2 text-center">
                    <h1 className="font-display text-3xl text-espresso">Forgot Password?</h1>
                    <p className="text-sm text-muted">
                        Enter your email and we'll send you a link to reset your password.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                    <Input
                        type="email"
                        label="Email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={error}
                        autoComplete="email"
                        required
                    />

                    {serverError && (
                        <p role="alert" className="text-sm text-maroon bg-maroon/5 border border-maroon/20 rounded-[var(--radius-bmw)] px-3 py-2">
                            {serverError}
                        </p>
                    )}

                    <Button type="submit" variant="primary" size="lg" loading={status === 'loading'} className="w-full">
                        Send Reset Link
                    </Button>
                </form>

                <p className="text-center text-sm text-muted">
                    Remembered your password?{' '}
                    <Link to="/login" className="text-gold-dark hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </>
    );
}