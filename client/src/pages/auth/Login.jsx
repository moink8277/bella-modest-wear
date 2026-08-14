import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import SEO from '@/components/common/SEO';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/context/ToastContext';
import { validateEmail, required } from '@/utils/validators';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('idle');
    const [serverError, setServerError] = useState('');

    const redirectTo = location.state?.from?.pathname || '/account';

    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const validate = () => {
        const nextErrors = {
            email: validateEmail(form.email),
            password: required(form.password, 'Password'),
        };
        setErrors(nextErrors);
        return !nextErrors.email && !nextErrors.password;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        if (!validate()) return;

        setStatus('loading');
        try {
            await login(form);
            toast.success('Welcome back');
            navigate(redirectTo, { replace: true });
        } catch (err) {
            setStatus('error');
            setServerError(err.message || 'Invalid email or password.');
            return;
        }
        setStatus('idle');
    };

    return (
        <>
            <SEO title="Sign In" path="/login" />

            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2 text-center">
                    <h1 className="font-display text-3xl text-espresso">Welcome Back</h1>
                    <p className="text-sm text-muted">Sign in to continue to your account.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                    <Input
                        type="email"
                        label="Email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange('email')}
                        error={errors.email}
                        autoComplete="email"
                        required
                    />

                    <div className="flex flex-col gap-1.5">
                        <Input
                            type="password"
                            label="Password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange('password')}
                            error={errors.password}
                            autoComplete="current-password"
                            required
                        />
                        <Link to="/forgot-password" className="text-xs text-gold-dark hover:underline self-end">
                            Forgot password?
                        </Link>
                    </div>

                    {serverError && (
                        <p role="alert" className="text-sm text-maroon bg-maroon/5 border border-maroon/20 rounded-[var(--radius-bmw)] px-3 py-2">
                            {serverError}
                        </p>
                    )}

                    <Button type="submit" variant="primary" size="lg" loading={status === 'loading'} className="w-full">
                        Sign In
                    </Button>
                </form>

                <p className="text-center text-sm text-muted">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-gold-dark hover:underline">
                        Create one
                    </Link>
                </p>
            </div>
        </>
    );
}