import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  MapPin,
  Search,
  RefreshCw,
  ExternalLink,
  Shield,
  Activity
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Badge } from '../components/common/Badge';
import { StatusDot } from '../components/common/StatusDot';
import { useNavigate } from 'react-router-dom';
import { api, CaseData } from '../services/api';

// District spatial anchors in Rajasthan
interface DistrictAnchor {
  name: string;
  code: string;
  lat: number;
  lng: number;
  sector: string;
}

const RAJASTHAN_DISTRICTS: DistrictAnchor[] = [
  { name: 'Jaipur', code: 'JPR', lat: 26.9124, lng: 75.7873, sector: 'Central Capital Sector' },
  { name: 'Jodhpur', code: 'JDH', lat: 26.2389, lng: 73.0243, sector: 'Western Desert Command' },
  { name: 'Kota', code: 'KTA', lat: 25.2138, lng: 75.8648, sector: 'Chambal River Sector' },
  { name: 'Udaipur', code: 'UDP', lat: 24.5854, lng: 73.7125, sector: 'Mewar Highland Sector' },
  { name: 'Bikaner', code: 'BKN', lat: 28.0229, lng: 73.3119, sector: 'North Thar Outpost' },
  { name: 'Ajmer', code: 'AJM', lat: 26.4499, lng: 74.6399, sector: 'Aravalli Hub' },
  { name: 'Alwar', code: 'ALW', lat: 27.5530, lng: 76.6346, sector: 'NCR Border Sector' },
  { name: 'Bharatpur', code: 'BHR', lat: 27.2152, lng: 77.5030, sector: 'Eastern Gateway' },
  { name: 'Sikar', code: 'SKR', lat: 27.6094, lng: 75.1398, sector: 'Shekhawati Post' },
  { name: 'Bhilwara', code: 'BHL', lat: 25.3407, lng: 74.6313, sector: 'Industrial Relief Grid' }
];

type TileTheme = 'STREETS' | 'DARK' | 'SATELLITE';

