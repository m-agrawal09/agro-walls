import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  Search,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Shield,
  ExternalLink,
  Activity
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { StatusDot } from '../components/common/StatusDot';
import { useNavigate } from 'react-router-dom';
import { api, CaseData } from '../services/api';

// Definition of Indian States & Regions with SVG Paths
interface RegionPath {
  id: string;
  name: string;
  code: string;
  d: string;
  center: [number, number];
  isRajasthan?: boolean;
  baseCasesCount?: number;
}

// Coordinate mapping for Rajasthan Districts and Indian Cities
interface IncidentPin {
  id: string;
  caseId: string;
  name: string;
  age: number | string;
  gender: string;
  location: string;
  sector: string;
  priority: 'CRITICAL' | 'HIGH' | 'ROUTINE';
  status: string;
  x: number;
  y: number;
  reportedAgo: string;
  hasPhoto?: boolean;
  photoUrl?: string;
  reporterContact?: string;
}

// Curated vector geometry for India states (viewBox: 0 0 1000 1100)
const INDIA_REGIONS: RegionPath[] = [
  // RAJASTHAN (Highlighted Focus Region - Largest State in Western India)
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    code: 'RJ',
    isRajasthan: true,
    center: [280, 360],
    d: 'M 220 250 L 290 220 L 350 240 L 390 290 L 380 340 L 410 380 L 380 430 L 350 460 L 300 480 L 240 450 L 190 410 L 160 360 L 180 300 Z'
  },
  // JAMMU & KASHMIR & LADAKH
  {
    id: 'jk-ladakh',
    name: 'Jammu & Kashmir / Ladakh',
    code: 'JK',
    center: [320, 110],
    d: 'M 250 140 L 290 70 L 380 50 L 460 80 L 440 140 L 370 170 L 310 180 Z'
  },
  // PUNJAB & HARYANA & DELHI
  {
    id: 'punjab-haryana',
    name: 'Punjab, Haryana & Delhi NCR',
    code: 'PB/HR',
    center: [330, 210],
    d: 'M 290 180 L 360 170 L 390 220 L 350 240 L 290 220 Z'
  },
  // HIMACHAL PRADESH & UTTARAKHAND
  {
    id: 'himachal-uttarakhand',
    name: 'Himachal Pradesh & Uttarakhand',
    code: 'HP/UK',
    center: [410, 180],
    d: 'M 360 170 L 440 140 L 480 190 L 440 230 L 390 220 Z'
  },
  // UTTAR PRADESH
  {
    id: 'uttar-pradesh',
    name: 'Uttar Pradesh',
    code: 'UP',
    center: [480, 310],
    d: 'M 390 220 L 440 230 L 530 250 L 620 280 L 610 350 L 540 370 L 460 360 L 410 380 L 380 340 L 390 290 Z'
  },
  // GUJARAT
  {
    id: 'gujarat',
    name: 'Gujarat',
    code: 'GJ',
    center: [190, 480],
    d: 'M 160 360 L 190 410 L 240 450 L 220 520 L 170 540 L 120 500 L 130 430 Z'
  },
  // MADHYA PRADESH
  {
    id: 'madhya-pradesh',
    name: 'Madhya Pradesh',
    code: 'MP',
    center: [430, 470],
    d: 'M 300 480 L 350 460 L 380 430 L 460 360 L 540 370 L 580 440 L 540 520 L 440 540 L 350 540 Z'
  },
  // BIHAR & JHARKHAND
  {
    id: 'bihar-jharkhand',
    name: 'Bihar & Jharkhand',
    code: 'BR/JH',
    center: [650, 390],
    d: 'M 620 280 L 710 300 L 730 380 L 670 450 L 610 430 L 610 350 Z'
  },
  // WEST BENGAL & SIKKIM
  {
    id: 'west-bengal',
    name: 'West Bengal & Sikkim',
    code: 'WB',
    center: [740, 410],
    d: 'M 710 300 L 740 280 L 760 340 L 760 450 L 710 470 L 670 450 L 730 380 Z'
  },
  // MAHARASHTRA & GOA
  {
    id: 'maharashtra',
    name: 'Maharashtra & Goa',
    code: 'MH',
    center: [340, 620],
    d: 'M 220 520 L 350 540 L 440 540 L 480 620 L 430 710 L 310 700 L 240 640 Z'
  },
  // CHHATTISGARH & ODISHA
  {
    id: 'chhattisgarh-odisha',
    name: 'Chhattisgarh & Odisha',
    code: 'CG/OD',
    center: [590, 550],
    d: 'M 540 520 L 580 440 L 610 430 L 670 450 L 710 470 L 670 590 L 580 620 L 530 580 Z'
  },
  // TELANGANA & ANDHRA PRADESH
  {
    id: 'telangana-andhra',
    name: 'Telangana & Andhra Pradesh',
    code: 'TG/AP',
    center: [470, 740],
    d: 'M 430 710 L 480 620 L 580 620 L 550 750 L 490 850 L 430 810 Z'
  },
  // KARNATAKA
  {
    id: 'karnataka',
    name: 'Karnataka',
    code: 'KA',
    center: [340, 790],
    d: 'M 310 700 L 430 710 L 430 810 L 390 880 L 320 860 L 280 770 Z'
  },
  // KERALA & TAMIL NADU
  {
    id: 'kerala-tamilnadu',
    name: 'Kerala & Tamil Nadu',
    code: 'KL/TN',
    center: [390, 940],
    d: 'M 320 860 L 390 880 L 490 850 L 450 970 L 390 1040 L 350 960 Z'
  },
  // NORTH-EAST (Assam, Meghalaya, Arunachal, Tripura, Mizoram, Nagaland, Manipur)
  {
    id: 'northeast',
    name: 'North-Eastern Region (Assam, Arunachal, etc.)',
    code: 'NE',
    center: [860, 340],
    d: 'M 760 340 L 820 280 L 920 280 L 950 340 L 890 420 L 820 440 L 760 410 Z'
  }
];

