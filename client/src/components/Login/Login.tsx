import React, { useState } from 'react';
import styles from './Login.module.css';

interface FormProps {
    onLogin: (credentials: { email: string; password: string }) => void;
}

const Login: React.FC<FormProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Asegúrate de que email y password no sean cadenas vacías
        if (!email || !password) {
            alert('Please fill in both email and password.');
            return;
        }

        onLogin({ email, password }); // Pasa las credenciales al manejador
    };

    return (
        <div className={styles.loginContainer}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className={styles.submitButton}>
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;