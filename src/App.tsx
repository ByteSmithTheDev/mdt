// EzMDT - V1.233 with Leaderboard
const APP_VERSION = '1.233';
const LAST_UPDATE = '20-05-2025 | 10:00';

// API Endpoints
const OFFICERS_SHEET_ID = '1oVS2YhdHqpG2bmrpuOoM3e0C6DyIB3XvEJKtEOsenGc';
const OFFICERS_API_URL = `https://docs.google.com/spreadsheets/d/${OFFICERS_SHEET_ID}/gviz/tq?tqx=out:json&tq=SELECT B, F WHERE B IS NOT NULL AND F IS NOT NULL`;
const VEHICLES_API_URL = 'https://api.itspsd.in/la-vehicles/';
const CHARACTERS_API_URL = 'https://api.itspsd.in/characters/';

import React, { useState, useEffect } from 'react';
import {
  ClipboardCopy, Building2, Store, Car, Pill, Sun, Moon, Tablet,
  ArrowRight, ArrowLeft, FileText, Truck, AlertTriangle, Siren,
  ShieldAlertIcon, UserSquare2, GraduationCap, Trophy, X
} from 'lucide-react';
import Select from 'react-select';
import { useQuery } from '@tanstack/react-query';
import {
  IncidentType, Officer, Vehicle, SceneAssignment, PursuitDetails,
  RobberyDetails, VehicleDetails, DrugDetails, Code5Details, CodeRedDetails,
  ShootoutDetails, CivilianDetails, CadetDetails
} from './types';
import { bankLocations, storeLocations, drugLocations, stockadeLocations } from './constants';
import { generateReport } from './utils';

// Leaderboard interface
interface LeaderboardEntry {
  id: number;
  officer_name: string;
  mdt_count: number;
  last_created: string;
}

const API_BASE_URL = '/api';