export const IndiaIncidentMapPage: React.FC = () => {
  const navigate = useNavigate();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const boundaryLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [tileTheme, setTileTheme] = useState<TileTheme>('STREETS');
  const [cases, setCases] = useState<CaseData[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');
  const [selectedCase, setSelectedCase] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'ROUTINE'>('ALL');
  const [geoData, setGeoData] = useState<any | null>(null);

  // Fetch live cases & reports from MongoDB
  const fetchLiveData = async () => {
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
      console.error('[Map Sync Error]:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data load + 15s auto-polling to immediately reflect newly added reports
  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 15000);
    return () => clearInterval(interval);
  }, []);

  // Fetch official Rajasthan boundary GeoJSON
  useEffect(() => {
    fetch('/rajasthan.geojson')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error('Failed to load rajasthan.geojson:', err));
  }, []);

  // Tile URL mapping
  const getTileUrl = (theme: TileTheme) => {
    switch (theme) {
      case 'DARK':
        return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      case 'SATELLITE':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'STREETS':
      default:
        return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center on Rajasthan (Latitude ~26.5°N, Longitude ~74.0°E)
    const map = L.map(mapContainerRef.current, {
      center: [26.5, 74.0],
      zoom: 6.8,
      minZoom: 5,
      maxZoom: 14,
      zoomControl: false // custom zoom buttons
    });

    const tileLayer = L.tileLayer(getTileUrl(tileTheme), {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    markersLayerGroupRef.current = L.layerGroup().addTo(map);
    boundaryLayerGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when tileTheme changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    tileLayerRef.current.setUrl(getTileUrl(tileTheme));
  }, [tileTheme]);

  // Render Rajasthan Glowing Border + Mask Out Faded Regions of India/World
  useEffect(() => {
    if (!mapInstanceRef.current || !boundaryLayerGroupRef.current || !geoData) return;
    const group = boundaryLayerGroupRef.current;
    group.clearLayers();

    try {
      const coords = geoData.geometry.coordinates[0];
      // Convert GeoJSON [lng, lat] to Leaflet [lat, lng]
      const rajasthanLatLngs: [number, number][] = coords.map((c: [number, number]) => [c[1], c[0]]);

      // Inverted World Polygon: Darkens and fades everything outside Rajasthan
      const worldOuterRing: [number, number][] = [
        [-90, -180],
        [-90, 180],
        [90, 180],
        [90, -180],
        [-90, -180]
      ];

      // Mask Polygon (Dark overlay over all other regions outside Rajasthan)
      L.polygon([worldOuterRing, rajasthanLatLngs], {
        fillColor: tileTheme === 'DARK' ? '#020617' : '#0f172a',
        fillOpacity: tileTheme === 'DARK' ? 0.82 : 0.62,
        stroke: false,
        interactive: false
      }).addTo(group);

      // MULTI-LAYER GLOWING CYAN/BLUE BORDER AROUND RAJASTHAN (Like Reference Image)
      // 1. Broad outer atmospheric halo
      L.polygon(rajasthanLatLngs, {
        color: '#38bdf8',
        weight: 14,
        opacity: 0.3,
        fill: false,
        lineCap: 'round',
        lineJoin: 'round',
        interactive: false
      }).addTo(group);

      // 2. Mid intense neon glow
      L.polygon(rajasthanLatLngs, {
        color: '#0284c7',
        weight: 7,
        opacity: 0.7,
        fill: false,
        lineCap: 'round',
        lineJoin: 'round',
        interactive: false
      }).addTo(group);

      // 3. Crisp inner boundary line
      L.polygon(rajasthanLatLngs, {
        color: '#e0f2fe',
        weight: 2.5,
        opacity: 1.0,
        fill: false,
        lineCap: 'round',
        lineJoin: 'round',
        interactive: false
      }).addTo(group);

    } catch (err) {
      console.error('Error drawing boundary mask:', err);
    }
  }, [geoData, tileTheme]);

  // Combine Live Database Cases + Reports
  const allIncidents = useMemo(() => {
    const caseItems = cases || [];
    const reportItems = (reports || [])
      .filter(r => !caseItems.some(c => c.name === r.fullName))
      .map((r, idx) => ({
        _id: r._id || `rep-${idx}`,
        caseId: r.reportId,
        name: r.fullName,
        age: r.age,
        gender: r.gender,
        lastSeenLocation: r.lastKnownLocation || r.intakeStation || 'Rajasthan Focus Sector',
        sector: r.intakeStation || 'Central Intake Desk',
        priority: r.urgencyLevel || 'HIGH',
        status: r.status || 'NEW REPORT',
        reportedAgo: 'Just now',
        hasPhoto: Boolean(r.imageUrl || r.photoUrl),
        photoUrl: r.imageUrl || r.photoUrl,
        reporterContact: r.phoneNumber || r.sourceContact
      }));

    return [...caseItems, ...reportItems];
  }, [cases, reports]);

  // Filtered list
  const filteredIncidents = useMemo(() => {
    return allIncidents.filter(inc => {
      if (filterPriority !== 'ALL' && inc.priority !== filterPriority) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          inc.name?.toLowerCase().includes(q) ||
          inc.caseId?.toLowerCase().includes(q) ||
          inc.lastSeenLocation?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allIncidents, filterPriority, searchQuery]);

  // Group incidents into Rajasthan district clusters & individual pins
  const { clusters } = useMemo(() => {
    const counts: Record<string, any[]> = {};
    RAJASTHAN_DISTRICTS.forEach(d => { counts[d.code] = []; });

    filteredIncidents.forEach((item, index) => {
      const loc = (item.lastSeenLocation || '').toLowerCase();
      let matchedCode = 'JPR';

      if (loc.includes('jodhpur')) matchedCode = 'JDH';
      else if (loc.includes('kota')) matchedCode = 'KTA';
      else if (loc.includes('udaipur')) matchedCode = 'UDP';
      else if (loc.includes('bikaner')) matchedCode = 'BKN';
      else if (loc.includes('ajmer')) matchedCode = 'AJM';
      else if (loc.includes('alwar')) matchedCode = 'ALW';
      else if (loc.includes('bharatpur')) matchedCode = 'BHR';
      else if (loc.includes('sikar')) matchedCode = 'SKR';
      else if (loc.includes('bhilwara')) matchedCode = 'BHL';
      else {
        // Distribute mathematically across Rajasthan districts
        matchedCode = RAJASTHAN_DISTRICTS[index % RAJASTHAN_DISTRICTS.length].code;
      }

      counts[matchedCode].push(item);
    });

    const clusterList = RAJASTHAN_DISTRICTS.map(d => ({
      ...d,
      items: counts[d.code],
      count: counts[d.code].length
    }));

    return { clusters: clusterList };
  }, [filteredIncidents]);

  // Plot Interactive Clusters & Pins onto Leaflet Map (Matching Reference Image)
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerGroupRef.current) return;
    const group = markersLayerGroupRef.current;
    group.clearLayers();

    clusters.forEach((c) => {
      if (c.count === 0) return;

      const isLarge = c.count >= 10;
      const sizePx = isLarge ? 58 : 46;

      // Custom HTML Marker matching the screenshot design (Red circular glowing disc with count + code)
      const clusterIcon = L.divIcon({
        className: 'custom-crime-cluster',
        html: `
          <div style="
            position: relative;
            width: ${sizePx}px;
            height: ${sizePx}px;
            display: flex;
            align-items: center;
            justifyContent: center;
            cursor: pointer;
          ">
            <!-- Pulsing outer glow ring -->
            <div style="
              position: absolute;
              width: 100%;
              height: 100%;
              border-radius: 50%;
              background: rgba(225, 29, 72, 0.28);
              box-shadow: 0 0 16px rgba(225, 29, 72, 0.6);
              animation: clusterPulse 2s infinite ease-in-out;
            "></div>

            <!-- Solid inner disc -->
            <div style="
              position: relative;
              width: ${sizePx - 10}px;
              height: ${sizePx - 10}px;
              border-radius: 50%;
              background: linear-gradient(135deg, #e11d48 0%, #9f1239 100%);
              border: 2px solid rgba(255, 255, 255, 0.9);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
              display: flex;
              flex-direction: column;
              align-items: center;
              justifyContent: center;
              color: #ffffff;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              text-align: center;
            ">
              <span style="font-size: ${isLarge ? 15 : 13}px; font-weight: 800; line-height: 1;">${c.count}</span>
              <span style="font-size: 8px; font-weight: 700; opacity: 0.9; letter-spacing: 0.05em; margin-top: 1px;">${c.code}</span>
            </div>
          </div>
        `,
        iconSize: [sizePx, sizePx],
        iconAnchor: [sizePx / 2, sizePx / 2]
      });

      const marker = L.marker([c.lat, c.lng], { icon: clusterIcon }).addTo(group);

      // Interactive Tooltip & Click Event
      marker.bindTooltip(`
        <div style="padding: 4px 6px; font-family: sans-serif;">
          <div style="font-weight: 700; font-size: 13px; color: #e11d48;">${c.name} District Cluster</div>
          <div style="font-size: 11px; color: #475569; margin-top: 2px;">
            ${c.count} Live Ingest Records (${c.sector})
          </div>
          <div style="font-size: 10px; color: #0284c7; font-weight: 600; margin-top: 3px;">
            Click to view district case files
          </div>
        </div>
      `, { offset: [0, -20], direction: 'top' });

      marker.on('click', () => {
        if (c.items[0]) {
          setSelectedCase(c.items[0]);
        }
      });

      // Also render small child satellite pins around the cluster center for individual cases
      c.items.slice(0, 4).forEach((childCase, idx) => {
        const offsetAngle = (idx * (360 / 4) + 25) * (Math.PI / 180);
        const offsetDist = 0.22 + (idx * 0.04);
        const childLat = c.lat + Math.sin(offsetAngle) * offsetDist;
        const childLng = c.lng + Math.cos(offsetAngle) * offsetDist;

        const isChildCritical = childCase.priority === 'CRITICAL';
        const childIcon = L.divIcon({
          className: 'child-satellite-pin',
          html: `
            <div style="
              width: 26px;
              height: 26px;
              border-radius: 50%;
              background: ${isChildCritical ? '#dc2626' : '#0284c7'};
              border: 1.5px solid #ffffff;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justifyContent: center;
              color: #ffffff;
              font-size: 10px;
              font-weight: 800;
              cursor: pointer;
            ">
              ${idx + 1}
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        });

        const childMarker = L.marker([childLat, childLng], { icon: childIcon }).addTo(group);
        childMarker.bindTooltip(`
          <div style="font-family: sans-serif; padding: 2px 4px;">
            <strong>${childCase.name}</strong> (${childCase.caseId})
            <div style="font-size: 11px; color: #64748b;">${childCase.lastSeenLocation}</div>
          </div>
        `, { offset: [0, -12], direction: 'top' });

        childMarker.on('click', () => {
          setSelectedCase(childCase);
        });
      });
    });
  }, [clusters]);

  // Zoom helpers
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();

  // Active metrics
  const totalCount = allIncidents.length;
  const criticalCount = allIncidents.filter(i => i.priority === 'CRITICAL').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', width: '100%', backgroundColor: 'var(--bg-app)' }}>
      
      {/* Animation Style for Cluster Pulse */}
      <style>{`
        @keyframes clusterPulse {
          0% { transform: scale(0.9); opacity: 0.8; }
          50% { transform: scale(1.3); opacity: 0.2; }
          100% { transform: scale(0.9); opacity: 0.8; }
        }
        .leaflet-container {
          background: #090d16 !important;
          font-family: inherit;
        }
      `}</style>

      {/* Top Header Card */}
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
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem'
            }}>
              <span>Rajasthan Live Incident Map</span>
              <span style={{
                background: 'rgba(225, 29, 72, 0.1)',
                color: '#e11d48',
                border: '1px solid rgba(225, 29, 72, 0.3)',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '12px'
              }}>
                STATE BORDER HIGHLIGHTED
              </span>
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem', margin: 0 }}>
              District Overview • Real-Time Feed from MongoDB Atlas (Other Regions Faded)
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
              onClick={fetchLiveData}
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
              <span>+ Add Report</span>
            </button>
          </div>
        </div>

        {/* Search & Priority Filter Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginTop: '1rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-base)'
        }}>
          {/* Search Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--bg-app)',
            padding: '0.4rem 0.85rem',
            borderRadius: '8px',
            border: '1px solid var(--border-base)',
            width: '320px'
          }}>
            <Search size={14} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search person name, ID, sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.82rem',
                color: 'var(--text-primary)',
                width: '100%'
              }}
            />
          </div>

          {/* Priority Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Priority:</span>
            {(['ALL', 'CRITICAL', 'HIGH', 'ROUTINE'] as const).map(p => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: filterPriority === p ? '1px solid var(--primary-color)' : '1px solid var(--border-base)',
                  background: filterPriority === p ? 'var(--primary-color)' : 'var(--bg-surface)',
                  color: filterPriority === p ? '#ffffff' : 'var(--text-secondary)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Layout Section */}
      <div style={{
        padding: '1.5rem 2rem',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 380px',
        gap: '1.5rem',
        alignItems: 'start'
      }}>
        
        {/* MAP CONTAINER (Matches Reference Images) */}
        <div style={{
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid var(--border-base)',
          height: '680px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          backgroundColor: '#090d16'
        }}>
          
          {/* TOP-LEFT LIVE PILL BADGE (Matching Screenshot) */}
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            zIndex: 1000,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            borderRadius: '20px',
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
            border: '1px solid rgba(0,0,0,0.08)'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#16a34a',
              boxShadow: '0 0 8px #16a34a',
              animation: 'pulse 1.5s infinite'
            }} />
            <span style={{
              fontSize: '0.82rem',
              fontWeight: 800,
              fontFamily: 'monospace',
              letterSpacing: '0.04em',
              color: '#1e293b'
            }}>
              LIVE • {totalCount} REPORTS
            </span>
          </div>

          {/* TOP-RIGHT TILE LAYER SWITCHER (Matching Screenshot: STREETS | DARK | SATELLITE) */}
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 1000,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            borderRadius: '8px',
            padding: '4px',
            display: 'flex',
            gap: '4px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
            border: '1px solid rgba(0,0,0,0.08)'
          }}>
            {(['STREETS', 'DARK', 'SATELLITE'] as TileTheme[]).map(theme => (
              <button
                key={theme}
                onClick={() => setTileTheme(theme)}
                style={{
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  fontFamily: 'monospace',
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  background: tileTheme === theme ? '#2563eb' : 'transparent',
                  color: tileTheme === theme ? '#ffffff' : '#64748b',
                  transition: 'all 0.2s'
                }}
              >
                {theme}
              </button>
            ))}
          </div>

          {/* BOTTOM-RIGHT ZOOM BUTTONS (+ / -) */}
          <div style={{
            position: 'absolute',
            bottom: '60px',
            right: '16px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <button
              onClick={handleZoomIn}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.1)',
                background: 'rgba(255, 255, 255, 0.95)',
                color: '#1e293b',
                fontSize: '18px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            >
              +
            </button>
            <button
              onClick={handleZoomOut}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.1)',
                background: 'rgba(255, 255, 255, 0.95)',
                color: '#1e293b',
                fontSize: '18px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            >
              −
            </button>
          </div>

          {/* BOTTOM BAR (ACTIVE | HIGH RISK | HOTSPOTS) */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            background: 'rgba(255, 255, 255, 0.95)',
            borderTop: '1px solid var(--border-base)',
            padding: '8px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            fontFamily: 'monospace',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#475569'
          }}>
            <div>
              ACTIVE: <span style={{ color: '#2563eb' }}>{totalCount}</span>
            </div>
            <div>
              HIGH RISK: <span style={{ color: '#dc2626' }}>{criticalCount}</span>
            </div>
            <div>
              HOTSPOTS: <span style={{ color: '#e11d48' }}>10 DISTRICTS</span>
            </div>
          </div>

          {/* REAL LEAFLET MAP ELEMENT */}
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
        </div>

        {/* SIDEBAR: Selected Case Dossier & Live Database Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Selected Case Dossier */}
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
              {selectedCase && (
                <button
                  onClick={() => setSelectedCase(null)}
                  style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Clear
                </button>
              )}
            </div>

            {selectedCase ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {selectedCase.photoUrl ? (
                    <img
                      src={selectedCase.photoUrl}
                      alt={selectedCase.name}
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
                      {selectedCase.name?.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                      {selectedCase.name}
                    </h4>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                      {selectedCase.caseId}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <Badge variant={selectedCase.priority === 'CRITICAL' ? 'crimson' : selectedCase.priority === 'HIGH' ? 'amber' : 'forest'}>
                    {selectedCase.priority} PRIORITY
                  </Badge>
                  <Badge variant="charcoal">
                    {selectedCase.status}
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
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {selectedCase.gender || 'Unknown'} • {selectedCase.age ? `${selectedCase.age} yrs` : 'Age unstated'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Location:</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', textAlign: 'right' }}>
                      {selectedCase.lastSeenLocation}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Disaster Sector:</span>
                    <span style={{ fontWeight: 600, color: '#e11d48' }}>
                      {selectedCase.sector}
                    </span>
                  </div>
                  {selectedCase.reporterContact && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Contact:</span>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {selectedCase.reporterContact}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigate(`/cases/${selectedCase.caseId}`)}
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
                  Click on any district cluster or satellite pin inside the highlighted Rajasthan map to inspect live case details.
                </p>
              </div>
            )}
          </div>

          {/* Operational Sector Overview */}
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
                Rajasthan State Command
              </h3>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
              Official administrative boundary highlighted with blue/cyan luminescence. Outer national zones are masked with ambient darkness to isolate field triage.
            </p>

            <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Active Hubs:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Jaipur, Jodhpur, Kota, Udaipur</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Response Units:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>SDRF 1st Bn & NDRF 6th Bn</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Disaster Helpline:</span>
                <span style={{ fontWeight: 600, color: '#e11d48' }}>1070 / 112 Command</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default IndiaIncidentMapPage;
