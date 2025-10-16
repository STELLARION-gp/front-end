import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import '../../styles/pages/guide/_setAvailability.scss';
import type {
  Service as ApiService,
  ServiceAvailability as ApiAvailability,
  CreateAvailabilityRequest
} from '../../services/servicesService';
import {
  getMyServices,
  getServiceAvailability,
  createAvailability,
  createBulkAvailability,
  updateAvailability,
  deleteAvailability
} from '../../services/servicesService';

// Icons
const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M12.5 15l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowRightIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M7.5 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

// Interfaces - extending API types
interface Service extends Omit<ApiService, 'id' | 'media' | 'availability'> {
  id: string; // Convert to string for UI compatibility
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
  created_at?: string | Date;
  updated_at?: string | Date;
  slots_booked?: number;
}

// Transform API service to local format
const transformApiService = (apiService: ApiService): Service => {
  return {
    ...apiService,
    id: apiService.id.toString()
  };
};

// Transform API availability to local format
const transformApiAvailability = (apiAvail: ApiAvailability): AvailabilitySlot => {
  // Extract time from DateTime string (e.g., "2025-07-05T19:00:00.000Z" -> "19:00")
  const extractTime = (dateTimeStr: string): string => {
    if (!dateTimeStr) return '';
    try {
      const date = new Date(dateTimeStr);
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch (err) {
      console.error('Error extracting time:', err);
      return dateTimeStr; // Return original if parsing fails
    }
  };

  return {
    id: apiAvail.id.toString(),
    serviceId: apiAvail.service_id.toString(),
    date: typeof apiAvail.available_date === 'string' ? apiAvail.available_date.split('T')[0] : new Date(apiAvail.available_date).toISOString().split('T')[0],
    startTime: extractTime(apiAvail.start_time),
    endTime: extractTime(apiAvail.end_time),
    capacity: apiAvail.slots_available,
    bookedCount: apiAvail.slots_booked || 0,
    status: apiAvail.status === 'available' ? 'active' : (apiAvail.slots_booked >= apiAvail.slots_available ? 'full' : 'inactive'),
    created_at: apiAvail.created_at,
    updated_at: apiAvail.updated_at,
    slots_booked: apiAvail.slots_booked
  };
};

const SetAvailability: React.FC = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId?: string }>();
  
  // State
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<AvailabilitySlot | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
    notes: '',
    // New fields for date series
    isDateSeries: false,
    seriesStartDate: '',
    seriesEndDate: '',
    seriesDays: [] as string[] // ['monday', 'tuesday', etc.]
  });

  // Fetch services and availability on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch services
        const servicesResponse = await getMyServices({});
        const transformedServices = servicesResponse.services.map(transformApiService);
        setServices(transformedServices);
        
        // If serviceId is provided, select and fetch availability for that service
        if (serviceId) {
          const service = transformedServices.find(s => s.id === serviceId);
          if (service) {
            setSelectedService(service);
            setFormData(prev => ({ ...prev, capacity: service.max_participants, price: service.price }));
            
            // Fetch availability for the service
            const availResponse = await getServiceAvailability(parseInt(serviceId), {});
            console.log('Initial availability fetch:', availResponse); // Debug log
            const transformedAvailability = availResponse.map(transformApiAvailability);
            setAvailabilitySlots(transformedAvailability);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [serviceId]);

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Format a Date object to 'YYYY-MM-DD' in local time to avoid timezone offsets
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Convert time string (HH:MM) to ISO DateTime string for the given date
  const timeToDateTime = (date: string, time: string): string => {
    // Combine date and time into ISO format
    return `${date}T${time}:00.000Z`;
  };

  // Generate half-hourly time options for select inputs
  const generateTimeOptions = (): string[] => {
    const times: string[] = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = String(h).padStart(2, '0');
        const minute = String(m).padStart(2, '0');
        times.push(`${hour}:${minute}`);
      }
    }
    return times;
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
  // Handle service selection
  const handleServiceSelect = (service: Service) => {
    // Select a new service and reset form state
    setSelectedService(service);
    setFormData(prev => ({ 
      ...prev, 
      capacity: service.max_participants, 
      price: service.price 
    }));
    // Close any open form when changing service
    setIsFormOpen(false);
    setEditingSlot(null);
    setSelectedDate('');
    
    // Fetch availability for the new service
    fetchServiceAvailability(service.id);
  };

  // Fetch availability for a specific service
  const fetchServiceAvailability = async (svcId: string) => {
    try {
      setLoading(true);
      // Fetch all availability slots for the service (no date filter to see all)
      const availResponse = await getServiceAvailability(parseInt(svcId), {});
      console.log('Fetched availability:', availResponse); // Debug log
      const transformedAvailability = availResponse.map(transformApiAvailability);
      console.log('Transformed availability:', transformedAvailability); // Debug log
      setAvailabilitySlots(transformedAvailability);
    } catch (err) {
      console.error('Error fetching availability:', err);
      setError(err instanceof Error ? err.message : 'Failed to load availability');
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setFormData(prev => ({ ...prev, date }));
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    // Validation for date series
    if (formData.isDateSeries) {
      if (!formData.seriesStartDate || !formData.seriesEndDate) {
        alert('Please select both start and end dates for the date series.');
        return;
      }
      if (new Date(formData.seriesStartDate) > new Date(formData.seriesEndDate)) {
        alert('End date must be after or equal to start date.');
        return;
      }
    } else if (!formData.date) {
      alert('Please select a date.');
      return;
    }

    // Validation for time
    if (!formData.startTime || !formData.endTime) {
      alert('Please select both start and end times.');
      return;
    }
    if (formData.startTime >= formData.endTime) {
      alert('End time must be after start time.');
      return;
    }

    try {
      setLoading(true);

      if (editingSlot) {
        // Handle editing existing slot
        const updated = await updateAvailability(parseInt(editingSlot.id), {
          date: formData.date,
          start_time: timeToDateTime(formData.date, formData.startTime),
          end_time: timeToDateTime(formData.date, formData.endTime),
          slots_available: formData.capacity
        });
        
        const transformedUpdated = transformApiAvailability(updated);
        setAvailabilitySlots(prev => prev.map(slot => 
          slot.id === editingSlot.id ? transformedUpdated : slot
        ));
        
        alert('Availability updated successfully!');
      } else {
        // Handle creating new slot(s)
        if (formData.isDateSeries) {
          // Generate multiple slots for date series
          const slotsToCreate = generateDateSeriesSlots();
          const requestsData: CreateAvailabilityRequest[] = slotsToCreate.map(slot => ({
            service_id: parseInt(selectedService.id),
            date: slot.date,
            start_time: timeToDateTime(slot.date, slot.startTime),
            end_time: timeToDateTime(slot.date, slot.endTime),
            slots_available: slot.capacity
          }));
          
          const createdSlots = await createBulkAvailability(requestsData);
          const transformedCreated = createdSlots.map(transformApiAvailability);
          setAvailabilitySlots(prev => [...prev, ...transformedCreated]);
          
          alert(`Created ${createdSlots.length} availability slots successfully!`);
        } else {
          // Single slot creation
          const created = await createAvailability({
            service_id: parseInt(selectedService.id),
            date: formData.date,
            start_time: timeToDateTime(formData.date, formData.startTime),
            end_time: timeToDateTime(formData.date, formData.endTime),
            slots_available: formData.capacity
          });
          
          const transformedCreated = transformApiAvailability(created);
          setAvailabilitySlots(prev => [...prev, transformedCreated]);
          
          alert('Availability created successfully!');
        }
      }

      handleFormReset();
    } catch (err) {
      console.error('Error saving availability:', err);
      alert(`Failed to save availability: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Generate slots for date series (returns local format, not saved to API yet)
  const generateDateSeriesSlots = (): AvailabilitySlot[] => {
    if (!selectedService || !formData.seriesStartDate || !formData.seriesEndDate) return [];

    const slots: AvailabilitySlot[] = [];
    const startDate = new Date(formData.seriesStartDate);
    const endDate = new Date(formData.seriesEndDate);
    const selectedDays = formData.seriesDays;

    // If no specific days selected, use all days
    const daysToInclude = selectedDays.length > 0 ? selectedDays : 
      ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    const currentDate = new Date(startDate);
    let slotId = Date.now();

    while (currentDate <= endDate) {
      const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][currentDate.getDay()];
      
      if (daysToInclude.includes(dayName)) {
        const slot: AvailabilitySlot = {
          id: (slotId++).toString(),
          serviceId: selectedService.id,
          date: formatDate(currentDate),
          startTime: formData.startTime,
          endTime: formData.endTime,
          capacity: formData.capacity,
          bookedCount: 0,
          price: formData.price || selectedService.price,
          status: 'active',
          notes: formData.notes,
          created_at: new Date(),
          updated_at: new Date(),
          slots_booked: 0
        };
        slots.push(slot);
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return slots;
  };

  const handleFormReset = () => {
    setIsFormOpen(false);
    setEditingSlot(null);
    setSelectedDate('');
    setFormData({
      date: '',
      startTime: '',
      endTime: '',
      capacity: selectedService?.max_participants || 1,
      price: selectedService?.price || 0,
      isRecurring: false,
      recurringPattern: 'weekly',
      recurringEndDate: '',
      notes: '',
      isDateSeries: false,
      seriesStartDate: '',
      seriesEndDate: '',
      seriesDays: []
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
      notes: slot.notes || '',
      isDateSeries: false,
      seriesStartDate: '',
      seriesEndDate: '',
      seriesDays: []
    });
    setIsFormOpen(true);
  };

  const handleDeleteSlot = async (slotId: string) => {
    if (!confirm('Are you sure you want to delete this availability slot?')) {
      return;
    }
    
    try {
      setLoading(true);
      await deleteAvailability(parseInt(slotId));
      setAvailabilitySlots(prev => prev.filter(slot => slot.id !== slotId));
      alert('Availability deleted successfully!');
    } catch (err) {
      console.error('Error deleting availability:', err);
      alert(`Failed to delete availability: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle day selection for date series
  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      seriesDays: prev.seriesDays.includes(day)
        ? prev.seriesDays.filter(d => d !== day)
        : [...prev.seriesDays, day]
    }));
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
    const slots = selectedService
      ? availabilitySlots.filter(slot => slot.serviceId === selectedService.id)
        .sort((a, b) => new Date(a.date + ' ' + a.startTime).getTime() - new Date(b.date + ' ' + b.startTime).getTime())
      : [];
    
    console.log('Service slots for display:', {
      selectedServiceId: selectedService?.id,
      totalAvailabilitySlots: availabilitySlots.length,
      filteredSlots: slots.length,
      slots
    });
    
    return slots;
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
                size="medium"
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

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading services and availability...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="error-state">
            <h3>Error Loading Data</h3>
            <p>{error}</p>
            <Button variant="primary" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        )}

        {/* Service Selection */}
        {!loading && !error && (
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
                    <span>Up to {service.max_participants} participants</span>
                  </div>
                </div>
                {selectedService?.id === service.id && (
                  <div className="selected-indicator">✓</div>
                )}
              </Card>
            ))}
          </div>
        </Card>
        )}

        {!loading && !error && selectedService && (
          <>
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

            {/* Calendar and Form */}
            <div className="availability-management">
              {isFormOpen && (
                <>
                  <Card className="calendar-card" variant="elevated">
                    {/* Calendar Section */}
                    <div className="calendar-section">
                      <div className="calendar-header">
                        <h3>Availability Calendar</h3>
                        <div className="calendar-navigation">
                          <Button
                            variant="secondary"
                            size="small"
                            icon={<ArrowLeftIcon />}
                            onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
                          >
                            ‹
                          </Button>
                          <span className="current-month">
                            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </span>
                          <Button
                            variant="secondary"
                            size="small"
                            icon={<ArrowRightIcon />}
                            onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
                          >
                            ›
                          </Button>
                        </div>
                      </div>
                      
                      {/* Calendar Grid */}
                      <div className="calendar">
                        <div className="calendar-weekdays">
                          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day => <div key={day} className="weekday">{day}</div>)}
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
                    </div>
                  </Card>

                  <Card className="availability-form-card" variant="elevated">
                    {/* Availability Form */}
                    <form onSubmit={handleFormSubmit} className="availability-form">
                      {/* Availability Form Fields */}
                      <div className="form-grid">
                        {!formData.isDateSeries && (
                          <div className="form-group">
                            <label htmlFor="date">Date</label>
                            <input
                              id="date"
                              type="date"
                              value={formData.date}
                              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                              className="form-input"
                              required={!formData.isDateSeries}
                            />
                          </div>
                        )}

                        <div className="form-group">
                          <label htmlFor="startTime">Start Time</label>
                          <select
                            id="startTime"
                            value={formData.startTime}
                            onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                            className="form-select"
                            required
                          >
                            <option value="">Select start time</option>
                            {generateTimeOptions().map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group">
                          <label htmlFor="endTime">End Time</label>
                          <select
                            id="endTime"
                            value={formData.endTime}
                            onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                            className="form-select"
                            required
                          >
                            <option value="">Select end time</option>
                            {generateTimeOptions().map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
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
                            max={selectedService.max_participants}
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
                              onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked, isDateSeries: false }))}
                              disabled={formData.isDateSeries}
                            />
                            <span>Recurring Availability</span>
                          </label>
                        </div>

                        <div className="form-group full-width">
                          <label className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={formData.isDateSeries}
                              onChange={(e) => setFormData(prev => ({ ...prev, isDateSeries: e.target.checked, isRecurring: false }))}
                              disabled={formData.isRecurring}
                            />
                            <span>Create Multiple Sessions (Date Range)</span>
                          </label>
                          <p className="form-help-text">
                            Create multiple availability slots across a date range with the same time and settings.
                          </p>
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

                        {formData.isDateSeries && (
                          <>
                            <div className="form-group">
                              <label htmlFor="seriesStartDate">Start Date</label>
                              <input
                                id="seriesStartDate"
                                type="date"
                                value={formData.seriesStartDate}
                                onChange={(e) => setFormData(prev => ({ ...prev, seriesStartDate: e.target.value }))}
                                className="form-input"
                                min={new Date().toISOString().split('T')[0]}
                                required
                              />
                            </div>

                            <div className="form-group">
                              <label htmlFor="seriesEndDate">End Date</label>
                              <input
                                id="seriesEndDate"
                                type="date"
                                value={formData.seriesEndDate}
                                onChange={(e) => setFormData(prev => ({ ...prev, seriesEndDate: e.target.value }))}
                                className="form-input"
                                min={formData.seriesStartDate || new Date().toISOString().split('T')[0]}
                                required
                              />
                            </div>

                            <div className="form-group full-width">
                              <label>Days of the Week (Optional - leave blank for all days)</label>
                              <div className="days-selector">
                                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                                  <label key={day} className="day-checkbox">
                                    <input
                                      type="checkbox"
                                      checked={formData.seriesDays.includes(day)}
                                      onChange={() => handleDayToggle(day)}
                                    />
                                    <span className="day-label">
                                      {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                                    </span>
                                  </label>
                                ))}
                              </div>
                              <p className="form-help-text">
                                Select specific days or leave blank to include all days in the date range.
                              </p>
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
                          {editingSlot ? 'Update' : 
                           formData.isDateSeries ? 'Create Sessions' : 
                           'Add'} Availability
                        </Button>
                      </div>
                    </form>
                  </Card>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SetAvailability;
