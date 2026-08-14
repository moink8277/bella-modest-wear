import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import SEO from '@/components/common/SEO';
import { useAuth } from '@/hooks/useAuth';
import { validateEmail, required } from '@/utils/validators';

export default function AdminLogin() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('idle');
    const [serverError, setServerError] = useState('');

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
            const user = await login(form);
            if (user?.role !== 'ADMIN') {
                setServerError('This login is for administrators only.');
                setStatus('error');
                return;
            }
            navigate('/admin/dashboard', { replace: true });
        } catch (err) {
            setStatus('error');
            setServerError(err.message || 'Invalid credentials.');
        }
    };

    return (
        <div className="min-h-screen bg-espresso flex items-center justify-center px-4">
            <SEO title="Admin Access" path="/secure-panel" noIndex />

            <div className="w-full max-w-sm flex flex-col gap-8">
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="h-12 w-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                        <ShieldCheck className="h-6 w-6 text-gold" strokeWidth={1.5} />
                    </div>
                    <h1 className="font-display text-2xl text-ivory">Administrator Access</h1>
                    <p className="text-xs text-cream/50 tracking-label uppercase">Bella Modest Wear</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                    <Input
                        type="email"
                        label="Email"
                        value={form.email}
                        onChange={handleChange('email')}
                        error={errors.email}
                        autoComplete="email"
                        className="bg-ink border-cream/15 text-ivory placeholder:text-cream/30"
                        required
                    />

                    <Input
                        type="password"
                        label="Password"
                        value={form.password}
                        onChange={handleChange('password')}
                        error={errors.password}
                        autoComplete="current-password"
                        className="bg-ink border-cream/15 text-ivory placeholder:text-cream/30"
                        required
                    />

                    {serverError && (
                        <p role="alert" className="text-sm text-maroon-light bg-maroon/10 border border-maroon/30 rounded-[var(--radius-bmw)] px-3 py-2">
                            {serverError}
                        </p>
                    )}

                    <Button type="submit" variant="gold" size="lg" loading={status === 'loading'} className="w-full">
                        Sign In
                    </Button>
                </form>

                <p className="text-center text-[11px] text-cream/30">
                    This area is restricted to authorized administrators only.
                </p>
            </div>
        </div>
    );
}