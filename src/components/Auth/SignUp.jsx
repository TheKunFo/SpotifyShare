import { useState } from 'react';
import ModalFormInput from '../ModalFormInput/ModalFormInput';
import './SignUp.css';

export default function SignUp({
    isOpen,
    onClose,
    errors,
    setErrors,
    handleSubmit,
}) {
    const [form, setForm] = useState({
        email: '',
        password: '',
        name: '',
        avatar: ''
    });

    const validateField = (fieldName, value) => {
        let error = '';

        if (fieldName === 'email') {
            if (!value) {
                error = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(value)) {
                error = 'Invalid email format';
            }
        }

        if (fieldName === 'password') {
            if (!value) {
                error = 'Password is required';
            } else if (value.length < 6) {
                error = 'Password must be at least 6 characters';
            }
        }

        if (fieldName === 'name') {
            if (!value) {
                error = 'Name is required';
            }
        }

        if (fieldName === 'avatar') {
            if (!value) {
                error = 'Avatar URL is required';
            } else if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(value)) {
                error = 'Invalid image URL';
            }
        }

        setErrors(prev => ({ ...prev, [fieldName]: error }));
    };

    const validateAll = () => {
        const allFields = ['email', 'password', 'name', 'avatar'];
        allFields.forEach((field) => validateField(field, form[field]));
        return allFields.every((field) => !errors[field]);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    

    return (
        <ModalFormInput
            isOpen={isOpen}
            onClose={onClose}
            title="Sign Up"
            classForm="signup__form"
            classButton="signup__button"
            titleButton="Sign Up"
            onSubmit={handleSubmit}
        >
            <div className="form__group">
                <label>Name</label>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                />
                {errors.name && <span className="error">{errors.name}</span>}
            </div>

            <div className="form__group">
                <label>Email</label>
                <input
                    type="text"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                />
                {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="form__group">
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                />
                {errors.password && <span className="error">{errors.password}</span>}
            </div>

            <div className="form__group">
                <label>Avatar URL</label>
                <input
                    type="text"
                    name="avatar"
                    value={form.avatar}
                    onChange={handleChange}
                    placeholder="Enter avatar image URL"
                />
                {errors.avatar && <span className="error">{errors.avatar}</span>}
            </div>
        </ModalFormInput>
    );
}
