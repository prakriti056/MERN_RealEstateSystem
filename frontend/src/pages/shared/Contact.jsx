import React, { useState } from "react";
import { contactStyles as s } from "../../assets/dummyStyles";
import axios from "axios";
import API_URL from "../../config";
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineChatAlt2 } from "react-icons/hi";
import Navbar from "../../components/common/Navbar";

const Contact = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        role: "buyer",
        message: "",
    });
    const [status, setStatus] = useState({ loading: false, success: false, error: null });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, success: false, error: null });
        try {
            const res = await axios.post(`${API_URL}/api/contact`, form);
            if (res.data.success) {
                setStatus({ loading: false, success: true, error: null });
                setForm({ name: "", email: "", phone: "", role: "buyer", message: "" });
            }
        } catch (err) {
            setStatus({
                loading: false,
                success: false,
                error: err.response?.data?.message || "Failed to send message. Please try again.",
            });
        }
    };

    return (
        <>
        <Navbar />
        <div className={s.container}>
            <div className={s.mainContainer}>
                {/* Header */}
                <div className={s.header}>
                    <h1 className={s.heading}>Get In Touch</h1>
                    <p className={s.subheading}>
                        Have a question, feedback, or need assistance? We&apos;d love to hear from you.
                    </p>
                </div>

                <div className={s.grid}>
                    {/* Contact Info Sidebar */}
                    <div className={s.contactInfoContainer}>
                        <div className={s.contactInfoCard}>
                            <div className={`${s.contactItem} ${s.contactItemMarginBottom}`}>
                                <div className={s.contactIconWrapper}>
                                    <HiOutlineMail size={20} />
                                </div>
                                <div>
                                    <div className={s.contactTitle}>Email</div>
                                    <div className={s.contactDetail}>support@realestate.com</div>
                                </div>
                            </div>
                            <div className={`${s.contactItem} ${s.contactItemMarginBottom}`}>
                                <div className={s.contactIconWrapperAlt}>
                                    <HiOutlinePhone size={20} />
                                </div>
                                <div>
                                    <div className={s.contactTitle}>Phone</div>
                                    <div className={s.contactDetail}>+1 (555) 123-4567</div>
                                </div>
                            </div>
                            <div className={s.contactItem}>
                                <div className={s.contactIconWrapper}>
                                    <HiOutlineLocationMarker size={20} />
                                </div>
                                <div>
                                    <div className={s.contactTitle}>Office</div>
                                    <div className={s.contactDetail}>123 Business Ave, Suite 100, NY 10001</div>
                                </div>
                            </div>
                        </div>

                        <div className={s.quickSupportCard}>
                            <HiOutlineChatAlt2 size={32} />
                            <div className={s.quickSupportTitle}>Quick Support</div>
                            <div className={s.quickSupportText}>
                                Our team typically responds within 24 hours on business days.
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className={s.formCard}>
                        {status.success ? (
                            <div className={s.successContainer}>
                                <div className={s.successIcon}>
                                    <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className={s.successTitle}>Message Sent!</h2>
                                <p className={s.successMessage}>
                                    Thank you for reaching out. We&apos;ll get back to you as soon as possible.
                                </p>
                                <button
                                    className={s.successButton}
                                    onClick={() => setStatus({ loading: false, success: false, error: null })}
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form className={s.form} onSubmit={handleSubmit}>
                                {status.error && (
                                    <div className={s.errorMessage}>{status.error}</div>
                                )}

                                <div className={s.formTwoColGrid}>
                                    <div className={s.inputGroup}>
                                        <label className={s.label}>Full Name *</label>
                                        <input
                                            className={s.input}
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    <div className={s.inputGroup}>
                                        <label className={s.label}>Email *</label>
                                        <input
                                            className={s.input}
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="john@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className={s.formTwoColGrid}>
                                    <div className={s.inputGroup}>
                                        <label className={s.label}>Phone</label>
                                        <input
                                            className={s.input}
                                            type="tel"
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                    <div className={s.inputGroup}>
                                        <label className={s.label}>I am a *</label>
                                        <select
                                            className={s.input}
                                            name="role"
                                            value={form.role}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="buyer">Buyer</option>
                                            <option value="seller">Seller</option>
                                        </select>
                                    </div>
                                </div>

                                <div className={s.inputGroup}>
                                    <label className={s.label}>Message *</label>
                                    <textarea
                                        className={`${s.input} ${s.textarea}`}
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        placeholder="Tell us how we can help..."
                                        rows={5}
                                        required
                                    />
                                </div>

                                <button
                                    className={s.submitButton}
                                    type="submit"
                                    disabled={status.loading}
                                >
                                    {status.loading ? (
                                        <span className="flex items-center gap-2 justify-center">
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Sending...
                                        </span>
                                    ) : (
                                        "Send Message"
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default Contact;
