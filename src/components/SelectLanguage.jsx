
import React from 'react';
import Select from 'react-select';

const options = [
    { value: 'si', label: 'සිංහල (Sinhala)' },
    { value: 'ta', label: 'தமிழ் (Tamil)' },
    { value: 'en', label: 'English' },
];


import './SelectLanguage.scss';

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: '#18181b',
        borderColor: state.isFocused ? '#2563eb' : '#4b5563',
        color: '#fff',
        minHeight: '36px',
        height: '36px',
        boxShadow: state.isFocused ? '0 0 0 2px #2563eb33' : 'none',
        borderRadius: '0.375rem',
        fontSize: '1rem',
        paddingLeft: '0',
        paddingRight: '0',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
    }),
    singleValue: (provided) => ({
        ...provided,
        color: '#fff',
    }),
    input: (provided) => ({
        ...provided,
        color: '#fff',
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: '#18181b',
        color: '#fff',
        borderRadius: '0.375rem',
        fontSize: '1rem',
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#2563eb' : state.isFocused ? '#1e293b' : '#18181b',
        color: '#fff',
        cursor: 'pointer',
    }),
    placeholder: (provided) => ({
        ...provided,
        color: '#a1a1aa',
    }),
};

const SelectLanguage = ({ value, onChange, id = 'select-language' }) => {
    return (
        <Select
            inputId={id}
            options={options}
            value={options.find(opt => opt.value === value) || null}
            onChange={opt => onChange(opt ? opt.value : '')}
            isClearable={false}
            placeholder="Select language..."
            styles={customStyles}
            classNamePrefix="select-language"
            className="inputfield-like-select"
        />
    );
};

export default SelectLanguage;
