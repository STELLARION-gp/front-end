import React from 'react';
import type { InputHTMLAttributes } from 'react';
import styles from './InputField.module.scss';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    id: string;
    error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
    label,
    id,
    error,
    className,
    ...rest
}) => {
    return (
        <div className={styles['form-group']}>
            <label htmlFor={id} className={styles['form-group-label']}>
                {label}
            </label>
            <input
                id={id}
                className={[
                    styles['input-field'],
                    error ? styles['error'] : '',
                    className || ''
                ].join(' ').trim()}
                {...rest}
            />
            {error && <p className={styles['input-error']}>{error}</p>}
        </div>
    );
};

export default InputField;
