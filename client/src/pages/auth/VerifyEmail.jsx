import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import SEO from '@/components/common/SEO';
import { verifyEmail } from '@/services/authService';

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState(token ? 'verifying' : 'missing');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!token) return;

        verifyEmail(token)
            .then(() => setStatus('success'))
            .catch((err) => {
                setStatus('error');
                setErrorMessage(err.message || 'This verification link is invalid or has expired.');
            });
    }, [token]);

    return (
        <>
            <SEO title="Verify Email" path="/verify-email" noIndex />

            <div className="flex flex-col items-center text-center gap-4">
                {status === 'verifying' && (
                    <>
                        <Loader2 className="h-10 w-10 text-gold animate-spin" strokeWidth={1.5} />
                        <h1 className="font-display text-2xl text-espresso">Verifying Your Email</h1>
                        <p className="text-sm text-muted">Please wait a moment...</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="h-12 w-12 rounded-full bg-emerald/10 flex items-center justify-center">
                            <CheckCircle2 className="h-6 w-6 text-emerald" strokeWidth={1.5} />
                        </div>
                        <h1 className="font-display text-2xl text-espresso">Email Verified</h1>
                        <p className="text-sm text-muted max-w-sm">
                            Your email has been confirmed. You now have full access to your account.
                        </p>
                        <Button as={Link} to="/account" variant="primary" className="mt-2">
                            Go to My Account
                        </Button>
                    </>
                )}

                {(status === 'error' || status === 'missing') && (
                    <>
                        <div className="h-12 w-12 rounded-full bg-maroon/10 flex items-center justify-center">
                            <XCircle className="h-6 w-6 text-maroon" strokeWidth={1.5} />
                        </div>
                        <h1 className="font-display text-2xl text-espresso">Verification Failed</h1>
                        <p className="text-sm text-muted max-w-sm">
                            {status === 'missing'
                                ? 'This verification link is missing or malformed.'
                                : errorMessage}
                        </p>
                        <Link to="/account" className="text-sm text-gold-dark hover:underline mt-2">
                            Resend verification from your account
                        </Link>
                    </>
                )}
            </div>
        </>
    );
}