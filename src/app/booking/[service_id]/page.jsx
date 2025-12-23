'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { divisions, districts, cities, areas } from '@/data/locations';
import LoadingSpinner from '@/components/LoadingSpinner';
import Toast from '@/components/Toast';

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [step, setStep] = useState(1);
  
  const [bookingData, setBookingData] = useState({
    duration: 1,
    durationType: 'hours', 
    division: '',
    district: '',
    city: '',
    area: '',
    fullAddress: '',
    specialInstructions: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user) {
      router.push(`/login?redirect=/booking/${params.service_id}`);
    }
  }, [user, router, params.service_id]);

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      
      const mockServices = {
        1: { id: 1, title: 'Baby Sitting', price: 500, unit: 'hour', icon: '👶' },
        2: { id: 2, title: 'Elderly Care', price: 600, unit: 'hour', icon: '👴' },
        3: { id: 3, title: 'Sick People Care', price: 700, unit: 'hour', icon: '🏥' }
      };

      setTimeout(() => {
        setService(mockServices[params.service_id] || null);
        setLoading(false);
      }, 500);
    };

    if (user) {
      fetchService();
    }
  }, [params.service_id, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'division') {
      setBookingData(prev => ({ ...prev, district: '', city: '', area: '' }));
    } else if (name === 'district') {
      setBookingData(prev => ({ ...prev, city: '', area: '' }));
    } else if (name === 'city') {
      setBookingData(prev => ({ ...prev, area: '' }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const calculateTotal = () => {
    if (!service) return 0;
    const multiplier = bookingData.durationType === 'days' ? 24 : 1;
    return service.price * bookingData.duration * multiplier;
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (bookingData.duration < 1) {
      newErrors.duration = 'Duration must be at least 1';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!bookingData.division) newErrors.division = 'Division is required';
    if (!bookingData.district) newErrors.district = 'District is required';
    if (!bookingData.city) newErrors.city = 'City is required';
    if (!bookingData.area) newErrors.area = 'Area is required';
    if (!bookingData.fullAddress.trim()) newErrors.fullAddress = 'Full address is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    // Prepare booking data
    const booking = {
      userId: user.uid,
      userEmail: user.email,
      userName: user.displayName,
      serviceId: service.id,
      serviceName: service.title,
      duration: bookingData.duration,
      durationType: bookingData.durationType,
      location: {
        division: bookingData.division,
        district: bookingData.district,
        city: bookingData.city,
        area: bookingData.area,
        fullAddress: bookingData.fullAddress
      },
      specialInstructions: bookingData.specialInstructions,
      totalCost: calculateTotal(),
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Booking created:', booking);
      
      setToast({ message: 'Booking created successfully!', type: 'success' });
      
      setTimeout(() => {
        router.push('/my-bookings');
      }, 2000);
    } catch (error) {
      console.error('Booking error:', error);
      setToast({ message: 'Failed to create booking. Please try again.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h2>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      
      <div className="container mx-auto px-4 max-w-4xl">
        
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{service.icon}</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Book {service.title}</h1>
          <p className="text-gray-600">Complete the steps below to confirm your booking</p>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  step >= s ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`w-16 h-1 mx-2 ${step > s ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 px-8">
            <span className={`text-sm font-medium ${step >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>Duration</span>
            <span className={`text-sm font-medium ${step >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>Location</span>
            <span className={`text-sm font-medium ${step >= 3 ? 'text-blue-600' : 'text-gray-500'}`}>Confirm</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Duration</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration Type
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setBookingData(prev => ({ ...prev, durationType: 'hours' }))}
                      className={`p-4 border-2 rounded-lg font-medium transition-all ${
                        bookingData.durationType === 'hours'
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      Hours
                    </button>
                    <button
                      onClick={() => setBookingData(prev => ({ ...prev, durationType: 'days' }))}
                      className={`p-4 border-2 rounded-lg font-medium transition-all ${
                        bookingData.durationType === 'days'
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      Days
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of {bookingData.durationType === 'hours' ? 'Hours' : 'Days'}
                  </label>
                  <input
                    type="number"
                    name="duration"
                    min="1"
                    value={bookingData.duration}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.duration ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.duration && (
                    <p className="mt-1 text-sm text-red-500">{errors.duration}</p>
                  )}
                </div>

                {/* Cost Preview */}
                <div className="p-6 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Service Rate:</span>
                    <span className="font-semibold">৳{service.price} / hour</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold">
                      {bookingData.duration} {bookingData.durationType}
                      {bookingData.durationType === 'days' && ` (${bookingData.duration * 24} hours)`}
                    </span>
                  </div>
                  <div className="border-t border-blue-200 my-3"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total Cost:</span>
                    <span className="text-2xl font-bold text-blue-600">৳{calculateTotal()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Location - Will continue in next artifact */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Location</h2>
              
              <div className="space-y-5">
                {/* Division */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Division *</label>
                  <select
                    name="division"
                    value={bookingData.division}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.division ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Division</option>
                    {divisions.map(div => (
                      <option key={div} value={div}>{div}</option>
                    ))}
                  </select>
                  {errors.division && <p className="mt-1 text-sm text-red-500">{errors.division}</p>}
                </div>

                {/* District */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">District *</label>
                  <select
                    name="district"
                    value={bookingData.district}
                    onChange={handleChange}
                    disabled={!bookingData.division}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 ${
                      errors.district ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select District</option>
                    {bookingData.division && districts[bookingData.division]?.map(dist => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                  {errors.district && <p className="mt-1 text-sm text-red-500">{errors.district}</p>}
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City / Upazila *</label>
                  <select
                    name="city"
                    value={bookingData.city}
                    onChange={handleChange}
                    disabled={!bookingData.district}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select City</option>
                    {bookingData.district && cities[bookingData.district]?.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                </div>

                {/* Area */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Area *</label>
                  <select
                    name="area"
                    value={bookingData.area}
                    onChange={handleChange}
                    disabled={!bookingData.city}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 ${
                      errors.area ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Area</option>
                    {bookingData.city && areas[bookingData.city]?.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                  {errors.area && <p className="mt-1 text-sm text-red-500">{errors.area}</p>}
                </div>

                {/* Full Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Address *</label>
                  <textarea
                    name="fullAddress"
                    value={bookingData.fullAddress}
                    onChange={handleChange}
                    rows="3"
                    placeholder="House/Flat number, Road, Block, etc."
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.fullAddress ? 'border-red-500' : 'border-gray-300'
                    }`}
                  ></textarea>
                  {errors.fullAddress && <p className="mt-1 text-sm text-red-500">{errors.fullAddress}</p>}
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions (Optional)</label>
                  <textarea
                    name="specialInstructions"
                    value={bookingData.specialInstructions}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Any specific requirements or notes for the caregiver..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirmation - Will continue in next part */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Confirm Booking</h2>
              
              <div className="space-y-6">
                {/* Service Summary */}
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-4">Service Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service:</span>
                      <span className="font-medium">{service.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{bookingData.duration} {bookingData.durationType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rate:</span>
                      <span className="font-medium">৳{service.price} / hour</span>
                    </div>
                  </div>
                </div>

                {/* Location Summary */}
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-4">Service Location</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {bookingData.fullAddress}<br />
                    {bookingData.area}, {bookingData.city}<br />
                    {bookingData.district}, {bookingData.division}
                  </p>
                  {bookingData.specialInstructions && (
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <p className="text-sm text-gray-600 mb-1">Special Instructions:</p>
                      <p className="text-gray-700">{bookingData.specialInstructions}</p>
                    </div>
                  )}
                </div>

                {/* Total Cost */}
                <div className="p-6 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold text-gray-900">Total Amount:</span>
                    <span className="text-3xl font-bold text-blue-600">৳{calculateTotal()}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">Payment will be collected after service completion</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <button
                onClick={handlePrevious}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
            )}
            
            {step < 3 ? (
              <button
                onClick={handleNext}
                className="ml-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="ml-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {submitting ? 'Creating Booking...' : 'Confirm Booking'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}