import { useCallback, useState } from 'react';
import { MapPin, Plus, Pencil, Trash2, Star } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Loader from '@/components/ui/Loader';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import SEO from '@/components/common/SEO';
import { useFetch } from '@/hooks/useFetch';
import { useToast } from '@/context/ToastContext';
import { validatePhone, validatePincode, required } from '@/utils/validators';
import * as addressService from '@/services/addressService';

// Note: the backend returns raw DB rows (snake_case: full_name, postal_code,
// is_default) but accepts camelCase in request bodies (fullName, postalCode)
// — matches the live-tested Address API contract exactly, see the form
// submit handlers below for the camelCase payload shape.
const EMPTY_FORM = {
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
};

export default function Addresses() {
    const toast = useToast();

    const fetchAddresses = useCallback(() => addressService.getAddresses(), []);
    const { data, isLoading, error, refetch } = useFetch(fetchAddresses);
    const addresses = data?.data ?? [];

    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [settingDefaultId, setSettingDefaultId] = useState(null);

    const openAddModal = () => {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setErrors({});
        setModalOpen(true);
    };

    const openEditModal = (address) => {
        setEditingId(address.id);
        setForm({
            fullName: address.full_name,
            phone: address.phone,
            line1: address.line1,
            line2: address.line2 || '',
            city: address.city,
            state: address.state,
            postalCode: address.postal_code,
            country: address.country,
        });
        setErrors({});
        setModalOpen(true);
    };

    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const validate = () => {
        const nextErrors = {
            fullName: required(form.fullName, 'Full name'),
            phone: validatePhone(form.phone),
            line1: required(form.line1, 'Address line 1'),
            city: required(form.city, 'City'),
            state: required(form.state, 'State'),
            postalCode: validatePincode(form.postalCode),
        };
        setErrors(nextErrors);
        return !Object.values(nextErrors).some(Boolean);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSaving(true);
        try {
            if (editingId) {
                await addressService.updateAddress(editingId, form);
                toast.success('Address updated');
            } else {
                await addressService.createAddress(form);
                toast.success('Address added');
            }
            setModalOpen(false);
            refetch();
        } catch (err) {
            toast.error(err.message || 'Could not save this address');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            await addressService.deleteAddress(deleteTarget.id);
            toast.success('Address deleted');
            setDeleteTarget(null);
            refetch();
        } catch (err) {
            toast.error(err.message || 'Could not delete this address');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSetDefault = async (address) => {
        setSettingDefaultId(address.id);
        try {
            await addressService.setDefaultAddress(address.id);
            refetch();
        } catch (err) {
            toast.error(err.message || 'Could not set this address as default');
        } finally {
            setSettingDefaultId(null);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <SEO title="Your Addresses" path="/account/addresses" noIndex />

            <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="font-display text-2xl text-espresso">Your Addresses</h2>
                {addresses.length > 0 && (
                    <Button size="sm" onClick={openAddModal} className="inline-flex items-center gap-1.5">
                        <Plus className="h-4 w-4" strokeWidth={1.5} />
                        Add New Address
                    </Button>
                )}
            </div>

            {isLoading && <Loader label="Loading your addresses" />}

            {!isLoading && error && (
                <ErrorState message="We couldn't load your addresses right now." onRetry={refetch} />
            )}

            {!isLoading && !error && addresses.length === 0 && (
                <EmptyState
                    icon={MapPin}
                    title="No saved addresses"
                    description="Add an address to speed up checkout next time."
                    actionLabel="Add Address"
                    onAction={openAddModal}
                />
            )}

            {!isLoading && !error && addresses.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                    {addresses.map((address) => (
                        <Card key={address.id} padding="lg" className="flex flex-col gap-3">
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-sm text-espresso font-medium">{address.full_name}</p>
                                {address.is_default ? (
                                    <Badge tone="gold" className="inline-flex items-center gap-1">
                                        <Star className="h-3 w-3" strokeWidth={1.5} />
                                        Default
                                    </Badge>
                                ) : null}
                            </div>

                            <p className="text-sm text-ink-soft leading-relaxed">
                                {address.line1}
                                {address.line2 ? `, ${address.line2}` : ''}
                                <br />
                                {address.city}, {address.state} {address.postal_code}
                                <br />
                                {address.country}
                            </p>

                            <p className="text-xs text-muted">{address.phone}</p>

                            <div className="flex items-center gap-3 flex-wrap mt-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openEditModal(address)}
                                    className="inline-flex items-center gap-1.5"
                                >
                                    <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                                    Edit
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setDeleteTarget(address)}
                                    className="inline-flex items-center gap-1.5 text-maroon hover:bg-maroon/10"
                                >
                                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                                    Delete
                                </Button>
                                {!address.is_default && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        loading={settingDefaultId === address.id}
                                        onClick={() => handleSetDefault(address)}
                                    >
                                        Set as Default
                                    </Button>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingId ? 'Edit Address' : 'Add New Address'}
                size="lg"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button size="sm" loading={isSaving} onClick={handleSubmit}>
                            {editingId ? 'Save Changes' : 'Add Address'}
                        </Button>
                    </div>
                }
            >
                <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                    <Input
                        label="Full Name"
                        value={form.fullName}
                        onChange={handleChange('fullName')}
                        error={errors.fullName}
                        required
                    />
                    <Input
                        label="Phone"
                        value={form.phone}
                        onChange={handleChange('phone')}
                        error={errors.phone}
                        required
                    />
                    <Input
                        label="Address Line 1"
                        value={form.line1}
                        onChange={handleChange('line1')}
                        error={errors.line1}
                        required
                    />
                    <Input
                        label="Address Line 2 (Optional)"
                        value={form.line2}
                        onChange={handleChange('line2')}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="City"
                            value={form.city}
                            onChange={handleChange('city')}
                            error={errors.city}
                            required
                        />
                        <Input
                            label="State"
                            value={form.state}
                            onChange={handleChange('state')}
                            error={errors.state}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Postal Code"
                            value={form.postalCode}
                            onChange={handleChange('postalCode')}
                            error={errors.postalCode}
                            required
                        />
                        <Input
                            label="Country"
                            value={form.country}
                            onChange={handleChange('country')}
                        />
                    </div>
                </form>
            </Modal>

            <Modal
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                title="Delete this address?"
                size="sm"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(null)}>
                            Keep It
                        </Button>
                        <Button variant="danger" size="sm" loading={isDeleting} onClick={handleDelete}>
                            Yes, Delete It
                        </Button>
                    </div>
                }
            >
                <p className="text-sm text-ink-soft">
                    This can't be undone.{' '}
                    {deleteTarget ? `"${deleteTarget.full_name}"` : 'This address'} will be removed from your
                    address book.
                </p>
            </Modal>
        </div>
    );
}