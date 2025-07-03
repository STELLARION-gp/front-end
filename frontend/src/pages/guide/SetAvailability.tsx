import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import '../../styles/pages/guide/_setAvailability.scss';

// Icons
const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M12.5 15l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CalendarIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const ClockIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const UsersIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const PlusIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DeleteIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none">
    <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EditIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const SaveIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2"/>
    <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" strokeWidth="2"/>
    <polyline points="7,3 7,8 15,8" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

// Interfaces
interface Service {
  id: string;
  title: string;
  category: string;
  maxParticipants: number;
  duration: string;
  price: number;
}

interface AvailabilitySlot {
  id: string;
  serviceId: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  bookedCount: number;
  price?: number;
  isRecurring?: boolean;
  recurringPattern?: 'weekly' | 'monthly';
  recurringEndDate?: string;
  status: 'active' | 'inactive' | 'full';
  notes?: string;
}

// Dummy data for services (in real app, this would come from API)
const dummyServices: Service[] = [
  {
    id: '1',
    title: 'Deep Space Observation Experience',
    category: 'stargazing',
    maxParticipants: 8,
    duration: '3 hours',
    price: 75
  },
  {
    id: '2',
    title: 'Astrophotography Masterclass',
    category: 'astrophotography',
    maxParticipants: 6,
    duration: '6 hours',
    price: 150
  },
  {
    id: '3',
    title: 'Telescope Building Workshop',
    category: 'workshop',
    maxParticipants: 4,
    duration: '8 hours',
    price: 200
  }
];

