import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import SEO from '@/components/common/SEO';
import { resetPassword } from '@/services/authService';
import { validatePassword, validateConfirmPassword } from '@/utils/validators';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [form, setForm] = useState({ password: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('idle');
    const [serverError, setServerError] = useState('');

    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const validate = () => {
        const nextErrors = {
            password: validatePassword(form.password),
            confirmPassword: validateConfirmPassword(form.password, form.confirmPassword),
        };
        setErrors(nextErrors);
        return !nextErrors.password && !nextErrors.confirmPassword;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        if (!validate()) return;

        setStatus('loading');
        try {
            await resetPassword({ token, password: form.password });
            setStatus('success');
        } catch (err) {
            setStatus('error');
            setServerError(err.message || 'This reset link is invalid or has expired.');
        }
    };

    if (!token) {
        return (
            <>
                <SEO title="Reset Password" path="/reset-password" noIndex />
                <div className="flex flex-col items-center text-center gap-4">
                    <AlertTriangle className="h-10 w-10 text-maroon" strokeWidth={1.2} />
                    <h1 className="font-display text-2xl text-espresso">Invalid Reset Link</h1>
                    <p className="text-sm text-muted max-w-sm">
                        This password reset link is missing or malformed. Please request a new one.
                    </p>
                    <Link to="/forgot-password" className="text-sm text-gold-dark hover:underline mt-2">
                        Request New Link
                    </Link>
                </div>
            </>
        );
    }

    if (status === 'success') {
        return (
            <>
                <SEO title="Reset Password" path="/reset-password" noIndex />
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-emerald/10 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-emerald" strokeWidth={1.5} />
                    </div>
                    <h1 className="font-display text-2xl text-espresso">Password Reset</h1>
                    <p className="text-sm text-muted max-w-sm">
                        Your password has been updated. You can now sign in with your new password.
                    </p>
                    <Button variant="primary" onClick={() => navigate('/login')} className="mt-2">
                        Continue to Sign In
                    </Button>
                </div>
            </>
        );
    }

    return (
        <>
            <SEO title="Reset Password" path="/reset-password" noIndex />

            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2 text-center">
                    <h1 className="font-display text-3xl text-espresso">Set New Password</h1>
                    <p className="text-sm text-muted">Choose a new password for your account.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                    <Input
                        type="password"
                        label="New Password"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={handleChange('password')}
                        error={errors.password}
                        autoComplete="new-password"
                        required
                    />

                    <Input
                        type="password"
                        label="Confirm New Password"
                        placeholder="••••••••"
                        value={form.confirmPassword}
                        onChange={handleChange('confirmPassword')}
                        error={errors.confirmPassword}
                        autoComplete="new-password"
                        required
                    />

                    {serverError && (
                        <p role="alert" className="text-sm text-maroon bg-maroon/5 border border-maroon/20 rounded-[var(--radius-bmw)] px-3 py-2">
                            {serverError}
                        </p>
                    )}

                    <Button type="submit" variant="primary" size="lg" loading={status === 'loading'} className="w-full">
                        Reset Password
                    </Button>
                </form>
            </div>
        </>
    );
}