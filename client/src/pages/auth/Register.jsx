import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import SEO from '@/components/common/SEO';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/context/ToastContext';
import {
    required,
    validateEmail,
    validatePassword,
    validateConfirmPassword,
} from '@/utils/validators';

function getPasswordStrength(password) {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
}

const STRENGTH_LABELS = ['Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = ['bg-maroon', 'bg-bronze', 'bg-gold', 'bg-emerald'];

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
    });
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('idle');
    const [serverError, setServerError] = useState('');

    const strength = getPasswordStrength(form.password);

    const handleChange = (field) => (e) => {
        const value = field === 'acceptTerms' ? e.target.checked : e.target.value;
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const validate = () => {
        const nextErrors = {
            name: required(form.name, 'Name'),
            email: validateEmail(form.email),
            password: validatePassword(form.password),
            confirmPassword: validateConfirmPassword(form.password, form.confirmPassword),
            acceptTerms: form.acceptTerms ? null : 'You must accept the Terms of Service.',
        };
        setErrors(nextErrors);
        return Object.values(nextErrors).every((v) => !v);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        if (!validate()) return;

        setStatus('loading');
        try {
            await register({ name: form.name, email: form.email, password: form.password });
            toast.success('Account created — welcome to Bella Modest Wear');
            navigate('/account', { replace: true });
        } catch (err) {
            setStatus('error');
            setServerError(err.message || 'Could not create your account. Please try again.');
            return;
        }
        setStatus('idle');
    };

    return (
        <>
            <SEO title="Create Account" path="/register" />

            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2 text-center">
                    <h1 className="font-display text-3xl text-espresso">Create Your Account</h1>
                    <p className="text-sm text-muted">Join Bella Modest Wear for a personalized experience.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                    <Input
                        label="Full Name"
                        placeholder="Your name"
                        value={form.name}
                        onChange={handleChange('name')}
                        error={errors.name}
                        autoComplete="name"
                        required
                    />

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

                    <div className="flex flex-col gap-2">
                        <Input
                            type="password"
                            label="Password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange('password')}
                            error={errors.password}
                            autoComplete="new-password"
                            required
                        />
                        {form.password && (
                            <div className="flex flex-col gap-1">
                                <div className="flex gap-1">
                                    {[0, 1, 2, 3].map((i) => (
                                        <span
                                            key={i}
                                            className={`h-1 flex-1 rounded-full ${i < strength ? STRENGTH_COLORS[strength - 1] : 'bg-border'}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs text-muted">
                                    {strength > 0 ? STRENGTH_LABELS[strength - 1] : ''}
                                </span>
                            </div>
                        )}
                    </div>

                    <Input
                        type="password"
                        label="Confirm Password"
                        placeholder="••••••••"
                        value={form.confirmPassword}
                        onChange={handleChange('confirmPassword')}
                        error={errors.confirmPassword}
                        autoComplete="new-password"
                        required
                    />

                    <div className="flex flex-col gap-1.5">
                        <Checkbox
                            label={
                                <>
                                    I agree to the{' '}
                                    <Link to="/terms" className="text-gold-dark hover:underline">
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link to="/privacy" className="text-gold-dark hover:underline">
                                        Privacy Policy
                                    </Link>
                                </>
                            }
                            checked={form.acceptTerms}
                            onChange={handleChange('acceptTerms')}
                        />
                        {errors.acceptTerms && <p className="text-xs text-maroon">{errors.acceptTerms}</p>}
                    </div>

                    {serverError && (
                        <p role="alert" className="text-sm text-maroon bg-maroon/5 border border-maroon/20 rounded-[var(--radius-bmw)] px-3 py-2">
                            {serverError}
                        </p>
                    )}

                    <Button type="submit" variant="primary" size="lg" loading={status === 'loading'} className="w-full">
                        Create Account
                    </Button>
                </form>

                <p className="text-center text-sm text-muted">
                    Already have an account?{' '}
                    <Link to="/login" className="text-gold-dark hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </>
    );
}