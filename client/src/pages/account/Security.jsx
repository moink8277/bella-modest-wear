import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import SEO from '@/components/common/SEO';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/context/ToastContext';
import { validatePassword, validateConfirmPassword, required } from '@/utils/validators';
import * as userService from '@/services/userService';

export default function Security() {
    const { logout } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const validate = () => {
        const nextErrors = {
            currentPassword: required(form.currentPassword, 'Current password'),
            newPassword: validatePassword(form.newPassword),
            confirmPassword: validateConfirmPassword(form.newPassword, form.confirmPassword),
        };
        setErrors(nextErrors);
        return !nextErrors.currentPassword && !nextErrors.newPassword && !nextErrors.confirmPassword;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSaving(true);
        try {
            await userService.changePassword({
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
            });

            // The backend revokes every session on a successful password
            // change (see server user.controller.js), so log out locally too
            // and send the user back to /login rather than leaving them on a
            // page with a now-dead access token.
            toast.success('Password changed. Please log in again.');
            await logout();
            navigate('/login', { replace: true });
        } catch (err) {
            toast.error(err.message || 'Could not change your password');
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <SEO title="Security" path="/account/security" noIndex />

            <h2 className="font-display text-2xl text-espresso">Security</h2>

            <Card padding="lg">
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-10 w-10 rounded-full bg-beige flex items-center justify-center shrink-0">
                        <Lock className="h-4 w-4 text-espresso" strokeWidth={1.5} />
                    </div>
                    <div>
                        <p className="text-sm text-espresso font-medium">Change Password</p>
                        <p className="text-xs text-muted mt-0.5">
                            You'll be logged out of all devices after changing your password.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-md" noValidate>
                    <Input
                        label="Current Password"
                        type="password"
                        value={form.currentPassword}
                        onChange={handleChange('currentPassword')}
                        error={errors.currentPassword}
                        required
                    />

                    <Input
                        label="New Password"
                        type="password"
                        value={form.newPassword}
                        onChange={handleChange('newPassword')}
                        error={errors.newPassword}
                        hint="At least 8 characters, with a letter and a number."
                        required
                    />

                    <Input
                        label="Confirm New Password"
                        type="password"
                        value={form.confirmPassword}
                        onChange={handleChange('confirmPassword')}
                        error={errors.confirmPassword}
                        required
                    />

                    <Button type="submit" loading={isSaving} className="self-start">
                        Change Password
                    </Button>
                </form>
            </Card>
        </div>
    );
}