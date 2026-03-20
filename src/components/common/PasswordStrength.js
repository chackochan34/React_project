import React, { useMemo } from 'react';
import { calculatePasswordStrength } from '../../utils/passwordStrength';
import './PasswordStrength.css';

export const PasswordStrength = ({ password }) => {
    const strength = useMemo(() => calculatePasswordStrength(password), [password]);

    if (!password) {
        return null;
    }

    return (
        <div className="password-strength-container">
            <div className="password-strength-bars">
                {[1, 2, 3, 4, 5].map((index) => (
                    <div
                        key={index}
                        className={`strength-bar ${index <= strength.score ? 'active' : ''}`}
                        style={{
                            backgroundColor: index <= strength.score ? strength.color : 'var(--glass-border, rgba(255, 255, 255, 0.1))',
                            boxShadow: index <= strength.score ? `0 0 8px ${strength.color}80` : 'none'
                        }}
                    />
                ))}
            </div>
            <p className="password-strength-label" style={{ color: strength.color }}>
                {strength.label}
            </p>
        </div>
    );
};
