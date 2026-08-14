import api from './api';

/** Public "Contact Us" form submission — no auth required. */
export async function sendContactMessage({ name, email, phone, subject, message }) {
    const { data } = await api.post('/contact', { name, email, phone, subject, message });
    return data;
}

/**
 * Custom-order / quotation request (Part 4: "quotation/custom-order
 * system") — separate from the general contact form since it carries
 * different fields (garment type, measurements, reference images, etc.)
 * and flows into the admin's Quotations workflow.
 */
export async function submitQuotationRequest(payload) {
    const { data } = await api.post('/quotations', payload);
    return data;
}