function App() {
  // State Setup
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [incidentType, setIncidentType] = useState<IncidentType>('bank');
  const [copied, setCopied] = useState(false);
  
  const [sceneAssignment, setSceneAssignment] = useState<SceneAssignment>({
    reportingOfficer: '',
    sceneCommand: '',
    negotiator: '',
    stayedBackForHostage: '',
    mdtCreatedBy: ''
  });

  const [pursuitDetails, setPursuitDetails] = useState<PursuitDetails>({
    primary: '',
    secondary: '',
    tertiary: '',
    parallel: '',
    fifthUnit: '',
    airOne: '',
    showExtra: false,
    escaped: false,
  });

  const [robberyDetails, setRobberyDetails] = useState<RobberyDetails>({
    location: '',
    robbersInside: 2,
    robbersOutside: 0,
    hostages: 1,
    demands: '',
    incidentNumber: '',
    dateTime: '',
    truckingCompany: 'Gruppe 6',
    valuables: 'valuable assets',
  });

  const [drugDetails, setDrugDetails] = useState<DrugDetails>({
    location: '',
    suspects: 1,
  });

  const [vehicleDetails, setVehicleDetails] = useState<VehicleDetails>({
    model: '',
    color: '',
    plate: '',
    registeredTo: '',
    seizeReason: '',
    seizeDuration: '360',
    escaped: false,
  });

  const [code5Details, setCode5Details] = useState<Code5Details>({
    location: '',
    speed: 0,
    reason: '',
  });

  const [codeRedDetails, setCodeRedDetails] = useState<CodeRedDetails>({
    location: '',
    gang1Color: '',
    gang2Color: '',
    weapons: [],
    medicalAttention: false,
    processedAt: '',
    charges: [],
  });

  const [shootoutDetails, setShootoutDetails] = useState<ShootoutDetails>({
    totalSuspects: 0,
    suspectsDowned: 0,
    officersDowned: 0,
    injuredSuspects: 0,
    injuredOfficers: 0,
    attemptedFlee: false,
    processedAt: '',
    weapons: [{ name: '', serial: '' }],
    location: '',
    originatedFrom: '',
  });

  const [civilianDetails, setCivilianDetails] = useState<CivilianDetails>({
    name: '',
    phoneNumber: '',
    reportType: '',
    description: '',
  });

  const [cadetDetails, setCadetDetails] = useState<CadetDetails>({
    trainingOfficer: '',
    cadetName: '',
    phase: 1,
    activities: [''],
    notes: '',
    overallPerformance: ''
  });

  useEffect(() => {
    // Fetch leaderboard data on mount
    fetchLeaderboardData();
  }, []);

  // Fetch leaderboard data
  const fetchLeaderboardData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/leaderboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setLeaderboardData(data);
      } else {
        console.error('Invalid leaderboard data format:', data);
        setLeaderboardData([]);
      }
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      setLeaderboardData([]);
      setLeaderboardError('Failed to fetch leaderboard data. Please try again later.');
    }
  };

  // Add useEffect to fetch leaderboard data periodically
  useEffect(() => {
    fetchLeaderboardData();
    // Refresh leaderboard every 30 seconds
    const interval = setInterval(fetchLeaderboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Add error state for leaderboard
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null);

  // Update the leaderboard modal to show error state
  const renderLeaderboardModal = () => {
    if (!showLeaderboard) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
              <Trophy className="text-yellow-500" /> MDT Leaderboard
            </h2>
            <button 
              onClick={() => setShowLeaderboard(false)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          
          {leaderboardError ? (
            <div className="text-center py-8 text-red-500">
              {leaderboardError}
              <button 
                onClick={() => {
                  setLeaderboardError(null);
                  fetchLeaderboardData();
                }}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {leaderboardData.length > 0 ? (
                leaderboardData.map((entry, index) => (
                  <div 
                    key={entry.id} 
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-amber-700' : 'bg-blue-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold dark:text-white">{entry.officer_name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Last MDT: {new Date(entry.last_created).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full text-blue-800 dark:text-blue-200 font-bold">
                      {entry.mdt_count} MDTs
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No leaderboard data available
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Record MDT creation to leaderboard
  const recordMDTCreation = async (officerName: string) => {
    if (!officerName) {
      console.log('No officer name provided for MDT creation');
      return;
    }

    try {
      console.log('Recording MDT creation for officer:', officerName);
      const response = await fetch(`${API_BASE_URL}/record-mdt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ officerName }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || 'Failed to record MDT creation';
        } catch {
          errorMessage = `Failed to record MDT creation: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      console.log('Successfully recorded MDT creation');
      // Refresh leaderboard data after recording
      await fetchLeaderboardData();
    } catch (error) {
      console.error('Error recording MDT creation:', error);
      setLeaderboardError(error instanceof Error ? error.message : 'Failed to record MDT creation');
    }
  };

  // Modified copyToClipboard function to record MDT creation
  const copyToClipboard = async () => {
    try {
      const report = generateReport(
        incidentType,
        sceneAssignment,
        pursuitDetails,
        robberyDetails,
        vehicleDetails,
        drugDetails,
        code5Details,
        codeRedDetails,
        shootoutDetails,
        civilianDetails,
        cadetDetails
      );

      await navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      // Record MDT creation if an officer is specified
      if (sceneAssignment.mdtCreatedBy) {
        try {
          console.log('Attempting to record MDT creation...');
          const response = await fetch(`${API_BASE_URL}/record-mdt`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({ 
              officerName: sceneAssignment.mdtCreatedBy,
              reportType: incidentType,
              timestamp: new Date().toISOString()
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Server response:', {
              status: response.status,
              statusText: response.statusText,
              body: errorText
            });
            
            let errorMessage;
            try {
              const errorData = JSON.parse(errorText);
              errorMessage = errorData.error || `Failed to record MDT: ${response.status}`;
            } catch {
              errorMessage = `Failed to record MDT: ${response.status} ${response.statusText}`;
            }
            throw new Error(errorMessage);
          }

          console.log('Successfully recorded MDT creation');
          // Refresh leaderboard after successful recording
          await fetchLeaderboardData();
        } catch (error) {
          console.error('Failed to record MDT:', error);
          // Show error to user but don't prevent copy
          setLeaderboardError(error instanceof Error ? error.message : 'Failed to update leaderboard');
          // Show the leaderboard to make the error visible
          setShowLeaderboard(true);
        }
      }
    } catch (err) {
      console.error('Failed to copy text:', err);
      alert('Failed to copy report to clipboard. Please try again.');
    }
  };

  // Theme effect
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const getMaxSteps = () => {
    switch (incidentType) {
      case 'bank':
      case 'jewelry':
      case 'store':
      case 'stockade':
        return 4;
      case 'drugs':
      case 'shootout':
      case 'codered':
        return 3;
      case 'seizure':
      case 'civilian':
      case 'cadet':
        return 2;
      case 'code5':
        return 3;
      default:
        return 1;
    }
  };

  const nextStep = () => {
    if (showPreview) setShowPreview(false);
    setCurrentStep(prev => Math.min(prev + 1, getMaxSteps()));
  };

  const prevStep = () => {
    if (showPreview) {
      setShowPreview(false);
      return;
    }
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const togglePreview = () => setShowPreview(!showPreview);

  // Data fetching
  const { data: officers, isLoading: officersLoading, error: officersError } = useQuery({
    queryKey: ['officers'],
    queryFn: async () => {
      const response = await fetch(OFFICERS_API_URL);
      if (!response.ok) throw new Error('Failed to fetch officers');
      
      const text = await response.text();
      const jsonString = text.match(/google\.visualization\.Query\.setResponse\((.*)\);/)?.[1];
      if (!jsonString) throw new Error('Invalid response format');
      
      const jsonData = JSON.parse(jsonString);
      if (!jsonData.table?.rows) throw new Error('Invalid data structure');

      return jsonData.table.rows
        .map((row: any) => ({
          callSign: row.c[0]?.v || '',
          name: row.c[1]?.v || '',
        }))
        .filter((officer: Officer) =>
          officer.callSign &&
          officer.name &&
          !officer.callSign.includes('/') &&
          !officer.name.includes('/')
        );
    },
  });

  const { data: vehicles, isLoading: vehiclesLoading, error: vehiclesError } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const response = await fetch(VEHICLES_API_URL);
      if (!response.ok) throw new Error('Failed to fetch vehicles');
      
      const data = await response.json();
      return data.map((vehicle: any) => ({
        name: vehicle.name || '',
      })).filter((vehicle: Vehicle) => vehicle.name);
    },
  });

  const officerOptions = officers?.map((officer: Officer) => ({
    value: `${officer.callSign} ${officer.name}`,
    label: `${officer.callSign} - ${officer.name}`,
  })) || [];

  const vehicleOptions = vehicles?.map((vehicle: Vehicle) => ({
    value: vehicle.name,
    label: vehicle.name,
  })) || [];

  if (officersLoading || vehiclesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="relative mx-auto w-40 h-40">
            {/* Animated circles */}
            <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
            <div className="absolute inset-4 rounded-full border-4 border-emerald-500 border-b-transparent animate-spin animation-delay-200"></div>
            <div className="absolute inset-8 rounded-full border-4 border-purple-500 border-l-transparent animate-spin animation-delay-400"></div>
            
            {/* Center logo or icon */}
            <div className="absolute inset-10 flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="w-12 h-12 text-white animate-pulse"
              >
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
            </div>
          </div>
  
          {/* Animated text with gradient */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              Loading Dashboard
            </h2>
            <p className="text-gray-400 text-sm">
              <span className="inline-block animate-bounce">.</span>
              <span className="inline-block animate-bounce animation-delay-150">.</span>
              <span className="inline-block animate-bounce animation-delay-300">.</span>
            </p>
          </div>
  
          {/* Working Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2.5 max-w-xs mx-auto overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full"
              style={{
                width: '0%',
                animation: 'progress 2s linear infinite',
              }}
            ></div>
          </div>
        </div>
  
        <style>{`
          @keyframes progress {
            0% {
              width: 0%;
              margin-left: 0;
            }
            50% {
              width: 100%;
              margin-left: 0;
            }
            100% {
              width: 0%;
              margin-left: 100%;
            }
          }
          .animate-spin {
            animation: spin 1.5s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .animation-delay-200 {
            animation-delay: 0.2s;
          }
          .animation-delay-400 {
            animation-delay: 0.4s;
          }
          .animation-delay-150 {
            animation-delay: 0.15s;
          }
          .animation-delay-300 {
            animation-delay: 0.3s;
          }
        `}</style>
      </div>
    );
  }
  


  // Error state
  if (officersError || vehiclesError) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">Error loading data. Please try again later.</span>
        </div>
      </div>
    );
  }

  // Render current step
  const renderStep = () => {
    if (showPreview) {
      const report = generateReport(
        incidentType,
        sceneAssignment,
        pursuitDetails,
        robberyDetails,
        vehicleDetails,
        drugDetails,
        code5Details,
        codeRedDetails,
        shootoutDetails,
        civilianDetails,
        cadetDetails
      );

      return (
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold dark:text-white">Report Preview</h2>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ClipboardCopy size={18} />
              {copied ? 'Copied!' : 'Copy Report'}
            </button>
          </div>
          <pre className="whitespace-pre-wrap font-mono text-sm bg-white dark:bg-gray-800 p-4 rounded-lg shadow dark:text-gray-200">
            {report}
          </pre>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Welcome to EzMDT</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Legacy Roleplay India SASP Report Generator. Select an incident type for the report you would like to create.
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                Version {APP_VERSION} • Last updated {LAST_UPDATE}
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { type: 'bank', label: 'Bank', icon: <Building2 size={24} />, tooltip: 'Bank robbery incident report' },
                { type: 'jewelry', label: 'Jewelry', icon: <Store size={24} />, tooltip: 'Jewelry store robbery incident report' },
                { type: 'store', label: 'Store', icon: <Store size={24} />, tooltip: 'Convenience store robbery incident report' },
                { type: 'drugs', label: 'Drugs', icon: <Pill size={24} />, tooltip: 'Drug-sale incident report' },
                { type: 'seizure', label: 'Seizure', icon: <Car size={24} />, tooltip: 'Vehicle seizure incident report' },
                { type: 'stockade', label: 'Stockade', icon: <Truck size={24} />, tooltip: 'Armored truck robbery incident report' },
                { type: 'code5', label: 'Code 5', icon: <AlertTriangle size={24} />, tooltip: 'Code 5 incident report' },
                { type: 'codered', label: 'Gang Shootout', icon: <ShieldAlertIcon size={24} />, tooltip: 'Gang Shootout incident report' },
                { type: 'shootout', label: 'Shootout', icon: <Siren size={24} />, tooltip: 'Officer involved shootout report' },
                { type: 'civilian', label: 'Civilian', icon: <UserSquare2 size={24} />, tooltip: 'Civilian complaint report' },
                { type: 'cadet', label: 'Cadet', icon: <GraduationCap size={24} />, tooltip: 'Cadet training log' },
              ].map((item) => (
                <div key={item.type} className="relative">
                  <button
                    className={`p-4 rounded-lg transition-all duration-200 flex flex-col items-center justify-center gap-2 w-full h-full min-h-[120px] ${
                      incidentType === item.type
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-white'
                    }`}
                    onClick={() => setIncidentType(item.type as IncidentType)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                  <div className="absolute top-1 right-1">
                    <span className="relative group">
                      <span className="border border-blue-400 text-blue-400 rounded-full w-3.5 h-3.5 flex items-center justify-center text-[8px] cursor-default hover:text-white hover:bg-blue-400 hover:shadow-[0_0_6px_rgba(255,255,255,0.8)] transition-all">
                        i
                      </span>
                      <span className="absolute hidden group-hover:block w-64 bg-gray-800 p-2 rounded-lg shadow-xl text-xs z-50 -top-1 right-0 transform -translate-y-full text-white">
                        <div className="absolute bottom-0 right-2 w-3 h-3 bg-gray-800 transform rotate-45 translate-y-1/2"></div>
                        {item.tooltip}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

        case 2:
          if (incidentType === 'civilian') {
            return (
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4 dark:text-white">Reporting Officer</h2>
                  <Select
                    className="mb-6"
                    classNames={{
                      control: (state) => state.isFocused ? 'border-blue-500' : 'border-gray-300',
                    }}
                    placeholder="Select Reporting Officer"
                    options={officerOptions}
                    onChange={(option) => setSceneAssignment({
                      ...sceneAssignment,
                      reportingOfficer: option?.value || ''
                    })}
                  />
  
                  <h2 className="text-xl font-semibold mb-4 dark:text-white">MDT Created By</h2>
                  <Select
                    className="mb-6"
                    classNames={{
                      control: (state) => state.isFocused ? 'border-blue-500' : 'border-gray-300',
                    }}
                    placeholder="Select Officer"
                    options={officerOptions}
                    onChange={(option) => setSceneAssignment({
                      ...sceneAssignment,
                      mdtCreatedBy: option?.value || ''
                    })}
                  />
  
                  <h2 className="text-xl font-semibold mb-4 dark:text-white">Civilian Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <input
                      type="text"
                      placeholder="Civilian Name"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                      value={civilianDetails.name}
                      onChange={(e) => setCivilianDetails({...civilianDetails, name: e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="Phone Number"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                      value={civilianDetails.phoneNumber}
                      onChange={(e) => setCivilianDetails({...civilianDetails, phoneNumber: e.target.value})}
                    />
                  </div>
  
                  <div className="mb-6">
                    <select
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                      value={civilianDetails.reportType}
                      onChange={(e) => setCivilianDetails({...civilianDetails, reportType: e.target.value})}
                    >
                      <option value="">Select Report Type</option>
                      <option value="Stolen Car">Stolen Car</option>
                      <option value="Scam">Scam</option>
                      <option value="Gun">Assault</option>
                      <option value="Property Damage">Property Damage</option>
                      <option value="Harassment">Harassment</option>
                      <option value="Gun Shot">Gun Shot</option>
                      <option value="Threatend">Threatend</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
  
                  <div>
                    <textarea
                      placeholder="Detailed description of the incident..."
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500 min-h-[200px]"
                      value={civilianDetails.description}
                      onChange={(e) => setCivilianDetails({...civilianDetails, description: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            );
          }
  

          if (incidentType === 'cadet') {
            // const sendToDiscordWebhook = async () => {
            //   const embedPayload = {
            //     embeds: [
            //       {
            //         title: 'Cadet Training Report',
            //         color: 0x57F287,
            //         timestamp: new Date().toISOString(),
            //         fields: [
            //           {
            //             name: 'Training Officer:',
            //             value: `**${cadetDetails.trainingOfficer || 'N/A'}**`,
            //             inline: true,
            //           },
            //           {
            //             name: 'Cadet:',
            //             value: `**${cadetDetails.cadetName || 'N/A'}**`,
            //             inline: true,
            //           },
            //           {
            //             name: 'Phase:',
            //             value: `**${cadetDetails.phase?.toString() || 'N/A'}**`,
            //             inline: true,
            //           },
            //           {
            //             name: 'Activities Completed:',
            //             value: cadetDetails.activities?.length > 0 ? cadetDetails.activities.join('\n') : 'None',
            //           },
            //           {
            //             name: 'Notes:',
            //             value: cadetDetails.notes || 'None',
            //           },
            //           {
            //             name: 'Overall Performance:',
            //             value: cadetDetails.overallPerformance || 'None',
            //           },
            //         ],
            //       },
            //     ],
            //   };
          
            //   try {
            //     await fetch(CADET_WEBHOOK_URL, {
            //       method: 'POST',
            //       headers: { 'Content-Type': 'application/json' },
            //       body: JSON.stringify(embedPayload),
            //     });
            //   } catch (error) {
            //     console.error('Failed to send to Discord:', error);
            //   }
            // };
          
            const generateCadetReport = () => {
              return `[TRAINING OFFICER]:\n${cadetDetails.trainingOfficer}\n\n` +
                `[CADET]:\n${cadetDetails.cadetName}\n\n` +
                `Phase: ${cadetDetails.phase}\n\n` +
                `Activities Completed Successfully:\n${cadetDetails.activities.join('\n')}\n\n` +
                `Notes:\n${cadetDetails.notes}\n\n` +
                `${cadetDetails.overallPerformance}`;
            };
          
            const copyToClipboard = async () => {
              const report = generateCadetReport();
              try {
                await navigator.clipboard.writeText(report);
                // await sendToDiscordWebhook();
                alert('Report copied to clipboard!');
              } catch (err) {
                console.error('Error copying:', err);
                alert('Failed to copy report.');
              }
            };
          
            return (
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4 dark:text-white">Training Officer</h2>
                  <Select
                    className="mb-6"
                    classNames={{
                      control: (state) => state.isFocused ? 'border-blue-500' : 'border-gray-300',
                    }}
                    placeholder="Select Training Officer"
                    options={officerOptions}
                    onChange={(option) => setCadetDetails({
                      ...cadetDetails,
                      trainingOfficer: option?.value || ''
                    })}
                  />
          
                  <h2 className="text-xl font-semibold mb-4 dark:text-white">Cadet Details</h2>
                  <div className="grid grid-cols-1 gap-4 mb-6">
                    <Select
                      placeholder="Select Cadet Name"
                      options={officerOptions}
                      className="w-full"
                      classNames={{
                        control: (state) => state.isFocused ? 'border-blue-500' : 'border-gray-300',
                      }}
                      value={officerOptions.find(option => option.value === cadetDetails.cadetName) || null}
                      onChange={(option) =>
                        setCadetDetails({
                          ...cadetDetails,
                          cadetName: option?.value || ''
                        })
                      }
                    />
          
                    <input
                      type="number"
                      placeholder="Phase"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                      value={cadetDetails.phase}
                      onChange={(e) =>
                        setCadetDetails({ ...cadetDetails, phase: parseInt(e.target.value) || 1 })
                      }
                    />
          
                    <input
                      type="text"
                      placeholder="Activities (comma separated)"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                      value={cadetDetails.activities.join(', ')}
                      onChange={(e) =>
                        setCadetDetails({
                          ...cadetDetails,
                          activities: e.target.value.split(',').map((a) => a.trim())
                        })
                      }
                    />
          
                    <textarea
                      placeholder="Notes"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                      value={cadetDetails.notes}
                      onChange={(e) =>
                        setCadetDetails({ ...cadetDetails, notes: e.target.value })
                      }
                    />
          
                    <textarea
                      placeholder="Overall Performance"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                      value={cadetDetails.overallPerformance}
                      onChange={(e) =>
                        setCadetDetails({ ...cadetDetails, overallPerformance: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            );
          }
          

        if (incidentType === 'codered') {
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Location & Gang Details</h2>
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                  value={codeRedDetails.location}
                  onChange={(e) =>
                    setCodeRedDetails({ ...codeRedDetails, location: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Gang 1 Color"
                  className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                  value={codeRedDetails.gang1Color}
                  onChange={(e) =>
                    setCodeRedDetails({ ...codeRedDetails, gang1Color: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Gang 2 Color"
                  className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                  value={codeRedDetails.gang2Color}
                  onChange={(e) =>
                    setCodeRedDetails({ ...codeRedDetails, gang2Color: e.target.value })
                  }
                />
              </div>
        
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Officer Details</h2>
                <Select
                  className="mb-3"
                  classNames={{
                    control: (state) =>
                      state.isFocused ? 'border-blue-500' : 'border-gray-300',
                  }}
                  placeholder="Reporting Officer"
                  options={officerOptions}
                  onChange={(option) =>
                    setSceneAssignment({
                      ...sceneAssignment,
                      reportingOfficer: option?.value || '',
                    })
                  }
                />
                {/* MDT Created By */}
                <Select
                  className="mb-3"
                  classNames={{
                    control: (state) =>
                      state.isFocused ? 'border-blue-500' : 'border-gray-300',
                  }}
                  placeholder="MDT Created By"
                  options={officerOptions}
                  onChange={(option) =>
                    setSceneAssignment({
                      ...sceneAssignment,
                      mdtCreatedBy: option?.value || '',
                    })
                  }
                />
              </div>
            </div>
          );
        }
        

        if (incidentType === 'code5') {
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Stop Details</h2>
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                  value={code5Details.location}
                  onChange={(e) =>
                    setCode5Details({ ...code5Details, location: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="Speed (mph)"
                  className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                  value={code5Details.speed}
                  onChange={(e) =>
                    setCode5Details({
                      ...code5Details,
                      speed: parseInt(e.target.value),
                    })
                  }
                />
              </div>
        
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Officer Details</h2>
                <Select
                  className="mb-3"
                  classNames={{
                    control: (state) =>
                      state.isFocused ? 'border-blue-500' : 'border-gray-300',
                  }}
                  placeholder="Reporting Officer"
                  options={officerOptions}
                  onChange={(option) =>
                    setSceneAssignment({
                      ...sceneAssignment,
                      reportingOfficer: option?.value || '',
                    })
                  }
                />
        
                {/* MDT Created By */}
                <Select
                  className="mb-3"
                  classNames={{
                    control: (state) =>
                      state.isFocused ? 'border-blue-500' : 'border-gray-300',
                  }}
                  placeholder="MDT Created By"
                  options={officerOptions}
                  onChange={(option) =>
                    setSceneAssignment({
                      ...sceneAssignment,
                      mdtCreatedBy: option?.value || '',
                    })
                  }
                />
              </div>
            </div>
          );
        }
        
        if (incidentType === 'seizure') {
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Vehicle Details</h2>
                <Select
                  className="mb-3"
                  classNames={{
                    control: (state) =>
                      state.isFocused ? 'border-blue-500' : 'border-gray-300',
                  }}
                  placeholder="Select Vehicle Model"
                  options={vehicleOptions}
                  onChange={(option) =>
                    setVehicleDetails({ ...vehicleDetails, model: option?.value || '' })
                  }
                />
                <input
                  type="text"
                  placeholder="Color"
                  className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                  value={vehicleDetails.color}
                  onChange={(e) =>
                    setVehicleDetails({ ...vehicleDetails, color: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Plate"
                  className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                  value={vehicleDetails.plate}
                  onChange={(e) =>
                    setVehicleDetails({ ...vehicleDetails, plate: e.target.value })
                  }
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <input
                    type="text"
                    placeholder="CID"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                    value={vehicleDetails.cid}
                    onChange={async (e) => {
                      const cid = e.target.value;
                      setVehicleDetails({ ...vehicleDetails, cid });
                      try {
                        const res = await fetch(CHARACTERS_API_URL);
                        const data = await res.json();
                        const char = data.responsive.find(
                          (c) => String(c.character_id) === cid
                        );
                        setVehicleDetails((v) => ({
                          ...v,
                          registeredTo: char
                            ? `${char.first_name} ${char.last_name}`
                            : '',
                        }));
                      } catch (error) {
                        console.error('API fetch error:', error);
                      }
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Registered To"
                    readOnly
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                    value={vehicleDetails.registeredTo}
                  />
                </div>
        
                {/* MDT Created By */}
                <Select
                  className="mb-3"
                  classNames={{
                    control: (state) =>
                      state.isFocused ? 'border-blue-500' : 'border-gray-300',
                  }}
                  placeholder="MDT Created By"
                  options={officerOptions}
                  onChange={(option) =>
                    setSceneAssignment({
                      ...sceneAssignment,
                      mdtCreatedBy: option?.value || '',
                    })
                  }
                />
              </div>
        
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Seizure Details</h2>
                <input
                  type="text"
                  placeholder="Seize Reason"
                  className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                  value={vehicleDetails.seizeReason}
                  onChange={(e) =>
                    setVehicleDetails({ ...vehicleDetails, seizeReason: e.target.value })
                  }
                />
                <select
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                  value={vehicleDetails.seizeDuration}
                  onChange={(e) =>
                    setVehicleDetails({ ...vehicleDetails, seizeDuration: e.target.value })
                  }
                >
                  <option value="360">360 Minutes</option>
                  <option value="720">720 Minutes</option>
                  <option value="1440">1440 Minutes</option>
                  <option value="2879">2879 Minutes</option>
                </select>
              </div>
            </div>
          );
        }
        

        if (incidentType === 'shootout') {
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Scene Assignment</h2>
                <Select
                  className="mb-3"
                  classNames={{
                    control: (state) => state.isFocused ? 'border-blue-500' : 'border-gray-300',
                  }}
                  placeholder="Reporting Officer"
                  options={officerOptions}
                  onChange={(option) => setSceneAssignment({
                    ...sceneAssignment,
                    reportingOfficer: option?.value || ''
                  })}
                />
      
                <Select
                  className="mb-3"
                  classNames={{
                    control: (state) => state.isFocused ? 'border-blue-500' : 'border-gray-300',
                  }}
                  placeholder="MDT Created By"
                  options={officerOptions}
                  onChange={(option) => setSceneAssignment({
                    ...sceneAssignment,
                    mdtCreatedBy: option?.value || ''
                  })}
                />
              </div>
      
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Location Details</h2>
                <input
                  type="text"
                  placeholder="Location of Shootout"
                  className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                  value={shootoutDetails.location}
                  onChange={(e) => setShootoutDetails({...shootoutDetails, location: e.target.value})}
                />
              </div>
            </div>
          );
        }
        

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {incidentType !== 'jewelry' && (
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 flex items-center dark:text-white">Location</h2>
                {incidentType === 'drugs' ? (
                  <Select
                    className="mb-3"
                    classNames={{
                      control: (state) => state.isFocused ? 'border-blue-500' : 'border-gray-300',
                    }}
                    placeholder="Select Location"
                    options={drugLocations}
                    onChange={(option) => setDrugDetails({
                      ...drugDetails,
                      location: option?.label || ''
                    })}
                  />
                ) : incidentType === 'stockade' ? (
                  <Select
                    className="mb-3"
                    classNames={{
                      control: (state) => state.isFocused ? 'border-blue-500' : 'border-gray-300',
                    }}
                    placeholder="Select Location"
                    options={stockadeLocations}
                    onChange={(option) => setRobberyDetails({
                      ...robberyDetails,
                      location: option?.value || ''
                    })}
                  />
                ) : (
                  <Select
                    className="mb-3"
                    classNames={{
                      control: (state) => state.isFocused ? 'border-blue-500' : 'border-gray-300',
                    }}
                    placeholder="Select Location"
                    options={incidentType === 'bank' ? bankLocations : storeLocations}
                    onChange={(option) => setRobberyDetails({
                      ...robberyDetails,
                      location: option?.value || ''
                    })}
                  />
                )}
            {incidentType === 'drugs' && (
              <input
                type="number"
                placeholder="Number of Suspects"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                value={drugDetails.suspects}
                onChange={(e) => setDrugDetails({...drugDetails, suspects: parseInt(e.target.value) || 0})}
              />
            )}

            </div>
            )}

            <div className={`bg-gray-50 dark:bg-gray-700 p-6 rounded-lg ${incidentType === 'jewelry' ? 'md:col-span-2' : ''}`}>
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Scene Assignment</h2>

              <Select
                className="mb-3"
                classNames={{
                  control: (state) => state.isFocused ? 'border-blue-500' : 'border-gray-300',
                }}
                placeholder="Reporting Officer"
                options={officerOptions}
                onChange={(option) => setSceneAssignment({
                  ...sceneAssignment,
                  reportingOfficer: option?.value || ''
                })}
              />

              <Select
                className="mb-3"
                classNames={{
                  control: (state) => state.isFocused ? 'border-blue-500' : 'border-gray-300',
                }}
                placeholder="MDT Created By"
                options={officerOptions}
                onChange={(option) => setSceneAssignment({
                  ...sceneAssignment,
                  mdtCreatedBy: option?.value || ''
                })}
              />


              {(incidentType === 'bank' || incidentType === 'jewelry' || incidentType === 'store' || incidentType === 'stockade') && (
                <>
                  <Select
                    className="mb-3"
                    classNames={{
                      control: (state) => state.isFocused ? 'border-blue-500' : 'border-gray-300',
                    }}
                    placeholder="Scene Command"
                    options={officerOptions}
                    onChange={(option) => setSceneAssignment({
                      ...sceneAssignment,
                      sceneCommand: option?.value || ''
                    })}
                  />
                  <Select
                    className="mb-3"
                    classNames={{
                      control: (state) => state.isFocused ? 'border-blue-500' : 'border-gray-300',
                    }}
                    placeholder="Negotiator"
                    options={officerOptions}
                    onChange={(option) => setSceneAssignment({
                      ...sceneAssignment,
                      negotiator: option?.value || ''
                    })}
                  />
                  <Select
                    className="mb-3"
                    classNames={{
                      control: (state) => state.isFocused ? 'border-blue-500' : 'border-gray-300',
                    }}
                    placeholder="Stayed Back For Hostage"
                    options={officerOptions}
                    onChange={(option) => setSceneAssignment({
                      ...sceneAssignment,
                      stayedBackForHostage: option?.value || ''
                    })}
                  />
                </>
              )}
            </div>
          </div>
        );


      case 3:
        if (incidentType === 'shootout') {
          return (
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Shootout Details</h2>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Originated From
                  </label>
                  <select
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                    value={shootoutDetails.originatedFrom}
                    onChange={(e) =>
                      setShootoutDetails({ ...shootoutDetails, originatedFrom: e.target.value })
                    }
                  >
                    <option value="">Select Origin</option>
                    <option value="10-90 Bank">10-90 Bank</option>
                    <option value="10-90 Jewelry">10-90 Jewelry</option>
                    <option value="10-90 Store">10-90 Store</option>
                    <option value="10-78 Stockade">10-78 Stockade</option>
                    <option value="10-11">10-11</option>
                    <option value="Shots fired call">Shots fired call</option>
                    <option value="On-Going Shootout">On-Going Shootout</option>
                    <option value="Felony Evading">Felony Evading</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Total Suspects
                    </label>
                    <input
                      type="number"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                      value={shootoutDetails.totalSuspects}
                      onChange={(e) => setShootoutDetails({...shootoutDetails, totalSuspects: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Suspects Downed
                    </label>
                    <input
                      type="number"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                      value={shootoutDetails.suspectsDowned}
                      onChange={(e) => setShootoutDetails({...shootoutDetails, suspectsDowned: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Officers Downed
                    </label>
                    <input
                      type="number"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                      value={shootoutDetails.officersDowned}
                      onChange={(e) => setShootoutDetails({...shootoutDetails, officersDowned: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-3 dark:text-white">Weapons Information</h3>
                <div className="space-y-4 mb-6">
                  {shootoutDetails.weapons.map((weapon, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                      <input
                        type="text"
                        placeholder="Weapon Name"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                        value={weapon.name}
                        onChange={(e) => {
                          const newWeapons = [...shootoutDetails.weapons];
                          newWeapons[index].name = e.target.value;
                          setShootoutDetails({ ...shootoutDetails, weapons: newWeapons });
                        }}
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Serial Number"
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                          value={weapon.serial}
                          onChange={(e) => {
                            const newWeapons = [...shootoutDetails.weapons];
                            newWeapons[index].serial = e.target.value;
                            setShootoutDetails({ ...shootoutDetails, weapons: newWeapons });
                          }}
                        />
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newWeapons = shootoutDetails.weapons.filter((_, i) => i !== index);
                              setShootoutDetails({ ...shootoutDetails, weapons: newWeapons });
                            }}
                            className="text-red-500 font-bold px-2"
                            title="Remove Weapon"
                          >
                            ❌
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setShootoutDetails({
                        ...shootoutDetails,
                        weapons: [...shootoutDetails.weapons, { name: '', serial: '' }],
                      })
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Add Weapon
                  </button>
                </div>

                <h3 className="text-lg font-semibold mb-3 dark:text-white">Medical Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Injured Suspects
                    </label>
                    <input
                      type="number"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                      value={shootoutDetails.injuredSuspects}
                      onChange={(e) => setShootoutDetails({...shootoutDetails, injuredSuspects: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Injured Officers
                    </label>
                    <input
                      type="number"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                      value={shootoutDetails.injuredOfficers}
                      onChange={(e) => setShootoutDetails({...shootoutDetails, injuredOfficers: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>

                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    id="attemptedFlee"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={shootoutDetails.attemptedFlee}
                    onChange={(e) => setShootoutDetails({...shootoutDetails, attemptedFlee: e.target.checked})}
                  />
                  <label htmlFor="attemptedFlee" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    Suspect attempted to flee at hospital
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Processed At
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                    value={shootoutDetails.processedAt}
                    onChange={(e) => setShootoutDetails({...shootoutDetails, processedAt: e.target.value})}
                  />
                </div>
              </div>
            </div>
          );
        }

        if (incidentType === 'codered') {
          return (
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Incident Details</h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3 dark:text-white">Weapons</h3>
                {codeRedDetails.weapons.map((weapon, index) => (
                  <div key={index} className="flex gap-4 mb-3">
                    <input
                      type="text"
                      placeholder="Weapon Name"
                      className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                      value={weapon.name}
                      onChange={(e) => {
                        const newWeapons = [...codeRedDetails.weapons];
                        newWeapons[index].name = e.target.value;
                        setCodeRedDetails({...codeRedDetails, weapons: newWeapons});
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Serial Number"
                      className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                      value={weapon.serial}
                      onChange={(e) => {
                        const newWeapons = [...codeRedDetails.weapons];
                        newWeapons[index].serial = e.target.value;
                        setCodeRedDetails({...codeRedDetails, weapons: newWeapons});
                      }}
                    />
                    <button
                      onClick={() => {
                        const newWeapons = codeRedDetails.weapons.filter((_, i) => i !== index);
                        setCodeRedDetails({...codeRedDetails, weapons: newWeapons});
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setCodeRedDetails({
                    ...codeRedDetails,
                    weapons: [...codeRedDetails.weapons, { name: '', serial: '' }]
                  })}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add Weapon
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3 dark:text-white">Processing Details</h3>
                <input
                  type="text"
                  placeholder="Processed At (e.g., Mission Row PD)"
                  className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                  value={codeRedDetails.processedAt}
                  onChange={(e) => setCodeRedDetails({...codeRedDetails, processedAt: e.target.value})}
                />
                
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={codeRedDetails.medicalAttention}
                    onChange={(e) => setCodeRedDetails({...codeRedDetails, medicalAttention: e.target.checked})}
                    className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Medical Attention Required</span>
                </div>
              </div>
            </div>
          );
        }

        if (incidentType === 'code5' || incidentType === 'drugs') {
          return (
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Vehicle Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <Select
                    classNames={{
                      control: (state) =>
                        state.isFocused ? 'border-blue-500' : 'border-gray-300',
                    }}
                    placeholder="Select Vehicle Model"
                    options={vehicleOptions}
                    onChange={(option) =>
                      setVehicleDetails({
                        ...vehicleDetails,
                        model: option?.value || '',
                      })
                    }
                  />
                </div>
                <input
                  type="text"
                  placeholder="Color"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                  value={vehicleDetails.color}
                  onChange={(e) =>
                    setVehicleDetails({ ...vehicleDetails, color: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Plate"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                  value={vehicleDetails.plate}
                  onChange={(e) =>
                    setVehicleDetails({ ...vehicleDetails, plate: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="CID"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                  value={vehicleDetails.cid}
                  onChange={async (e) => {
                    const cid = e.target.value;
                    setVehicleDetails({ ...vehicleDetails, cid });
                    try {
                      const res = await fetch(CHARACTERS_API_URL);
                      const data = await res.json();
                      const char = data.responsive.find((c) => String(c.character_id) === cid);
                      setVehicleDetails((v) => ({
                        ...v,
                        registeredTo: char ? `${char.first_name} ${char.last_name}` : '',
                      }));
                    } catch (error) {
                      console.error('Failed to fetch character data', error);
                    }
                  }}
                />
                <input
                  type="text"
                  placeholder="Registered To"
                  readOnly
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                  value={vehicleDetails.registeredTo}
                />
                <div className="md:col-span-4 flex items-center mt-2">
                  <label className="flex items-center cursor-pointer">
                    <span className="mr-2 text-sm text-gray-700 dark:text-gray-300">
                      Escaped
                    </span>
                    <input
                      type="checkbox"
                      checked={vehicleDetails.escaped}
                      onChange={(e) =>
                        setVehicleDetails({
                          ...vehicleDetails,
                          escaped: e.target.checked,
                        })
                      }
                      className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>
            </div>
          );
        }
        
        return (
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              {incidentType === 'stockade' ? 'Stockade Details' : 'Robbery Details'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Robbers Involved
                </label>
                <input
                  type="number"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                  value={robberyDetails.robbersInside}
                  onChange={(e) => setRobberyDetails({...robberyDetails, robbersInside: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Robbers Apprehended
                </label>
                <input
                  type="number"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                  value={robberyDetails.robbersOutside}
                  onChange={(e) => setRobberyDetails({...robberyDetails, robbersOutside: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Hostages
                </label>
                <input
                  type="number"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                  value={robberyDetails.hostages}
                  onChange={(e) => setRobberyDetails({...robberyDetails, hostages: parseInt(e.target.value)})}
                />
              </div>
              {incidentType === 'stockade' ? (
                <>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Trucking Company
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                      value={robberyDetails.truckingCompany}
                      onChange={(e) => setRobberyDetails({...robberyDetails, truckingCompany: e.target.value})}
                      placeholder="Gruppe 6"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Valuables Being Transported
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                      value={robberyDetails.valuables}
                      onChange={(e) => setRobberyDetails({...robberyDetails, valuables: e.target.value})}
                      placeholder="valuable assets"
                    />
                  </div>
                </>
              ) : (
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Demands
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                    value={robberyDetails.demands}
                    onChange={(e) => setRobberyDetails({...robberyDetails, demands: e.target.value})}
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold dark:text-white">Pursuit Details</h2>
                <div className="flex flex-row gap-4">
                  <label className="flex items-center cursor-pointer">
                    <span className="mr-2 text-sm text-gray-700 dark:text-gray-300">Show Extra Units</span>
                    <input
                      type="checkbox"
                      checked={pursuitDetails.showExtra}
                      onChange={(e) => setPursuitDetails({ ...pursuitDetails, showExtra: e.target.checked })}
                      className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <span className="mr-2 text-sm text-gray-700 dark:text-gray-300">Escaped</span>
                    <input
                      type="checkbox"
                      checked={pursuitDetails.escaped}
                      onChange={(e) => setPursuitDetails({ ...pursuitDetails, escaped: e.target.checked })}
                      className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>        
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">  
                <Select
                  classNames={{
                    control: (state) => state.isFocused ? 'border-blue-500' : 'border-gray-300',
                  }}
                  placeholder="Primary"
                  options={officerOptions}
                  onChange={(option) => setPursuitDetails({
                    ...pursuitDetails,
                    primary: option?.value || ''
                  })}
                />
                <Select
                  classNames={{
                    control: (state) => state.isFocused ? 'border-blue-500' : 'border-gray-300',
                  }}
                  placeholder="Secondary"
                  options={officerOptions}
                  onChange={(option) => setPursuitDetails({
                    ...pursuitDetails,
                    secondary: option?.value || ''
                  })}
                />
                <Select
                  classNames={{
                    control: (state) => state.isFocused ? 'border-blue-500' : 'border-gray-300',
                  }}
                  placeholder="Tertiary"
                  options={officerOptions}
                  onChange={(option) => setPursuitDetails({
                    ...pursuitDetails,
                    tertiary: option?.value || ''
                  })}
                />
                <Select
                  classNames={{
                    control: (state) => state.isFocused ? 'border-blue-500' : 'border-gray-300',
                  }}
                  placeholder="Parallel"
                  options={officerOptions}
                  onChange={(option) => setPursuitDetails({
                    ...pursuitDetails,
                    parallel: option?.value || ''
                  })}
                />
                {pursuitDetails.showExtra && (
                  <>
                    <Select
                      classNames={{
                        control: (state) => state.isFocused ? 'border-blue-500' : 'border-gray-300',
                      }}
                      placeholder="5th Unit"
                      options={officerOptions}
                      onChange={(option) => setPursuitDetails({
                        ...pursuitDetails,
                        fifthUnit: option?.value || ''
                      })}
                    />
                    <Select
                      classNames={{
                        control: (state) => state.isFocused ? 'border-blue-500' : 'border-gray-300',
                      }}
                      placeholder="Air-1"
                      options={officerOptions}
                      onChange={(option) => setPursuitDetails({
                        ...pursuitDetails,
                        airOne: option?.value || ''
                      })}
                    />
                  </>
                )}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Vehicle Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <Select
                    classNames={{
                      control: (state) => state.isFocused ? 'border-blue-500' : 'border-gray-300',
                    }}
                    placeholder="Select Vehicle Model"
                    options={vehicleOptions}
                    onChange={(option) => setVehicleDetails({...vehicleDetails, model: option?.value || ''})}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Color"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                  value={vehicleDetails.color}
                  onChange={(e) => setVehicleDetails({...vehicleDetails, color: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Plate"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                  value={vehicleDetails.plate}
                  onChange={(e) => setVehicleDetails({...vehicleDetails, plate: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4 md:col-span-4">
                  <input
                    type="text"
                    placeholder="CID"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                    value={vehicleDetails.cid}
                    onChange={async (e) => {
                      const cid = e.target.value;
                      setVehicleDetails({ ...vehicleDetails, cid });
                      try {
                        const res = await fetch(CHARACTERS_API_URL);
                        const data = await res.json();
                        const char = data.responsive.find((c) => String(c.character_id) === cid);
                        setVehicleDetails((v) => ({
                          ...v,
                          registeredTo: char ? `${char.first_name} ${char.last_name}` : '',
                        }));
                      } catch (error) {
                        console.error('CID fetch error:', error);
                      }
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Registered To"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white dark:border-gray-500"
                    value={vehicleDetails.registeredTo}
                    onChange={(e) => setVehicleDetails({...vehicleDetails, registeredTo: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className="min-h-screen bg-gray-100 dark:bg-gray-900 p-2 sm:p-6 flex flex-col transition-colors duration-200"
      style={{
        backgroundImage: "url('https://i.vgy.me/TMVSO6.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundBlendMode: "overlay"
      }}
    >
      {renderLeaderboardModal()}

      <div className="w-5xl mx-auto bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-2xl p-4 sm:p-8 flex-grow backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-3">
            <img 
              src="https://i.vgy.me/l2y7mr.png" 
              alt="Logo" 
              className="h-10 w-10 animate-pulse drop-shadow-[0_0_8px_#3b82f6]" 
            />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">EzMDT</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowLeaderboard(true)}
              className="p-2 rounded-lg bg-gray-100/70 dark:bg-gray-700/70 hover:bg-gray-200/70 dark:hover:bg-gray-600/70 transition-colors flex items-center gap-2"
              title="View Leaderboard"
            >
              <Trophy className="text-yellow-500" />
              <span className="sr-only sm:not-sr-only">Leaderboard</span>
            </button>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100/70 dark:bg-gray-700/70 hover:bg-gray-200/70 dark:hover:bg-gray-600/70 transition-colors"
            >
              {theme === 'light' ? <Moon className="text-gray-800" /> : <Sun className="text-yellow-400" />}
            </button>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 sm:gap-8 mb-6">
            <h2 className="text-xl font-semibold dark:text-white">
              {showPreview ? 'Report Preview' : `Step ${currentStep} of ${getMaxSteps()}`}
            </h2>

            <div className="flex flex-wrap justify-end sm:items-center gap-3 sm:gap-4">
              {(currentStep > 1 || showPreview) && (
                <button
                  onClick={prevStep}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center whitespace-nowrap"
                >
                  <ArrowLeft className="mr-2" size={18} />
                  Previous
                </button>
              )}

              {currentStep < getMaxSteps() && !showPreview && (
                <button
                  onClick={nextStep}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center whitespace-nowrap"
                >
                  Next
                  <ArrowRight className="ml-2" size={18} />
                </button>
              )}

              {currentStep === getMaxSteps() && !showPreview && (
                <>
                  <button
                    onClick={togglePreview}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center whitespace-nowrap"
                  >
                    <FileText className="mr-2" size={18} />
                    Preview
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center whitespace-nowrap"
                  >
                    <ClipboardCopy className="mr-2" size={18} />
                    Copy Report
                  </button>
                </>
              )}

              {showPreview && (
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center whitespace-nowrap"
                >
                                    <ClipboardCopy className="mr-2" size={18} />
                  Copy Report
                </button>
              )}
            </div>
          </div>

          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300 relative"
              style={{ width: `${(currentStep / getMaxSteps()) * 100}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg">
          {renderStep()}
        </div>
      </div>
      <footer className="text-center mt-10 mb-8 px-4">
        <div className="inline-flex flex-col items-center gap-1 text-gray-400 dark:text-gray-300 group hover:text-shadow-lg">
          <p className="text-sm transition-all duration-300 group-hover:text-gray-600 dark:group-hover:text-gray-200 
                        animate-pulse hover:animate-none">
            Crafted with <span className="text-red-500 hover:drop-shadow-[0_0_6px_rgba(239,68,68,0.6)] transition-all">♥</span> by 
            <span className="font-medium text-gray-700 dark:text-gray-100 ml-1 
                            hover:text-shadow-[0_0_8px_rgba(156,163,175,0.5)] dark:hover:text-shadow-[0_0_8px_rgba(229,231,235,0.3)]">
              RexDev & ByteSmith
            </span>
          </p>
          <p className="text-xs opacity-80 transition-all duration-300 group-hover:opacity-100 
                        group-hover:drop-shadow-[0_0_4px_rgba(156,163,175,0.3)] dark:group-hover:drop-shadow-[0_0_4px_rgba(209,213,219,0.2)]">
            Inspired by <span className="font-medium text-gray-600 dark:text-gray-200 
                                        hover:drop-shadow-[0_0_6px_rgba(107,114,128,0.4)] dark:hover:drop-shadow-[0_0_6px_rgba(229,231,235,0.3)]">
                          Crystal & DedX
                        </span>
          </p>
          <div className="w-8 h-px bg-gray-300 dark:bg-gray-600 mt-1 transition-all duration-500 group-hover:w-12 
                          group-hover:shadow-[0_0_6px_rgba(156,163,175,0.4)] dark:group-hover:shadow-[0_0_6px_rgba(209,213,219,0.3)]"></div>
        </div>
      </footer>
    </div>
  );
}

export default App;