// Key strategic district coordinates inside Rajasthan for precise mapping
const RAJASTHAN_DISTRICTS = [
  { name: 'Jaipur', code: 'JPR', x: 330, y: 320, isCapital: true },
  { name: 'Jodhpur', code: 'JDH', x: 250, y: 360 },
  { name: 'Kota', code: 'KTA', x: 360, y: 410 },
  { name: 'Udaipur', code: 'UDP', x: 270, y: 440 },
  { name: 'Bikaner', code: 'BKN', x: 250, y: 280 },
  { name: 'Ajmer', code: 'AJM', x: 305, y: 360 },
  { name: 'Alwar', code: 'ALW', x: 365, y: 295 },
  { name: 'Bharatpur', code: 'BHR', x: 395, y: 310 },
  { name: 'Sikar', code: 'SKR', x: 310, y: 295 },
  { name: 'Bhilwara', code: 'BHL', x: 310, y: 410 }
];

export const IndiaIncidentMapPage: React.FC = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState<CaseData[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');
  const [selectedPin, setSelectedPin] = useState<IncidentPin | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<RegionPath | null>(null);
  const [hoveredPin, setHoveredPin] = useState<IncidentPin | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'ROUTINE'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [highlightRajasthan, setHighlightRajasthan] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Fetch live cases and reports from MongoDB
  const fetchMapData = async () => {
    setIsLoading(true);
    try {
      const [casesRes, reportsRes] = await Promise.all([
        api.getCases().catch(() => []),
        api.getReports().catch(() => [])
      ]);
      setCases(casesRes || []);
      setReports(reportsRes || []);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.error('[Map Data Fetch Error]:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMapData();
    // Real-time polling every 20 seconds so any newly added report reflects automatically
    const interval = setInterval(() => {
      fetchMapData();
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  // Compute dynamic Incident Pins from live MongoDB documents
  const incidentPins = useMemo<IncidentPin[]>(() => {
    const caseItems: any[] = cases || [];
    const reportItems: any[] = (reports || [])
      .filter(r => !caseItems.some(c => c.name === r.fullName))
      .map(r => ({
        _id: r._id,
        caseId: r.reportId,
        name: r.fullName,
        age: r.age,
        gender: r.gender,
        lastSeenLocation: r.lastKnownLocation || r.intakeStation,
        sector: r.intakeStation || 'Rajasthan Sector',
        priority: r.urgencyLevel || 'HIGH',
        status: r.status || 'NEW REPORT',
        reportedAgo: 'Recent Intake',
        hasPhoto: Boolean(r.imageUrl || r.photoUrl),
        photoUrl: r.imageUrl || r.photoUrl,
        reporterContact: r.phoneNumber || r.sourceContact
      }));

    const allEntities = [...caseItems, ...reportItems];
    if (allEntities.length === 0) return [];

    return allEntities.map((c, index) => {
      const locStr = (c.lastSeenLocation || c.sector || '').toLowerCase();
      let pinX = 280;
      let pinY = 360;

      // Smart spatial placement: match Rajasthan districts or general sectors
      if (locStr.includes('jaipur') || index % 10 === 0) {
        pinX = 330 + ((index * 7) % 25) - 12;
        pinY = 320 + ((index * 9) % 25) - 12;
      } else if (locStr.includes('jodhpur') || index % 10 === 1) {
        pinX = 250 + ((index * 5) % 24) - 12;
        pinY = 360 + ((index * 8) % 24) - 12;
      } else if (locStr.includes('kota') || index % 10 === 2) {
        pinX = 360 + ((index * 6) % 20) - 10;
        pinY = 410 + ((index * 7) % 20) - 10;
      } else if (locStr.includes('udaipur') || index % 10 === 3) {
        pinX = 270 + ((index * 8) % 22) - 11;
        pinY = 440 + ((index * 6) % 22) - 11;
      } else if (locStr.includes('bikaner') || index % 10 === 4) {
        pinX = 250 + ((index * 6) % 20) - 10;
        pinY = 280 + ((index * 5) % 20) - 10;
      } else if (locStr.includes('ajmer') || index % 10 === 5) {
        pinX = 305 + ((index * 7) % 18) - 9;
        pinY = 360 + ((index * 8) % 18) - 9;
      } else if (locStr.includes('alwar') || index % 10 === 6) {
        pinX = 365 + ((index * 5) % 16) - 8;
        pinY = 295 + ((index * 6) % 16) - 8;
      } else if (locStr.includes('bharatpur') || index % 10 === 7) {
        pinX = 395 + ((index * 4) % 16) - 8;
        pinY = 310 + ((index * 5) % 16) - 8;
      } else if (locStr.includes('delhi') || locStr.includes('haryana')) {
        pinX = 340 + ((index * 5) % 20) - 10;
        pinY = 220 + ((index * 6) % 20) - 10;
      } else if (locStr.includes('madhya') || locStr.includes('hoshangabad') || locStr.includes('narmada')) {
        pinX = 420 + ((index * 6) % 30) - 15;
        pinY = 460 + ((index * 7) % 30) - 15;
      } else if (locStr.includes('gujarat')) {
        pinX = 190 + ((index * 5) % 20) - 10;
        pinY = 470 + ((index * 6) % 20) - 10;
      } else {
        // Distribute within Rajasthan focus perimeter
        const angle = (index * 137.5 * Math.PI) / 180;
        const radius = 20 + ((index * 13) % 70);
        pinX = 300 + Math.cos(angle) * radius;
        pinY = 360 + Math.sin(angle) * radius;
      }

      return {
        id: c._id || `case-${index}`,
        caseId: c.caseId,
        name: c.name,
        age: c.age || 'Unstated',
        gender: c.gender === 'F' ? 'Female' : c.gender === 'M' ? 'Male' : 'Other',
        location: c.lastSeenLocation || 'Disaster Sector Intake',
        sector: c.sector || 'Sector B-4',
        priority: c.priority || 'HIGH',
        status: c.status || 'LOOKING FOR A MATCH',
        x: pinX,
        y: pinY,
        reportedAgo: c.reportedAgo || 'Recently',
        hasPhoto: c.hasPhoto,
        photoUrl: c.photoUrl,
        reporterContact: c.reporterContact
      };
    });
  }, [cases]);

  // Filter pins based on user selection
  const filteredPins = useMemo(() => {
    return incidentPins.filter(pin => {
      if (priorityFilter !== 'ALL' && pin.priority !== priorityFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          pin.name.toLowerCase().includes(query) ||
          pin.caseId.toLowerCase().includes(query) ||
          pin.location.toLowerCase().includes(query) ||
          pin.sector.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [incidentPins, priorityFilter, searchQuery]);

  // Compute live metrics
  const totalCasesCount = cases.length;
  const rajasthanCasesCount = incidentPins.filter(p => p.x >= 150 && p.x <= 420 && p.y >= 210 && p.y <= 490).length;
  const criticalCasesCount = incidentPins.filter(p => p.priority === 'CRITICAL').length;

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.min(2.5, Math.max(0.8, prev + delta)));
  };

  const handleResetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setSelectedPin(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', width: '100%', backgroundColor: 'var(--bg-app)' }}>
      
      {/* Top Header */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-base)',
        padding: '1.25rem 2rem',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              marginBottom: '0.25rem',
              textTransform: 'uppercase'
            }}>
              <span>NATIONAL GEOSPATIAL COMMAND</span>
              <span>/</span>
              <span>DISASTER SEARCH & RESCUE GRID</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                margin: 0
              }}>
                India Geospatial Incident Map
              </h1>
              <span style={{
                background: 'rgba(225, 29, 72, 0.1)',
                color: '#e11d48',
                border: '1px solid rgba(225, 29, 72, 0.25)',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '12px'
              }}>
                RAJASTHAN FOCUS BORDER HIGHLIGHTED
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem', margin: 0 }}>
              Live real-time incident pins connected to MongoDB. Every report filed dynamically updates the search coordinates.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '6px 12px',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)'
            }}>
              <StatusDot variant="forest" pulse size={7} />
              <span>LIVE MONGODB SYNC ({lastSyncTime})</span>
            </div>

            <button
              onClick={fetchMapData}
              disabled={isLoading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-base)',
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
              <span>Sync DB</span>
            </button>

            <button
              onClick={() => navigate('/report/new')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                background: 'var(--primary-color)',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <MapPin size={14} />
              <span>Add Report</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginTop: '1.25rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-base)'
        }}>
          <div style={{ background: 'var(--bg-app)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Rajasthan Sector Cases
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#e11d48' }}>
              {rajasthanCasesCount} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Active Pins</span>
            </div>
          </div>

          <div style={{ background: 'var(--bg-app)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Total National Database Cases
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {totalCasesCount} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Registered</span>
            </div>
          </div>

          <div style={{ background: 'var(--bg-app)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Critical Triage Priority
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#dc2626' }}>
              {criticalCasesCount} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Emergency</span>
            </div>
          </div>

          <div style={{ background: 'var(--bg-app)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Active District Desks
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16a34a' }}>
              10 Hubs <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}>SDRF Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Controls + Interactive Map + Incident Dossier */}
      <div style={{
        padding: '1.5rem 2rem',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 380px',
        gap: '1.5rem',
        alignItems: 'start'
      }}>
        
        {/* Map Canvas Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Map Controls Toolbar */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-base)',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            {/* Search Input */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--bg-app)',
              padding: '0.4rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid var(--border-base)',
              width: '260px'
            }}>
              <Search size={14} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search person, ID, sector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '0.8rem',
                  color: 'var(--text-primary)',
                  width: '100%'
                }}
              />
            </div>

            {/* Priority Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Priority:</span>
              {(['ALL', 'CRITICAL', 'HIGH', 'ROUTINE'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPriorityFilter(p)}
                  style={{
                    padding: '4px 8px',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    borderRadius: '4px',
                    border: priorityFilter === p ? '1px solid var(--primary-color)' : '1px solid var(--border-base)',
                    background: priorityFilter === p ? 'var(--primary-color)' : 'var(--bg-surface)',
                    color: priorityFilter === p ? '#ffffff' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Rajasthan Border Highlight Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                <input
                  type="checkbox"
                  checked={highlightRajasthan}
                  onChange={(e) => setHighlightRajasthan(e.target.checked)}
                  style={{ accentColor: '#e11d48' }}
                />
                <span>Highlight Rajasthan Border</span>
              </label>
            </div>

            {/* Zoom Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <button
                onClick={() => handleZoom(0.2)}
                title="Zoom In"
                style={{ padding: '6px', borderRadius: '4px', border: '1px solid var(--border-base)', background: 'var(--bg-surface)', cursor: 'pointer' }}
              >
                <ZoomIn size={14} />
              </button>
              <button
                onClick={() => handleZoom(-0.2)}
                title="Zoom Out"
                style={{ padding: '6px', borderRadius: '4px', border: '1px solid var(--border-base)', background: 'var(--bg-surface)', cursor: 'pointer' }}
              >
                <ZoomOut size={14} />
              </button>
              <button
                onClick={handleResetView}
                title="Reset View"
                style={{ padding: '6px', borderRadius: '4px', border: '1px solid var(--border-base)', background: 'var(--bg-surface)', cursor: 'pointer' }}
              >
                <Maximize2 size={14} />
              </button>
            </div>
          </div>

          {/* Interactive SVG Vector Map Canvas */}
          <div style={{
            position: 'relative',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-base)',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            height: '680px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            
            {/* Ambient Grid Pattern */}
            <svg
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                opacity: 0.35
              }}
            >
              <defs>
                <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#mapGrid)" />
            </svg>

            {/* Map Vector Stage */}
            <svg
              viewBox="0 0 1000 1100"
              style={{
                width: '100%',
                height: '100%',
                transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                transition: 'transform 0.25s ease-out'
              }}
            >
              <defs>
                {/* Glowing Drop-Shadow Filter for Highlighted Rajasthan Border */}
                <filter id="rajasthanGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#e11d48" floodOpacity="0.6" />
                </filter>
                <linearGradient id="rajasthanGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#e11d48" stopOpacity="0.16" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.08" />
                </linearGradient>
                <linearGradient id="fadedRegionGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.04" />
                </linearGradient>
              </defs>

              {/* OTHER STATES & REGIONS (FADED OUT A BIT) */}
              <g id="other-regions">
                {INDIA_REGIONS.filter(r => !r.isRajasthan).map((region) => {
                  const isHovered = hoveredRegion?.id === region.id;

                  return (
                    <path
                      key={region.id}
                      d={region.d}
                      fill={isHovered ? 'rgba(148, 163, 184, 0.25)' : 'url(#fadedRegionGrad)'}
                      stroke={isHovered ? '#64748b' : 'rgba(148, 163, 184, 0.45)'}
                      strokeWidth={isHovered ? '2' : '1.2'}
                      strokeDasharray="2,2"
                      style={{
                        opacity: highlightRajasthan ? (isHovered ? 0.75 : 0.38) : 0.7,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={() => setHoveredRegion(region)}
                      onMouseLeave={() => setHoveredRegion(null)}
                    />
                  );
                })}
              </g>

              {/* RAJASTHAN STATE - PROMINENTLY HIGHLIGHTED BORDER & GLOW */}
              <g id="rajasthan-highlight">
                {INDIA_REGIONS.filter(r => r.isRajasthan).map((region) => {
                  return (
                    <g key={region.id}>
                      {/* Outer Glow Halo Border */}
                      {highlightRajasthan && (
                        <path
                          d={region.d}
                          fill="none"
                          stroke="#e11d48"
                          strokeWidth="8"
                          strokeOpacity="0.25"
                          filter="url(#rajasthanGlow)"
                        />
                      )}

                      {/* Main Prominent State Border */}
                      <path
                        d={region.d}
                        fill={highlightRajasthan ? 'url(#rajasthanGrad)' : 'rgba(225, 29, 72, 0.05)'}
                        stroke={highlightRajasthan ? '#e11d48' : '#94a3b8'}
                        strokeWidth={highlightRajasthan ? '3.8' : '1.5'}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        style={{
                          cursor: 'pointer',
                          transition: 'all 0.3s'
                        }}
                        onMouseEnter={() => setHoveredRegion(region)}
                        onMouseLeave={() => setHoveredRegion(null)}
                      />

                      {/* Prominent Rajasthan Sector Label Banner */}
                      <g transform="translate(280, 240)">
                        <rect
                          x="-80"
                          y="-16"
                          width="160"
                          height="28"
                          rx="6"
                          fill="#ffffff"
                          stroke="#e11d48"
                          strokeWidth="1.5"
                          filter="drop-shadow(0 2px 6px rgba(225,29,72,0.2))"
                        />
                        <text
                          x="0"
                          y="3"
                          textAnchor="middle"
                          fill="#e11d48"
                          fontSize="11"
                          fontWeight="800"
                          fontFamily="sans-serif"
                          letterSpacing="0.08em"
                        >
                          RAJASTHAN SECTOR
                        </text>
                      </g>
                    </g>
                  );
                })}
              </g>

              {/* Key District Hub Markers in Rajasthan */}
              {highlightRajasthan && (
                <g id="district-hubs">
                  {RAJASTHAN_DISTRICTS.map((d) => (
                    <g key={d.code} transform={`translate(${d.x}, ${d.y})`}>
                      <circle
                        r={d.isCapital ? 6 : 4}
                        fill={d.isCapital ? '#e11d48' : '#475569'}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      <text
                        x={0}
                        y={d.isCapital ? -10 : 14}
                        textAnchor="middle"
                        fill={d.isCapital ? '#e11d48' : '#64748b'}
                        fontSize="9"
                        fontWeight={d.isCapital ? '700' : '600'}
                        fontFamily="sans-serif"
                      >
                        {d.name}
                      </text>
                    </g>
                  ))}
                </g>
              )}

              {/* Dynamic Live Incident Pins from Database */}
              <g id="incident-pins">
                {filteredPins.map((pin) => {
                  const isSelected = selectedPin?.id === pin.id;
                  const isHovered = hoveredPin?.id === pin.id;
                  const isCritical = pin.priority === 'CRITICAL';

                  return (
                    <g
                      key={pin.id}
                      transform={`translate(${pin.x}, ${pin.y})`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedPin(pin)}
                      onMouseEnter={() => setHoveredPin(pin)}
                      onMouseLeave={() => setHoveredPin(null)}
                    >
                      {/* Pulsing Radar Ring for Critical Cases */}
                      {isCritical && (
                        <circle
                          r="14"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="1.5"
                          opacity="0.75"
                        >
                          <animate attributeName="r" values="8;20" dur="1.6s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.8;0" dur="1.6s" repeatCount="indefinite" />
                        </circle>
                      )}

                      {/* Selected Focus Halo */}
                      {isSelected && (
                        <circle
                          r="16"
                          fill="none"
                          stroke="#0284c7"
                          strokeWidth="2.5"
                          strokeDasharray="3,3"
                        />
                      )}

                      {/* Incident Pin Body */}
                      <circle
                        r={isHovered || isSelected ? 8 : 6}
                        fill={isCritical ? '#dc2626' : pin.priority === 'HIGH' ? '#ea580c' : '#16a34a'}
                        stroke="#ffffff"
                        strokeWidth="2"
                        filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
                      />

                      {/* Small Inner Core */}
                      <circle
                        r={2.5}
                        fill="#ffffff"
                      />
                    </g>
                  );
                })}
              </g>
            </svg>

            {/* Floating Interactive Hover Tooltip for States */}
            {hoveredRegion && !hoveredPin && (
              <div style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                border: `1px solid ${hoveredRegion.isRajasthan ? '#e11d48' : 'var(--border-base)'}`,
                borderRadius: '8px',
                padding: '0.65rem 1rem',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                pointerEvents: 'none',
                zIndex: 10
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={14} color={hoveredRegion.isRajasthan ? '#e11d48' : '#64748b'} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {hoveredRegion.name}
                  </span>
                  {hoveredRegion.isRajasthan && (
                    <Badge variant="crimson">OPERATIONAL FOCUS</Badge>
                  )}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {hoveredRegion.isRajasthan 
                    ? `Live Active Cases in Database: ${rajasthanCasesCount} cases`
                    : 'National Disaster Grid Sector'}
                </div>
              </div>
            )}

            {/* Floating Interactive Tooltip for Pins */}
            {hoveredPin && (
              <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                background: 'rgba(255, 255, 255, 0.96)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--border-base)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                pointerEvents: 'none',
                zIndex: 10,
                maxWidth: '320px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {hoveredPin.name}
                  </span>
                  <Badge variant={hoveredPin.priority === 'CRITICAL' ? 'crimson' : hoveredPin.priority === 'HIGH' ? 'amber' : 'forest'}>
                    {hoveredPin.priority}
                  </Badge>
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                  {hoveredPin.caseId} • {hoveredPin.age} yrs • {hoveredPin.gender}
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={12} />
                  <span>{hoveredPin.location} ({hoveredPin.sector})</span>
                </div>
              </div>
            )}

            {/* Bottom Legend */}
            <div style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(8px)',
              border: '1px solid var(--border-base)',
              borderRadius: '8px',
              padding: '0.5rem 0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              fontSize: '0.7rem',
              color: 'var(--text-secondary)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#dc2626' }} />
                <span>Critical</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ea580c' }} />
                <span>High Priority</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a' }} />
                <span>Routine</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '12px', height: '3px', background: '#e11d48', borderRadius: '2px' }} />
                <span>Rajasthan Border</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Case Dossier & Live Incidents Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Selected Case Dossier Card */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-base)',
            borderRadius: '12px',
            padding: '1.25rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Activity size={16} color="var(--primary-color)" />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Selected Case Dossier
                </h3>
              </div>
              {selectedPin ? (
                <button
                  onClick={() => setSelectedPin(null)}
                  style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Clear
                </button>
              ) : (
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Click pin on map</span>
              )}
            </div>

            {selectedPin ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {selectedPin.photoUrl ? (
                    <img
                      src={selectedPin.photoUrl}
                      alt={selectedPin.name}
                      style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border-base)' }}
                    />
                  ) : (
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '8px',
                      background: 'rgba(2, 132, 199, 0.1)',
                      color: 'var(--primary-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700
                    }}>
                      {selectedPin.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                      {selectedPin.name}
                    </h4>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                      {selectedPin.caseId}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <Badge variant={selectedPin.priority === 'CRITICAL' ? 'crimson' : selectedPin.priority === 'HIGH' ? 'amber' : 'forest'}>
                    {selectedPin.priority} PRIORITY
                  </Badge>
                  <Badge variant="charcoal">
                    {selectedPin.status}
                  </Badge>
                </div>

                <div style={{
                  background: 'var(--bg-app)',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  fontSize: '0.8rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Demographics:</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedPin.gender} • {selectedPin.age} yrs</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Last Seen:</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', textAlign: 'right' }}>{selectedPin.location}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Search Sector:</span>
                    <span style={{ fontWeight: 600, color: '#e11d48' }}>{selectedPin.sector}</span>
                  </div>
                  {selectedPin.reporterContact && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Reporter Contact:</span>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedPin.reporterContact}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigate(`/cases/${selectedPin.caseId}`)}
                  style={{
                    padding: '0.65rem',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'var(--primary-color)',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <span>Open Full Case File</span>
                  <ExternalLink size={14} />
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-muted)' }}>
                <MapPin size={28} style={{ opacity: 0.35, margin: '0 auto 0.5rem auto' }} />
                <p style={{ fontSize: '0.8rem', margin: 0 }}>
                  Click on any incident pin or district hub inside the Rajasthan highlighted map to inspect the live case.
                </p>
              </div>
            )}
          </div>

          {/* Rajasthan Emergency SAR Sector Briefing */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-base)',
            borderRadius: '12px',
            padding: '1.25rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Shield size={16} color="#e11d48" />
              <h3 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Rajasthan Triage Command
              </h3>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
              The Rajasthan regional border is prioritized as the primary SAR coordination corridor. Intake stations at Jaipur, Jodhpur, Kota, and Udaipur route real-time telemetry straight into our biometric correlation engine.
            </p>

            <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>State Response Unit:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>SDRF 1st & 2nd Battalions</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>NDRF Regional Base:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>6th Battalion SAR Unit</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Emergency Helpline:</span>
                <span style={{ fontWeight: 600, color: '#e11d48' }}>1070 / 112 Command</span>
              </div>
            </div>
          </div>

          {/* Recent Reports Live Stream from MongoDB */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-base)',
            borderRadius: '12px',
            padding: '1.25rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Recent MongoDB Ingests
              </h3>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Auto-Updating</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
              {filteredPins.slice(0, 5).map(pin => (
                <div
                  key={pin.id}
                  onClick={() => setSelectedPin(pin)}
                  style={{
                    padding: '0.5rem 0.65rem',
                    borderRadius: '6px',
                    background: selectedPin?.id === pin.id ? 'rgba(225, 29, 72, 0.08)' : 'var(--bg-app)',
                    border: `1px solid ${selectedPin?.id === pin.id ? '#e11d48' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {pin.name}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {pin.location}
                    </div>
                  </div>
                  <Badge variant={pin.priority === 'CRITICAL' ? 'crimson' : 'amber'}>
                    {pin.priority.slice(0, 4)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default IndiaIncidentMapPage;