const SetAvailability: React.FC = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId?: string }>();
  
  // State
  const [services] = useState<Service[]>(dummyServices);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<AvailabilitySlot | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Form data
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    capacity: 1,
    price: 0,
    isRecurring: false,
    recurringPattern: 'weekly' as 'weekly' | 'monthly',
    recurringEndDate: '',
    notes: ''
  });

  // Initialize with serviceId if provided and add some dummy availability data
  useEffect(() => {
    if (serviceId) {
      const service = services.find(s => s.id === serviceId);
      if (service) {
        setSelectedService(service);
        setFormData(prev => ({ ...prev, capacity: service.maxParticipants, price: service.price }));
      }
    }
    
    // Add some dummy availability data for demonstration
    const dummyAvailability: AvailabilitySlot[] = [
      {
        id: '1',
        serviceId: '1',
        date: '2025-07-05',
        startTime: '19:00',
        endTime: '22:00',
        capacity: 8,
        bookedCount: 3,
        price: 75,
        status: 'active',
        notes: 'Perfect viewing conditions expected'
      },
      {
        id: '2',
        serviceId: '1',
        date: '2025-07-12',
        startTime: '20:00',
        endTime: '23:00',
        capacity: 8,
        bookedCount: 8,
        price: 75,
        status: 'full'
      },
      {
        id: '3',
        serviceId: '2',
        date: '2025-07-08',
        startTime: '18:00',
        endTime: '00:00',
        capacity: 6,
        bookedCount: 2,
        price: 150,
        status: 'active',
        notes: 'Bring warm clothing'
      }
    ];
    
    setAvailabilitySlots(dummyAvailability);
  }, [serviceId, services]);

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isDateDisabled = (date: Date) => {
    return date < new Date(new Date().setHours(0, 0, 0, 0));
  };

  const hasAvailability = (date: string) => {
    return availabilitySlots.some(slot => 
      slot.date === date && 
      slot.serviceId === selectedService?.id
    );
  };

  // Form handlers
  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setFormData(prev => ({ 
      ...prev, 
      capacity: service.maxParticipants, 
      price: service.price 
    }));
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setFormData(prev => ({ ...prev, date }));
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    const newSlot: AvailabilitySlot = {
      id: editingSlot ? editingSlot.id : Date.now().toString(),
      serviceId: selectedService.id,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      capacity: formData.capacity,
      bookedCount: editingSlot ? editingSlot.bookedCount : 0,
      price: formData.price || selectedService.price,
      isRecurring: formData.isRecurring,
      recurringPattern: formData.recurringPattern,
      recurringEndDate: formData.recurringEndDate,
      status: 'active',
      notes: formData.notes
    };

    if (editingSlot) {
      setAvailabilitySlots(prev => prev.map(slot => 
        slot.id === editingSlot.id ? newSlot : slot
      ));
    } else {
      setAvailabilitySlots(prev => [...prev, newSlot]);
    }

    handleFormReset();
  };

  const handleFormReset = () => {
    setIsFormOpen(false);
    setEditingSlot(null);
    setSelectedDate('');
    setFormData({
      date: '',
      startTime: '',
      endTime: '',
      capacity: selectedService?.maxParticipants || 1,
      price: selectedService?.price || 0,
      isRecurring: false,
      recurringPattern: 'weekly',
      recurringEndDate: '',
      notes: ''
    });
  };

  const handleEditSlot = (slot: AvailabilitySlot) => {
    setEditingSlot(slot);
    setFormData({
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      capacity: slot.capacity,
      price: slot.price || selectedService?.price || 0,
      isRecurring: slot.isRecurring || false,
      recurringPattern: slot.recurringPattern || 'weekly',
      recurringEndDate: slot.recurringEndDate || '',
      notes: slot.notes || ''
    });
    setIsFormOpen(true);
  };

  const handleDeleteSlot = (slotId: string) => {
    setAvailabilitySlots(prev => prev.filter(slot => slot.id !== slotId));
  };

  // Calendar rendering
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Previous month's trailing days
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateString = formatDate(date);
      const isDisabled = isDateDisabled(date);
      const hasAvail = hasAvailability(dateString);
      const isSelected = selectedDate === dateString;

      days.push(
        <div
          key={day}
          className={`calendar-day ${isDisabled ? 'disabled' : ''} ${hasAvail ? 'has-availability' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => !isDisabled && selectedService && handleDateSelect(dateString)}
        >
          <span className="day-number">{day}</span>
          {hasAvail && <div className="availability-indicator"></div>}
        </div>
      );
    }

    return days;
  };

  // Get slots for selected service
  const serviceSlots = useMemo(() => {
    return selectedService
      ? availabilitySlots.filter(slot => slot.serviceId === selectedService.id)
        .sort((a, b) => new Date(a.date + ' ' + a.startTime).getTime() - new Date(b.date + ' ' + b.startTime).getTime())
      : [];
  }, [availabilitySlots, selectedService]);

  return (
    <div className="set-availability">
      <div className="set-availability-container">
        {/* Header */}
        <div className="set-availability__header">
          <div className="header-content">
            <div className="header-navigation">
              <Button
                variant="secondary"
                size="small"
                icon={<ArrowLeftIcon />}
                iconPosition="left"
                onClick={() => navigate('/dashboard/services')}
              >
                Back to Services
              </Button>
            </div>
            
            <div className="title-section">
              <h1 className="page-title">Set Availability</h1>
              <p className="page-subtitle">
                Manage your service schedules and availability calendar
              </p>
            </div>
          </div>
        </div>

        {/* Service Selection */}
        <Card className="service-selection" variant="elevated">
          <div className="section-header">
            <h2>Select Service</h2>
            <p>Choose a service to manage its availability</p>
          </div>
          
          <div className="services-grid">
            {services.map(service => (
              <Card
                key={service.id}
                className={`service-card ${selectedService?.id === service.id ? 'selected' : ''}`}
                variant="outlined"
                hover
                clickable
                onClick={() => handleServiceSelect(service)}
              >
                <div className="service-info">
                  <h3 className="service-title">{service.title}</h3>
                  <div className="service-details">
                    <span className="service-category">{service.category}</span>
                    <span className="service-duration">{service.duration}</span>
                    <span className="service-price">${service.price}</span>
                  </div>
                  <div className="service-capacity">
                    <UsersIcon className="capacity-icon" />
                    <span>Up to {service.maxParticipants} participants</span>
                  </div>
                </div>
                {selectedService?.id === service.id && (
                  <div className="selected-indicator">✓</div>
                )}
              </Card>
            ))}
          </div>
        </Card>

        {selectedService && (
          <>
            {/* Calendar and Form */}
            <div className="availability-management">
              <div className="calendar-section">
                <Card className="calendar-card" variant="elevated">
                  <div className="calendar-header">
                    <h3>
                      <CalendarIcon className="calendar-header-icon" />
                      Schedule Calendar
                    </h3>
                    <div className="calendar-navigation">
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                      >
                        ‹
                      </Button>
                      <span className="current-month">
                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </span>
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                      >
                        ›
                      </Button>
                    </div>
                  </div>

                  <div className="calendar">
                    <div className="calendar-weekdays">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="weekday">{day}</div>
                      ))}
                    </div>
                    <div className="calendar-days">
                      {renderCalendar()}
                    </div>
                  </div>

                  <div className="calendar-legend">
                    <div className="legend-item">
                      <div className="legend-indicator available"></div>
                      <span>Available dates</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-indicator disabled"></div>
                      <span>Past dates</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Availability Form */}
              {isFormOpen && (
                <Card className="availability-form-card" variant="elevated">
                  <div className="form-header">
                    <h3>
                      {editingSlot ? 'Edit' : 'Add'} Availability
                    </h3>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={handleFormReset}
                    >
                      Cancel
                    </Button>
                  </div>

                  <form onSubmit={handleFormSubmit} className="availability-form">
                    <div className="form-grid">
                      <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                          className="form-input"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="startTime">Start Time</label>
                        <input
                          id="startTime"
                          type="time"
                          value={formData.startTime}
                          onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                          className="form-input"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="endTime">End Time</label>
                        <input
                          id="endTime"
                          type="time"
                          value={formData.endTime}
                          onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                          className="form-input"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="capacity">Capacity</label>
                        <input
                          id="capacity"
                          type="number"
                          value={formData.capacity}
                          onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                          className="form-input"
                          min="1"
                          max={selectedService.maxParticipants}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="price">Price Override</label>
                        <input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                          className="form-input"
                          min="0"
                          step="0.01"
                          placeholder={`Default: $${selectedService.price}`}
                        />
                      </div>

                      <div className="form-group full-width">
                        <label htmlFor="notes">Notes (Optional)</label>
                        <textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                          className="form-textarea"
                          rows={3}
                          placeholder="Special instructions, requirements, etc."
                        />
                      </div>

                      <div className="form-group full-width">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={formData.isRecurring}
                            onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
                          />
                          <span>Recurring Availability</span>
                        </label>
                      </div>

                      {formData.isRecurring && (
                        <>
                          <div className="form-group">
                            <label htmlFor="recurringPattern">Repeat Every</label>
                            <select
                              id="recurringPattern"
                              value={formData.recurringPattern}
                              onChange={(e) => setFormData(prev => ({ ...prev, recurringPattern: e.target.value as 'weekly' | 'monthly' }))}
                              className="form-select"
                            >
                              <option value="weekly">Week</option>
                              <option value="monthly">Month</option>
                            </select>
                          </div>

                          <div className="form-group">
                            <label htmlFor="recurringEndDate">End Date</label>
                            <input
                              id="recurringEndDate"
                              type="date"
                              value={formData.recurringEndDate}
                              onChange={(e) => setFormData(prev => ({ ...prev, recurringEndDate: e.target.value }))}
                              className="form-input"
                              min={formData.date}
                            />
                          </div>
                        </>
                      )}
                    </div>

                    <div className="form-actions">
                      <Button
                        type="submit"
                        variant="primary"
                        icon={<SaveIcon />}
                        iconPosition="left"
                      >
                        {editingSlot ? 'Update' : 'Add'} Availability
                      </Button>
                    </div>
                  </form>
                </Card>
              )}
            </div>

            {/* Availability List */}
            <Card className="availability-list-card" variant="elevated">
              <div className="list-header">
                <h3>Current Availability</h3>
                <div className="list-actions">
                  <Button
                    variant="primary"
                    size="small"
                    icon={<PlusIcon />}
                    iconPosition="left"
                    onClick={() => setIsFormOpen(true)}
                  >
                    Add New Slot
                  </Button>
                </div>
              </div>

              {serviceSlots.length === 0 ? (
                <div className="empty-state">
                  <CalendarIcon className="empty-icon" />
                  <h4>No availability set</h4>
                  <p>Click on a date in the calendar or use the "Add New Slot" button to create your first availability slot.</p>
                </div>
              ) : (
                <div className="availability-table">
                  <div className="table-header">
                    <div className="header-cell">Date & Time</div>
                    <div className="header-cell">Capacity</div>
                    <div className="header-cell">Price</div>
                    <div className="header-cell">Status</div>
                    <div className="header-cell">Actions</div>
                  </div>
                  
                  <div className="table-body">
                    {serviceSlots.map(slot => (
                      <div key={slot.id} className="table-row">
                        <div className="table-cell date-time">
                          <div className="date-time-content">
                            <div className="date">
                              <CalendarIcon className="date-icon" />
                              {new Date(slot.date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                            <div className="time">
                              <ClockIcon className="time-icon" />
                              {slot.startTime} - {slot.endTime}
                            </div>
                          </div>
                        </div>
                        
                        <div className="table-cell capacity">
                          <div className="capacity-content">
                            <UsersIcon className="capacity-icon" />
                            <span>{slot.bookedCount}/{slot.capacity}</span>
                          </div>
                        </div>
                        
                        <div className="table-cell price">
                          ${slot.price || selectedService.price}
                        </div>
                        
                        <div className="table-cell status">
                          <span className={`status-badge ${slot.status}`}>
                            {slot.status === 'active' ? 'Available' : 
                             slot.status === 'full' ? 'Full' : 'Inactive'}
                          </span>
                        </div>
                        
                        <div className="table-cell actions">
                          <div className="action-buttons">
                            <Button
                              variant="secondary"
                              size="small"
                              icon={<EditIcon />}
                              onClick={() => handleEditSlot(slot)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              size="small"
                              icon={<DeleteIcon />}
                              onClick={() => handleDeleteSlot(slot.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default SetAvailability;
