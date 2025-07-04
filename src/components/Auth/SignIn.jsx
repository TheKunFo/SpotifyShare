import { useState } from 'react';
import ModalFormInput from '../ModalFormInput/ModalFormInput';
import './SignIn.css';

export default function SignIn({
    isOpen,
    onClose,
    errors,
    setErrors,
    handleSubmit,
}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


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

        setErrors(prev => ({ ...prev, [fieldName]: error }));
    };

    const validateAll = () => {
        validateField('email', email);
        validateField('password', password);

        return (
            !errors.email && !errors.password
        );
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        validateField('email', value);
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        validateField('password', value);
    };



    return (
        <ModalFormInput
            isOpen={isOpen}
            onClose={onClose}
            title="Login"
            classForm="login__form"
            onSubmit={handleSubmit}
            classButton="login__button"
            titleButton="Login"
        >
            <div className="form__group">
                <label>Email</label>
                <input
                    type="text"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email"
                />
                {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="form__group">
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter your password"
                />
                {errors.password && <span className="error">{errors.password}</span>}
            </div>
        </ModalFormInput>
    );
}
