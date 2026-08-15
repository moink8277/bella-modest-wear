import { useState } from 'react';
import { User, Camera } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import SEO from '@/components/common/SEO';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/context/ToastContext';
import { required, maxLength } from '@/utils/validators';
import * as userService from '@/services/userService';

export default function Profile() {
    const { user, updateUser } = useAuth();
    const toast = useToast();

    const [form, setForm] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
    });
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const validate = () => {
        const nextErrors = {
            name: required(form.name, 'Name') || maxLength(form.name, 150, 'Name'),
        };
        setErrors(nextErrors);
        return !nextErrors.name;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSaving(true);
        try {
            const res = await userService.updateProfile({
                name: form.name,
                phone: form.phone || undefined,
            });
            updateUser(res.data);
            toast.success('Profile updated');
        } catch (err) {
            toast.error(err.message || 'Could not update your profile');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <SEO title="Profile" path="/account/profile" noIndex />

            <h2 className="font-display text-2xl text-espresso">Profile</h2>

            <Card padding="lg">
                <div className="flex items-center gap-4 mb-8">
                    <div className="relative h-16 w-16 rounded-full bg-beige flex items-center justify-center overflow-hidden shrink-0">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                            <User className="h-7 w-7 text-muted" strokeWidth={1.5} />
                        )}
                        {/* Avatar upload arrives with the Cloudinary integration (Phase 4). */}
                        <div className="absolute inset-0 bg-espresso/0 hover:bg-espresso/40 transition-colors flex items-center justify-center opacity-0 hover:opacity-100 cursor-not-allowed">
                            <Camera className="h-4 w-4 text-ivory" strokeWidth={1.5} />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-espresso font-medium">{user?.name}</p>
                        <p className="text-xs text-muted mt-0.5">{user?.email}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-md" noValidate>
                    <Input
                        label="Full Name"
                        value={form.name}
                        onChange={handleChange('name')}
                        error={errors.name}
                        required
                    />

                    <Input
                        label="Phone Number"
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={form.phone}
                        onChange={handleChange('phone')}
                        hint="Optional — used for order and delivery updates."
                    />

                    <Input label="Email" value={user?.email || ''} disabled hint="Email cannot be changed here." />

                    <Button type="submit" loading={isSaving} className="self-start">
                        Save Changes
                    </Button>
                </form>
            </Card>
        </div>
    );
}