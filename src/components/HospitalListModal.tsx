import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Filter, MapPin, Phone, ChevronRight, Navigation, Clock, Activity, Heart, AlertCircle, Loader2, Star } from 'lucide-react';
import { Hospital } from '../types';
import { HOSPITALS } from '../mockData';

interface HospitalListModalProps {
  isOpen: boolean;
  onClose: () => void;
  inline?: boolean;
}

// Haversine formula to calculate distance between two points in km
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

export const HospitalListModal: React.FC<HospitalListModalProps> = ({ isOpen, onClose, inline = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'nearest' | 'emergency' | 'maternal' | 'open'>('all');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      
      // Request Geolocation
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
            setIsLoading(false);
          },
          (error) => {
            console.error("Error getting location:", error);
            setLocationError(error.message);
            setIsLoading(false);
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      } else {
        setLocationError("Geolocation is not supported by this browser.");
        setIsLoading(false);
      }
    }
  }, [isOpen]);

  const hospitalsWithDistance = useMemo(() => {
    return HOSPITALS.map(h => {
      if (userLocation && h.lat && h.lng) {
        const dist = calculateDistance(userLocation.lat, userLocation.lng, h.lat, h.lng);
        return {
          ...h,
          distance: `${dist.toFixed(1)} km`,
          distanceValue: dist
        };
      }
      return h;
    });
  }, [userLocation]);

  const filteredHospitals = useMemo(() => {
    let result = hospitalsWithDistance.filter(h => 
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filter === 'nearest') {
      result = [...result].sort((a, b) => a.distanceValue - b.distanceValue);
    } else if (filter === 'emergency') {
      result = result.filter(h => h.isEmergencyCare);
    } else if (filter === 'maternal') {
      result = result.filter(h => h.isMaternalCare);
    } else if (filter === 'open') {
      result = result.filter(h => h.isOpen);
    }

    return result;
  }, [searchQuery, filter, hospitalsWithDistance]);

  const recommendedHospitals = useMemo(() => {
    return hospitalsWithDistance.filter(h => h.isRecommended && h.isMaternalCare);
  }, [hospitalsWithDistance]);

  const handleGetDirections = (hospital: Hospital) => {
    const mapsUrl = hospital.lat && hospital.lng 
      ? `https://www.google.com/maps/search/?api=1&query=${hospital.lat},${hospital.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.name + ' ' + hospital.address)}`;
    
    window.open(mapsUrl, '_blank');
  };

  const content = (
    <div className={`${inline ? '' : 'bg-white w-full max-w-2xl rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[95vh]'}`}>
      {!inline && (
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 hover:bg-stone-100 rounded-full transition-colors z-10"
        >
          <X size={24} className="text-stone-400" />
        </button>
      )}

      {!inline && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-stone-900">Find Nearest Hospital</h2>
          <p className="text-stone-500 text-sm">Locate maternal and emergency care near you</p>
        </div>
      )}

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input 
            type="text"
            placeholder="Search by hospital name or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full ${inline ? 'bg-stone-800 border-stone-700 text-white' : 'bg-stone-50 border-stone-100 text-stone-900'} border rounded-2xl pl-12 pr-4 py-4 text-sm outline-none focus:ring-2 focus:ring-pink-200 transition-all`}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: 'all', label: 'All', icon: Filter },
            { id: 'nearest', label: 'Nearest', icon: MapPin },
            { id: 'emergency', label: 'Emergency', icon: Activity },
            { id: 'maternal', label: 'Maternal Care', icon: Heart },
            { id: 'open', label: 'Open Now', icon: Clock },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                filter === f.id 
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-100' 
                  : inline ? 'bg-stone-800 text-stone-400 hover:bg-stone-700' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
              }`}
            >
              <f.icon size={14} />
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hospital List */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-6 pb-6 scrollbar-hide min-h-[300px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-stone-400 gap-3">
            <Loader2 size={40} className="animate-spin text-pink-500" />
            <p className="font-medium">Finding nearby hospitals...</p>
          </div>
        ) : locationError && !userLocation ? (
          <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl text-center">
            <AlertCircle size={32} className="text-rose-500 mx-auto mb-3" />
            <h3 className="text-rose-900 font-bold mb-1">Location Access Denied</h3>
            <p className="text-rose-700 text-xs mb-4">We need your location to show the nearest hospitals. Please enable location permissions in your browser settings.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-rose-600 text-white px-6 py-2 rounded-xl text-xs font-bold"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Recommended Section */}
            {filter === 'all' && searchQuery === '' && recommendedHospitals.length > 0 && (
              <div className="space-y-3">
                <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${inline ? 'text-pink-400' : 'text-pink-600'}`}>
                  <Star size={14} fill="currentColor" /> Recommended Maternal Care
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {recommendedHospitals.map((hospital) => (
                    <div 
                      key={`rec-${hospital.id}`}
                      className={`min-w-[280px] ${inline ? 'bg-stone-800 border-stone-700' : 'bg-pink-50 border-pink-100'} p-4 rounded-3xl border shadow-sm`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className={`font-bold text-sm ${inline ? 'text-white' : 'text-stone-900'}`}>{hospital.name}</h4>
                        <span className="bg-pink-100 text-pink-600 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase">Top Rated</span>
                      </div>
                      <p className="text-[10px] text-stone-400 mb-3 line-clamp-2">{hospital.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-pink-600 font-bold text-xs">{hospital.distance}</span>
                        <button 
                          onClick={() => setSelectedHospital(hospital)}
                          className="text-pink-600 text-xs font-bold flex items-center gap-1"
                        >
                          Details <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {filteredHospitals.length > 0 ? (
                <>
                  <h3 className={`text-xs font-bold uppercase tracking-wider ${inline ? 'text-stone-500' : 'text-stone-400'}`}>
                    {filter === 'all' ? 'All Nearby Hospitals' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Hospitals`}
                  </h3>
                  {filteredHospitals.map((hospital) => (
                    <motion.div
                      key={hospital.id}
                      layoutId={hospital.id}
                      className={`${inline ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-100'} p-5 rounded-3xl border shadow-sm hover:border-pink-200 transition-colors group`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-bold ${inline ? 'text-white' : 'text-stone-900'}`}>{hospital.name}</h3>
                            {hospital.isMaternalCare && (
                              <span className="bg-pink-100 text-pink-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                Maternal Care
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-500 flex items-center gap-1">
                            <MapPin size={12} /> {hospital.address}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-pink-600 font-bold text-sm">{hospital.distance}</p>
                          <p className={`text-[10px] font-bold uppercase ${hospital.isOpen ? 'text-green-500' : 'text-rose-500'}`}>
                            {hospital.isOpen ? 'Open Now' : 'Closed'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mb-4 text-[10px] text-stone-400 font-medium">
                        <span className="flex items-center gap-1"><Activity size={12} /> {hospital.type}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {hospital.availabilityStatus}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <a 
                          href={`tel:${hospital.phone}`}
                          className={`flex items-center justify-center gap-2 ${inline ? 'bg-stone-700 text-stone-200' : 'bg-stone-50 text-stone-700'} py-2.5 rounded-xl text-xs font-bold hover:opacity-80 transition-all`}
                        >
                          <Phone size={14} /> Call
                        </a>
                        <button 
                          onClick={() => handleGetDirections(hospital)}
                          className={`flex items-center justify-center gap-2 ${inline ? 'bg-stone-700 text-stone-200' : 'bg-stone-50 text-stone-700'} py-2.5 rounded-xl text-xs font-bold hover:opacity-80 transition-all`}
                        >
                          <Navigation size={14} /> Directions
                        </button>
                        <button 
                          onClick={() => setSelectedHospital(hospital)}
                          className="flex items-center justify-center gap-2 bg-pink-50 text-pink-600 py-2.5 rounded-xl text-xs font-bold hover:bg-pink-100 transition-colors"
                        >
                          Details <ChevronRight size={14} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                  <div className="bg-stone-100 p-6 rounded-full mb-4">
                    <AlertCircle size={40} className="text-stone-300" />
                  </div>
                  <h3 className={`text-lg font-bold ${inline ? 'text-white' : 'text-stone-900'} mb-2`}>No hospitals found</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">
                    We couldn't find hospitals nearby right now matching your search or filters. Try again or check your location settings.
                  </p>
                  <button 
                    onClick={() => {setSearchQuery(''); setFilter('all');}}
                    className="mt-6 text-pink-600 font-bold text-sm"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );

  if (inline) return content;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-2xl rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[95vh]"
          >
            {content}
          </motion.div>

          {/* Hospital Detail Sub-Modal */}
          <AnimatePresence>
            {selectedHospital && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedHospital(null)}
                className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
              >
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
                >
                  <button 
                    onClick={() => setSelectedHospital(null)} 
                    className="absolute top-6 right-6 p-2 hover:bg-stone-100 rounded-full transition-colors z-10"
                  >
                    <X size={24} className="text-stone-400" />
                  </button>

                  <div className="overflow-y-auto pr-2 scrollbar-hide">
                    <div className="bg-pink-100 w-16 h-16 rounded-2xl flex items-center justify-center text-pink-600 mb-6">
                      <Activity size={32} />
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-2xl font-bold text-stone-900">{selectedHospital.name}</h2>
                        {selectedHospital.isMaternalCare && (
                          <span className="bg-pink-100 text-pink-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
                            Maternal Care
                          </span>
                        )}
                      </div>
                      <p className="text-stone-500 text-sm flex items-center gap-1">
                        <MapPin size={14} /> {selectedHospital.address}
                      </p>
                    </div>

                    <div className="space-y-6 mb-8">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-1">Status</p>
                          <p className={`text-sm font-bold ${selectedHospital.isOpen ? 'text-green-600' : 'text-rose-600'}`}>
                            {selectedHospital.isOpen ? 'Open Now' : 'Closed'}
                          </p>
                        </div>
                        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-1">Distance</p>
                          <p className="text-sm font-bold text-stone-900">{selectedHospital.distance}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider px-1">Opening Hours</h4>
                        <div className="flex items-center gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-100">
                          <Clock size={18} className="text-stone-400" />
                          <p className="text-sm text-stone-700 font-medium">{selectedHospital.openingHours}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider px-1">Services Offered</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedHospital.services.map((service, i) => (
                            <span key={`service-${i}`} className="bg-pink-50 text-pink-600 px-4 py-2 rounded-xl text-xs font-bold">
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-amber-50 p-5 rounded-3xl border border-amber-100">
                        <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                          <Heart size={14} /> Maternal Care Note
                        </h4>
                        <p className="text-sm text-amber-800 leading-relaxed italic">
                          "{selectedHospital.description}"
                        </p>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider px-1">Availability</h4>
                        <div className="grid grid-cols-1 gap-2">
                          <div className="flex items-center gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-100">
                            <div className={`w-2 h-2 rounded-full ${selectedHospital.isEmergencyCare ? 'bg-green-500' : 'bg-stone-300'}`} />
                            <p className="text-sm text-stone-700 font-medium">Emergency Care: {selectedHospital.isEmergencyCare ? 'Available' : 'Not Available'}</p>
                          </div>
                          <div className="flex items-center gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-100">
                            <div className={`w-2 h-2 rounded-full ${selectedHospital.isMaternalCare ? 'bg-green-500' : 'bg-stone-300'}`} />
                            <p className="text-sm text-stone-700 font-medium">Maternal Care: {selectedHospital.isMaternalCare ? 'Available' : 'Not Available'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <a 
                        href={`tel:${selectedHospital.phone}`}
                        className="flex items-center justify-center gap-3 bg-pink-600 text-white py-4 rounded-2xl font-bold hover:bg-pink-700 transition-colors shadow-lg shadow-pink-100"
                      >
                        <Phone size={18} /> Call Hospital
                      </a>
                      <button 
                        onClick={() => handleGetDirections(selectedHospital)}
                        className="flex items-center justify-center gap-3 bg-stone-800 text-white py-4 rounded-2xl font-bold hover:bg-stone-900 transition-colors shadow-lg shadow-stone-100"
                      >
                        <Navigation size={18} /> Get Directions
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
