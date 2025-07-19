import React, { useState } from 'react';
import '../../styles/components/admin/ModeratorFormStepper.scss';
import Button from '../Button';
import InputField from '../InputField';

interface Moderator {
  name: string;
  email: string;
  section: string;
  status: 'Active' | 'Inactive';
  contact: string;
}

interface StepperProps {
  onClose: () => void;
  onSubmit: (mod: Moderator) => void;
}

const sections = ['Astronomy', 'Physics', 'Events', 'Blog', 'Community'];
const roles = ['Active', 'Inactive'];

const ModeratorFormStepper: React.FC<StepperProps> = ({ onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    email: '',
    contact: '',
    section: '',
    status: 'Active',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = () => {
    onSubmit(form as Moderator);
    console.log(`Credentials sent to ${form.email}`);
    setForm({ name: '', email: '', contact: '', section: '', status: 'Active' });
    setStep(1);
    onClose();
  };

  return (
    <div className="moderator-form-stepper">
      <div className="stepper-header">Create Moderator</div>
      <div className="stepper-body">
        {step === 1 && (
          <div className="step step-1">
            <InputField
              label="Full Name"
              id="moderator-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />
            <InputField
              label="Email"
              id="moderator-email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
              type="email"
              required
            />
            <InputField
              label="Contact No"
              id="moderator-contact"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              placeholder="Enter contact number"
              required
            />
            <Button onClick={handleNext} disabled={!form.name || !form.email || !form.contact}>Next</Button>
          </div>
        )}
        {step === 2 && (
          <div className="step step-2">
            <label>Assign Section</label>
            <select name="section" value={form.section} onChange={handleChange}>
              <option value="">Select section</option>
              {sections.map(sec => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <div className="stepper-actions">
              <Button variant='secondary' onClick={handleBack}>Back</Button>
              <Button variant='secondary' onClick={handleNext} disabled={!form.section}>Next</Button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="step step-3">
            <div className="review-summary">
              <h3>Review Details</h3>
              <div className="review-row" style={{justifyContent: 'flex-end', marginBottom: '1.1rem'}}>
                <span className="review-label" role="img" aria-label="user">👤 Name:</span>
                <span className="review-value" style={{marginLeft: 'auto', textAlign: 'right', minWidth: 180}}>{form.name || <span style={{color:'#64748b'}}>Not provided</span>}</span>
              </div>
              <div className="review-row" style={{justifyContent: 'flex-end', marginBottom: '1.1rem'}}>
                <span className="review-label" role="img" aria-label="email">✉️ Email:</span>
                <span className="review-value" style={{marginLeft: 'auto', textAlign: 'right', minWidth: 180}}>{form.email || <span style={{color:'#64748b'}}>Not provided</span>}</span>
              </div>
              <div className="review-row" style={{justifyContent: 'flex-end', marginBottom: '1.1rem'}}>
                <span className="review-label" role="img" aria-label="phone">📞 Contact:</span>
                <span className="review-value" style={{marginLeft: 'auto', textAlign: 'right', minWidth: 180}}>{form.contact || <span style={{color:'#64748b'}}>Not provided</span>}</span>
              </div>
              <div className="review-row" style={{justifyContent: 'flex-end', marginBottom: '1.1rem'}}>
                <span className="review-label" role="img" aria-label="section">📚 Section:</span>
                <span className="review-value" style={{marginLeft: 'auto', textAlign: 'right', minWidth: 180}}>{form.section || <span style={{color:'#64748b'}}>Not selected</span>}</span>
              </div>
              <div className="review-row" style={{justifyContent: 'flex-end', marginBottom: '1.1rem'}}>
                <span className="review-label" role="img" aria-label="status">🔵 Status:</span>
                <span className="review-value" style={{marginLeft: 'auto', textAlign: 'right', minWidth: 180, color: form.status === 'Active' ? '#22c55e' : '#ef4444', fontWeight:600}}>{form.status}</span>
              </div>
            </div>
            <div className="stepper-actions">
              <Button onClick={handleBack}>Back</Button>
              <Button onClick={handleSubmit}>Confirm & Submit</Button>
            </div>
          </div>
        )}
      </div>
      <button className="close-btn" onClick={onClose}>×</button>
    </div>
  );
};

export default ModeratorFormStepper;
