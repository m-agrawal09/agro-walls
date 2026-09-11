import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  Play, 
  Pause, 
  RotateCcw, 
  Users, 
  ExternalLink, 
  X, 
  ArrowRight
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export interface GraphNode {
  id: string;
  name: string;
  type: 'PERSON' | 'FACILITY' | 'CITIZEN' | 'SECTOR' | 'CANDIDATE';
  categoryLabel: string;
  sublabel: string;
  color: string;
  size: number;
  sector?: string;
  status?: string;
  priority?: string;
  details?: Record<string, any>;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  isDragging?: boolean;
}

export interface GraphLink {
  source: string;
  target: string;
  type: 'FAMILY_INTAKE' | 'LAST_SEEN_AT' | 'SHELTERED_IN' | 'BIOMETRIC_MATCH' | 'FIELD_SIGHTING' | 'DUPLICATE_CLUSTER' | 'RESCUE_TRANSIT';
  label: string;
  reason: string;
  confidence?: number;
  strength?: number;
}

export const ConnectionGraphPage: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [hoveredLink, setHoveredLink] = useState<GraphLink | null>(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [physicsEnabled, setPhysicsEnabled] = useState<boolean>(true);

  // Pan & Zoom
  const [transform, setTransform] = useState<{ x: number; y: number; k: number }>({ x: 0, y: 0, k: 1 });
  const isPanningRef = useRef<boolean>(false);
  const startPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const draggedNodeRef = useRef<GraphNode | null>(null);

  // Fetch graph data from MongoDB backend
  useEffect(() => {
    setLoading(true);
    api.getNetworkGraph()
      .then((data) => {
        if (data && Array.isArray(data.nodes) && data.nodes.length > 0) {
          // Initialize random coordinates around center
          const width = 1000;
          const height = 700;
          const initializedNodes = data.nodes.map((n: GraphNode, i: number) => {
            const angle = (i / data.nodes.length) * 2 * Math.PI;
            const dist = 150 + Math.random() * 200;
            return {
              ...n,
              x: width / 2 + Math.cos(angle) * dist,
              y: height / 2 + Math.sin(angle) * dist,
              vx: 0,
              vy: 0,
            };
          });
          setNodes(initializedNodes);
          setLinks(data.links || []);
          if (initializedNodes.length > 0) {
            setSelectedNode(initializedNodes[0]);
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load network graph from API:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Filtered nodes & links
  const { filteredNodes, filteredLinks } = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const visibleNodes = nodes.filter((n) => {
      // Sector filter
      if (sectorFilter !== 'ALL' && n.sector && !n.sector.toLowerCase().includes(sectorFilter.toLowerCase())) {
        return false;
      }
      // Type filter
      if (typeFilter !== 'ALL' && n.type !== typeFilter) {
        return false;
      }
      // Search query
      if (q) {
        const matchesName = n.name.toLowerCase().includes(q);
        const matchesSub = n.sublabel.toLowerCase().includes(q);
        const matchesCat = n.categoryLabel.toLowerCase().includes(q);
        const matchesId = n.id.toLowerCase().includes(q);
        return matchesName || matchesSub || matchesCat || matchesId;
      }
      return true;
    });

    const nodeIds = new Set(visibleNodes.map((n) => n.id));
    const visibleLinks = links.filter((l) => nodeIds.has(l.source) && nodeIds.has(l.target));

    return { filteredNodes: visibleNodes, filteredLinks: visibleLinks };
  }, [nodes, links, searchQuery, sectorFilter, typeFilter]);

  // Physics Simulation Loop
  useEffect(() => {
    if (!physicsEnabled) return;
    let animationFrameId: number;

    const simulate = () => {
      setNodes((prevNodes) => {
        if (prevNodes.length === 0) return prevNodes;
        const nextNodes = prevNodes.map((n) => ({ ...n }));
        const nodeMap = new Map<string, GraphNode>();
        nextNodes.forEach((n) => nodeMap.set(n.id, n));

        const width = 1000;
        const height = 700;
        const center = { x: width / 2, y: height / 2 };

        // 1. Center gravity pull
        nextNodes.forEach((n) => {
          if (n.isDragging) return;
          const dx = center.x - (n.x || width / 2);
          const dy = center.y - (n.y || height / 2);
          n.vx = (n.vx || 0) + dx * 0.0005;
          n.vy = (n.vy || 0) + dy * 0.0005;
        });

        // 2. Node-node repulsion (Coulomb force)
        for (let i = 0; i < nextNodes.length; i++) {
          for (let j = i + 1; j < nextNodes.length; j++) {
            const a = nextNodes[i];
            const b = nextNodes[j];
            const dx = (b.x || 0) - (a.x || 0);
            const dy = (b.y || 0) - (a.y || 0);
            const distSq = dx * dx + dy * dy || 1;
            const dist = Math.sqrt(distSq);

            if (dist < 320) {
              const force = (3500 / distSq) * (a.type === 'SECTOR' || b.type === 'SECTOR' ? 1.6 : 1);
              const fx = (dx / dist) * force;
              const fy = (dy / dist) * force;
              if (!a.isDragging) {
                a.vx = (a.vx || 0) - fx;
                a.vy = (a.vy || 0) - fy;
              }
              if (!b.isDragging) {
                b.vx = (b.vx || 0) + fx;
                b.vy = (b.vy || 0) + fy;
              }
            }
          }
        }

        // 3. Link spring forces (Hooke attraction)
        links.forEach((link) => {
          const a = nodeMap.get(link.source);
          const b = nodeMap.get(link.target);
          if (!a || !b) return;

          const dx = (b.x || 0) - (a.x || 0);
          const dy = (b.y || 0) - (a.y || 0);
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const desiredDist = link.type === 'BIOMETRIC_MATCH' ? 110 : link.type === 'LAST_SEEN_AT' ? 140 : 120;
          const force = (dist - desiredDist) * 0.02 * (link.strength || 0.7);

          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          if (!a.isDragging) {
            a.vx = (a.vx || 0) + fx;
            a.vy = (a.vy || 0) + fy;
          }
          if (!b.isDragging) {
            b.vx = (b.vx || 0) - fx;
            b.vy = (b.vy || 0) - fy;
          }
        });

        // 4. Velocity damping & position update
        const damping = 0.88;
        nextNodes.forEach((n) => {
          if (n.isDragging) return;
          n.vx = (n.vx || 0) * damping;
          n.vy = (n.vy || 0) * damping;
          n.x = (n.x || width / 2) + (n.vx || 0);
          n.y = (n.y || height / 2) + (n.vy || 0);

          // Boundary bounce / bounds keeping
          n.x = Math.max(50, Math.min(width - 50, n.x));
          n.y = Math.max(50, Math.min(height - 50, n.y));
        });

        return nextNodes;
      });

      animationFrameId = requestAnimationFrame(simulate);
    };

    animationFrameId = requestAnimationFrame(simulate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [physicsEnabled, links]);

  // Render Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear background
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw Cybernetic Background Grid
    ctx.save();
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.k, transform.k);

    const gridSize = 36;
    const startX = -transform.x / transform.k - 100;
    const endX = (rect.width - transform.x) / transform.k + 100;
    const startY = -transform.y / transform.k - 100;
    const endY = (rect.height - transform.y) / transform.k + 100;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1 / transform.k;

    ctx.beginPath();
    for (let x = Math.floor(startX / gridSize) * gridSize; x < endX; x += gridSize) {
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
    }
    for (let y = Math.floor(startY / gridSize) * gridSize; y < endY; y += gridSize) {
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
    }
    ctx.stroke();

    const nodeMap = new Map<string, GraphNode>();
    filteredNodes.forEach((n) => nodeMap.set(n.id, n));

    // Draw Links
    filteredLinks.forEach((link) => {
      const source = nodeMap.get(link.source);
      const target = nodeMap.get(link.target);
      if (!source || !target || source.x === undefined || target.x === undefined) return;

      const isConnectedToSelected = selectedNode && (selectedNode.id === source.id || selectedNode.id === target.id);
      const isConnectedToHovered = hoveredNode && (hoveredNode.id === source.id || hoveredNode.id === target.id);
      const isLinkHovered = hoveredLink === link;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(source.x, source.y!);
      ctx.lineTo(target.x, target.y!);

      let linkColor = 'rgba(100, 116, 139, 0.28)';
      let lineWidth = 1.2;

      if (link.type === 'BIOMETRIC_MATCH') {
        linkColor = isConnectedToSelected || isLinkHovered ? '#f59e0b' : 'rgba(245, 158, 11, 0.65)';
        lineWidth = 2.4;
        ctx.setLineDash([4, 3]);
      } else if (link.type === 'LAST_SEEN_AT') {
        linkColor = isConnectedToSelected || isLinkHovered ? '#a855f7' : 'rgba(168, 85, 247, 0.45)';
        lineWidth = 1.8;
      } else if (link.type === 'SHELTERED_IN') {
        linkColor = isConnectedToSelected || isLinkHovered ? '#38bdf8' : 'rgba(56, 189, 248, 0.45)';
        lineWidth = 1.8;
      } else if (link.type === 'FAMILY_INTAKE') {
        linkColor = isConnectedToSelected || isLinkHovered ? '#10b981' : 'rgba(16, 185, 129, 0.45)';
        lineWidth = 1.6;
      } else if (link.type === 'DUPLICATE_CLUSTER') {
        linkColor = '#ef4444';
        lineWidth = 2;
        ctx.setLineDash([3, 2]);
      }

      if (isConnectedToSelected || isConnectedToHovered || isLinkHovered) {
        lineWidth += 1.5;
      }

      ctx.strokeStyle = linkColor;
      ctx.lineWidth = lineWidth / transform.k;
      ctx.stroke();

      // Draw link badge if Biometric match
      if (link.confidence && (isConnectedToSelected || isLinkHovered || link.confidence >= 90)) {
        const midX = (source.x + target.x) / 2;
        const midY = (source.y! + target.y!) / 2;

        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = linkColor;
        ctx.lineWidth = 1 / transform.k;
        const text = `${link.confidence}% MATCH`;
        ctx.font = `${9 / transform.k}px "JetBrains Mono", monospace`;
        const textWidth = ctx.measureText(text).width;

        ctx.beginPath();
        ctx.roundRect(midX - textWidth / 2 - 4, midY - 7, textWidth + 8, 14, 3);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = linkColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, midX, midY);
      }

      ctx.restore();
    });

    // Draw Nodes
    filteredNodes.forEach((node) => {
      if (node.x === undefined || node.y === undefined) return;
      const isSelected = selectedNode?.id === node.id;
      const isHovered = hoveredNode?.id === node.id;

      ctx.save();

      // Outer glow if selected or hovered
      if (isSelected || isHovered) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, (node.size + 10) / transform.k, 0, 2 * Math.PI);
        ctx.fillStyle = `${node.color}33`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, (node.size + 4) / transform.k, 0, 2 * Math.PI);
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 2 / transform.k;
        ctx.stroke();
      }

      // Base Node Circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size / transform.k, 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.fill();
      ctx.strokeStyle = isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = (isSelected ? 2.5 : 1) / transform.k;
      ctx.stroke();

      // Node Letter Symbol
      const initial = node.type === 'PERSON' ? 'P' : node.type === 'FACILITY' ? 'H' : node.type === 'SECTOR' ? 'S' : node.type === 'CANDIDATE' ? 'M' : 'C';
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.max(10, node.size * 0.75) / transform.k}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(initial, node.x, node.y + 0.5);

      // Node Label below
      ctx.font = `${Math.max(10, 11 / transform.k)}px Inter, sans-serif`;
      ctx.fillStyle = isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.85)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      // Truncate long names
      const displayName = node.name.length > 20 ? `${node.name.slice(0, 18)}...` : node.name;
      ctx.fillText(displayName, node.x, node.y + (node.size + 4) / transform.k);

      ctx.restore();
    });

    ctx.restore();
  }, [filteredNodes, filteredLinks, transform, selectedNode, hoveredNode, hoveredLink]);

  // Screen to Canvas Coordinates helper
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    return {
      x: (mouseX - transform.x) / transform.k,
      y: (mouseY - transform.y) / transform.k,
    };
  };

  // Find node under mouse
  const getNodeAtCoords = (cx: number, cy: number) => {
    for (let i = filteredNodes.length - 1; i >= 0; i--) {
      const n = filteredNodes[i];
      if (n.x === undefined || n.y === undefined) continue;
      const dx = cx - n.x;
      const dy = cy - n.y;
      if (Math.sqrt(dx * dx + dy * dy) <= n.size + 6) {
        return n;
      }
    }
    return null;
  };

  // Mouse Event Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    const clickedNode = getNodeAtCoords(coords.x, coords.y);

    if (clickedNode) {
      draggedNodeRef.current = clickedNode;
      clickedNode.isDragging = true;
      setSelectedNode(clickedNode);
    } else {
      isPanningRef.current = true;
      startPanRef.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);

    if (draggedNodeRef.current) {
      draggedNodeRef.current.x = coords.x;
      draggedNodeRef.current.y = coords.y;
      draggedNodeRef.current.vx = 0;
      draggedNodeRef.current.vy = 0;
      return;
    }

    if (isPanningRef.current) {
      setTransform((prev) => ({
        ...prev,
        x: e.clientX - startPanRef.current.x,
        y: e.clientY - startPanRef.current.y,
      }));
      return;
    }

    const hoverNode = getNodeAtCoords(coords.x, coords.y);
    setHoveredNode(hoverNode);

    let foundLink: GraphLink | null = null;
    if (!hoverNode) {
      const nodeMap = new Map<string, GraphNode>();
      filteredNodes.forEach((n) => nodeMap.set(n.id, n));
      for (const l of filteredLinks) {
        const s = nodeMap.get(l.source);
        const t = nodeMap.get(l.target);
        if (s && t && s.x !== undefined && t.x !== undefined && s.y !== undefined && t.y !== undefined) {
          const l2 = (t.x - s.x) * (t.x - s.x) + (t.y - s.y) * (t.y - s.y);
          if (l2 > 0) {
            const tParam = Math.max(0, Math.min(1, ((coords.x - s.x) * (t.x - s.x) + (coords.y - s.y) * (t.y - s.y)) / l2));
            const projX = s.x + tParam * (t.x - s.x);
            const projY = s.y + tParam * (t.y - s.y);
            const dist = Math.sqrt((coords.x - projX) * (coords.x - projX) + (coords.y - projY) * (coords.y - projY));
            if (dist < 8) {
              foundLink = l;
              break;
            }
          }
        }
      }
    }
    setHoveredLink(foundLink);
  };

  const handleMouseUp = () => {
    if (draggedNodeRef.current) {
      draggedNodeRef.current.isDragging = false;
      draggedNodeRef.current = null;
    }
    isPanningRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setTransform((prev) => {
      const newK = Math.max(0.4, Math.min(3.0, prev.k * zoomFactor));
      return {
        k: newK,
        x: mouseX - (mouseX - prev.x) * (newK / prev.k),
        y: mouseY - (mouseY - prev.y) * (newK / prev.k),
      };
    });
  };

  const handleResetCenter = () => {
    setTransform({ x: 0, y: 0, k: 1 });
  };

  // Connected relationships for selected node
  const selectedNodeRelationships = useMemo(() => {
    if (!selectedNode) return [];
    return links.filter(
      (l) => l.source === selectedNode.id || l.target === selectedNode.id
    ).map((l) => {
      const otherId = l.source === selectedNode.id ? l.target : l.source;
      const otherNode = nodes.find((n) => n.id === otherId);
      return {
        link: l,
        otherNode,
        isOutgoing: l.source === selectedNode.id,
      };
    });
  }, [selectedNode, links, nodes]);

  // Sector unique list for dropdown
  const uniqueSectors = useMemo(() => {
    const s = new Set<string>();
    nodes.forEach((n) => {
      if (n.sector) s.add(n.sector);
    });
    return Array.from(s);
  }, [nodes]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const missing = nodes.filter((n) => n.type === 'PERSON').length;
    const facilities = nodes.filter((n) => n.type === 'FACILITY').length;
    const citizens = nodes.filter((n) => n.type === 'CITIZEN').length;
    const candidates = nodes.filter((n) => n.type === 'CANDIDATE').length;
    const matchesCount = links.filter((l) => l.type === 'BIOMETRIC_MATCH').length;
    return { missing, facilities, citizens, candidates, matchesCount };
  }, [nodes, links]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      backgroundColor: '#090d16',
      color: '#e2e8f0',
    }}>
      {/* Top Header */}
      <div style={{
        backgroundColor: '#0f172a',
        borderBottom: '1px solid #1e293b',
        padding: 'var(--space-4) var(--space-8)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}>
              <span>OPERATIONS</span>
              <span>•</span>
              <span>INTELLIGENCE GRAPH</span>
              <span>•</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>LIVE TOPOLOGY</span>
            </div>
            <h1 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 700,
              color: '#f8fafc',
              letterSpacing: '-0.02em',
              margin: '2px 0 0 0',
            }}>
              Entity Connection Network & Link Analysis
            </h1>
            <p style={{ fontSize: 'var(--text-xs)', color: '#94a3b8', margin: '2px 0 0 0' }}>
              Physics-enabled topological correlation graph mapping relationships between missing persons, relief facilities, family reporters, and disaster search sectors.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <div style={{
              backgroundColor: '#1e293b',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              border: '1px solid #334155',
            }}>
              <span style={{ color: '#94a3b8' }}>ENTITIES: </span>
              <strong style={{ color: '#f8fafc' }}>{nodes.length}</strong>
            </div>
            <div style={{
              backgroundColor: '#1e293b',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              border: '1px solid #334155',
            }}>
              <span style={{ color: '#94a3b8' }}>RELATIONSHIPS: </span>
              <strong style={{ color: '#38bdf8' }}>{links.length}</strong>
            </div>
            <div style={{
              backgroundColor: '#1e293b',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              border: '1px solid #334155',
            }}>
              <span style={{ color: '#94a3b8' }}>MATCH PAIRS: </span>
              <strong style={{ color: '#f59e0b' }}>{metrics.matchesCount}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Top Search & Filter Bar (Matching screenshot layout) */}
      <div style={{
        backgroundColor: '#0c1222',
        borderBottom: '1px solid #1e293b',
        padding: 'var(--space-3) var(--space-8)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          flexWrap: 'wrap',
        }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search person, facility, reporter, sector..."
              style={{
                width: '100%',
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: 'var(--radius-sm)',
                padding: '7px 12px 7px 34px',
                fontSize: '12px',
                color: '#f8fafc',
                outline: 'none',
              }}
            />
          </div>

          {/* Sector Dropdown */}
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            style={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: 'var(--radius-sm)',
              padding: '7px 12px',
              fontSize: '12px',
              color: '#f8fafc',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="ALL">-- ALL SECTORS --</option>
            {uniqueSectors.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Entity Type Dropdown */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: 'var(--radius-sm)',
              padding: '7px 12px',
              fontSize: '12px',
              color: '#f8fafc',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="ALL">-- ALL ENTITY HEADS --</option>
            <option value="PERSON">Missing Persons (Suspect / Accused)</option>
            <option value="FACILITY">Hospitals & Shelters (Station / Unit)</option>
            <option value="CITIZEN">Citizen Reporters & Complainants</option>
            <option value="SECTOR">Disaster Sectors & Hubs</option>
            <option value="CANDIDATE">Candidate Match Leads</option>
          </select>

          {/* Physics Toggle Button */}
          <button
            onClick={() => setPhysicsEnabled(!physicsEnabled)}
            className="btn"
            style={{
              backgroundColor: physicsEnabled ? '#1e293b' : '#334155',
              border: `1px solid ${physicsEnabled ? '#3b82f6' : '#475569'}`,
              color: physicsEnabled ? '#60a5fa' : '#94a3b8',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              padding: '7px 14px',
              cursor: 'pointer',
            }}
          >
            {physicsEnabled ? <Pause size={13} /> : <Play size={13} />}
            <span>{physicsEnabled ? '|| Physics' : '▶ Physics'}</span>
          </button>

          {/* Center Button */}
          <button
            onClick={handleResetCenter}
            className="btn"
            style={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              color: '#f8fafc',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              padding: '7px 14px',
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={13} />
            <span>Center</span>
          </button>
        </div>

        {/* Entity Layers Legend Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-4)',
          marginTop: 'var(--space-3)',
          fontSize: '11px',
          color: '#94a3b8',
          flexWrap: 'wrap',
        }}>
          <span style={{ fontWeight: 600, color: '#cbd5e1', letterSpacing: '0.04em' }}>
            ENTITY LAYERS:
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block' }} />
            <span>Missing Person / Active Docket</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: '#3b82f6', display: 'inline-block' }} />
            <span>Shelter / Hospital / Unit</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
            <span>Complainant / Citizen Reporter</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: '#a855f7', display: 'inline-block' }} />
            <span>Disaster Sector / Cluster Hub</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: '#f59e0b', display: 'inline-block' }} />
            <span>Correlated Candidate Lead</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Work Area (Canvas + Dossier Panel) */}
      <div style={{
        flex: 1,
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '640px',
      }}>
        {/* Canvas Workspace */}
        <div style={{
          flex: 1,
          position: 'relative',
          backgroundColor: '#090d16',
          cursor: isPanningRef.current ? 'grabbing' : 'grab',
        }}>
          <canvas
            ref={canvasRef}
            style={{ width: '100%', height: '100%', display: 'block' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
          />

          {/* Loading Indicator */}
          {loading && (
            <div style={{
              position: 'absolute',
              top: 20,
              left: 20,
              zIndex: 15,
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid #38bdf8',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 14px',
              fontSize: '12px',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{ animation: 'pulse 1.5s infinite' }}>⚡ Fetching live topological nodes from MongoDB...</span>
            </div>
          )}

          {/* Hovered Link Reason Banner */}
          {hoveredLink && (
            <div style={{
              position: 'absolute',
              bottom: 60,
              left: 20,
              maxWidth: '560px',
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid #38bdf8',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              fontSize: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              zIndex: 25,
            }}>
              <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', marginBottom: '2px' }}>
                🔗 LINK REASON: {hoveredLink.label}
              </div>
              <div style={{ color: '#f8fafc', lineHeight: 1.4 }}>
                {hoveredLink.reason}
              </div>
            </div>
          )}

          {/* Floating Canvas Legend Card (Top Right) */}
          <div style={{
            position: 'absolute',
            top: 16,
            right: selectedNode ? 420 : 20,
            transition: 'right 0.2s ease',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid #1e293b',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            fontSize: '11px',
            color: '#cbd5e1',
            pointerEvents: 'none',
            zIndex: 10,
          }}>
            <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '4px', letterSpacing: '0.04em' }}>GRAPH LEGEND</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '2px 0' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ef4444' }} />
              <span>Missing Person</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '2px 0' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#3b82f6' }} />
              <span>Police / Shelter / Unit</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '2px 0' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981' }} />
              <span>Complainant / Citizen</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '2px 0' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#a855f7' }} />
              <span>Disaster Sector Hub</span>
            </div>
            <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid #334155', color: '#f59e0b', fontSize: '10px' }}>
              ⓘ Click node for details & why connected
            </div>
          </div>

          {/* Canvas Controls overlay */}
          <div style={{
            position: 'absolute',
            bottom: 16,
            left: 20,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            padding: '4px 8px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid #1e293b',
            fontSize: '11px',
            color: '#94a3b8',
          }}>
            <span>Zoom: <strong>{Math.round(transform.k * 100)}%</strong></span>
            <span>•</span>
            <span>Scroll wheel to zoom, drag to pan or move nodes</span>
          </div>
        </div>

        {/* =========================================================================
            RIGHT-SIDE NODE DETAILS DOSSIER (Matches NodeDetailsDossier.jsx from user)
            ========================================================================= */}
        {selectedNode && (
          <div style={{
            width: '400px',
            backgroundColor: '#0f172a',
            borderLeft: '1px solid #1e293b',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            zIndex: 20,
            boxShadow: '-4px 0 20px rgba(0,0,0,0.4)',
          }}>
            {/* Dossier Header */}
            <div style={{
              padding: 'var(--space-4) var(--space-5)',
              borderBottom: '1px solid #1e293b',
              backgroundColor: '#0c1222',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  color: selectedNode.color,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}>
                  {selectedNode.categoryLabel}
                </div>
                <h3 style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 700,
                  color: '#f8fafc',
                  margin: '2px 0 0 0',
                }}>
                  {selectedNode.name}
                </h3>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                  {selectedNode.sublabel}
                </span>
              </div>

              <button
                onClick={() => setSelectedNode(null)}
                className="btn btn-ghost"
                style={{ padding: '4px', color: '#94a3b8' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Dossier Body */}
            <div style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {/* Photo & Identity Banner if Person */}
              {selectedNode.type === 'PERSON' && selectedNode.details && (
                <div style={{
                  backgroundColor: '#1e293b',
                  borderRadius: 'var(--radius-sm)',
                  padding: 'var(--space-4)',
                  border: '1px solid #334155',
                  display: 'flex',
                  gap: 'var(--space-3)',
                }}>
                  {selectedNode.details.photoUrl ? (
                    <img
                      src={selectedNode.details.photoUrl}
                      alt={selectedNode.name}
                      style={{
                        width: '64px',
                        height: '76px',
                        borderRadius: 'var(--radius-xs)',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '64px',
                      height: '76px',
                      borderRadius: 'var(--radius-xs)',
                      backgroundColor: '#334155',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#94a3b8',
                    }}>
                      <Users size={28} />
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
                        {selectedNode.id}
                      </span>
                      {selectedNode.priority && (
                        <Badge variant={selectedNode.priority === 'CRITICAL' ? 'crimson' : 'amber'}>
                          {selectedNode.priority}
                        </Badge>
                      )}
                    </div>

                    <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '4px' }}>
                      <strong>Status:</strong> {selectedNode.status || 'LOOKING FOR A MATCH'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#cbd5e1' }}>
                      <strong>Sector:</strong> {selectedNode.sector || 'Unassigned'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#cbd5e1' }}>
                      <strong>Last Seen:</strong> {selectedNode.details.lastSeenLocation || 'Flood Basin'}
                    </div>
                  </div>
                </div>
              )}

              {/* Physical Marks / Attire Details */}
              {selectedNode.details?.keyMarks && (
                <div style={{
                  backgroundColor: '#1e293b',
                  borderRadius: 'var(--radius-sm)',
                  padding: 'var(--space-3) var(--space-4)',
                  fontSize: '11px',
                  border: '1px solid #334155',
                }}>
                  <span style={{ color: '#94a3b8', display: 'block', fontWeight: 600, marginBottom: '2px' }}>
                    KEY PHYSICAL BIOMETRICS & MARKS
                  </span>
                  <p style={{ margin: 0, color: '#e2e8f0', lineHeight: 1.4 }}>
                    {selectedNode.details.keyMarks}
                  </p>
                </div>
              )}

              {/* Facility Details */}
              {selectedNode.type === 'FACILITY' && (
                <div style={{
                  backgroundColor: '#1e293b',
                  borderRadius: 'var(--radius-sm)',
                  padding: 'var(--space-3) var(--space-4)',
                  fontSize: '11px',
                  border: '1px solid #334155',
                }}>
                  <span style={{ color: '#38bdf8', display: 'block', fontWeight: 600, marginBottom: '2px' }}>
                    HOLDING & ADMISSION FACILITY
                  </span>
                  <p style={{ margin: 0, color: '#e2e8f0', lineHeight: 1.4 }}>
                    Official disaster triage and relief shelter facility with active CAD telemetry feed. Currently housing unidentified rescues and candidate matches.
                  </p>
                </div>
              )}

              {/* Sector Details */}
              {selectedNode.type === 'SECTOR' && (
                <div style={{
                  backgroundColor: '#1e293b',
                  borderRadius: 'var(--radius-sm)',
                  padding: 'var(--space-3) var(--space-4)',
                  fontSize: '11px',
                  border: '1px solid #334155',
                }}>
                  <span style={{ color: '#c084fc', display: 'block', fontWeight: 600, marginBottom: '2px' }}>
                    GEOSPATIAL SEARCH SECTOR
                  </span>
                  <p style={{ margin: 0, color: '#e2e8f0', lineHeight: 1.4 }}>
                    Active search & rescue sector under NDRF / SDRF jurisdiction. Links all persons last seen within these riverfront and low-lying flood coordinates.
                  </p>
                </div>
              )}

              {/* =====================================================================
                  CONNECTED RELATIONSHIPS & WHY THEY ARE CONNECTED (KEY REQUIREMENT!)
                  ===================================================================== */}
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 'var(--space-2)',
                }}>
                  <span style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}>
                    CONNECTED RELATIONSHIPS ({selectedNodeRelationships.length})
                  </span>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>TOPOLOGICAL LINKS</span>
                </div>

                {selectedNodeRelationships.length === 0 ? (
                  <div style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', padding: '8px' }}>
                    No direct links recorded in active cluster.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {selectedNodeRelationships.map(({ link, otherNode }, idx) => (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #334155',
                          borderRadius: 'var(--radius-sm)',
                          padding: 'var(--space-3)',
                          cursor: 'pointer',
                          transition: 'border-color 0.15s ease',
                        }}
                        onClick={() => otherNode && setSelectedNode(otherNode)}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '4px',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: otherNode?.color || '#94a3b8',
                            }} />
                            <strong style={{ fontSize: '12px', color: '#f8fafc' }}>
                              {otherNode?.name || link.target}
                            </strong>
                          </div>

                          <Badge
                            variant={
                              link.type === 'BIOMETRIC_MATCH'
                                ? 'amber'
                                : link.type === 'FAMILY_INTAKE'
                                ? 'forest'
                                : link.type === 'DUPLICATE_CLUSTER'
                                ? 'crimson'
                                : 'default'
                            }
                          >
                            {link.label}
                          </Badge>
                        </div>

                        {/* EXPLANATION OF WHY THEY ARE CONNECTED */}
                        <div style={{
                          fontSize: '11px',
                          color: '#94a3b8',
                          lineHeight: 1.4,
                          marginTop: '4px',
                          backgroundColor: '#0f172a',
                          padding: '6px 8px',
                          borderRadius: 'var(--radius-xs)',
                          borderLeft: `2px solid ${otherNode?.color || '#3b82f6'}`,
                        }}>
                          <span style={{ color: '#cbd5e1', fontWeight: 600, display: 'block', fontSize: '10px' }}>
                            REASON FOR CONNECTION:
                          </span>
                          {link.reason}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ marginTop: 'var(--space-2)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {selectedNode.type === 'PERSON' && (
                  <button
                    onClick={() => navigate(`/cases/${selectedNode.id}`)}
                    className="btn btn-primary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: '12px',
                      padding: '8px 14px',
                    }}
                  >
                    <span>Open Case Dossier ({selectedNode.id})</span>
                    <ArrowRight size={13} />
                  </button>
                )}

                {selectedNode.type === 'CANDIDATE' && (
                  <button
                    onClick={() => navigate('/match-intel')}
                    className="btn btn-danger"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: '12px',
                      padding: '8px 14px',
                      backgroundColor: '#dc2626',
                      borderColor: '#dc2626',
                    }}
                  >
                    <span>Inspect Match in Workspace</span>
                    <ExternalLink size={13} />
                  </button>
                )}

                {selectedNode.type === 'SECTOR' && (
                  <button
                    onClick={() => navigate('/analytics')}
                    className="btn btn-secondary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: '12px',
                      padding: '8px 14px',
                    }}
                  >
                    <span>View Sector Analytics & Density</span>
                    <ExternalLink size={13} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionGraphPage;
