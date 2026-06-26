'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { CenterListItem } from '@/lib/types/center';
import { MAP_DEFAULTS } from '@/lib/constants/map';

interface CenterMapProps {
  centers: CenterListItem[];
}

export default function CenterMap({ centers }: CenterMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup>(L.layerGroup());

  // Inicializar el mapa una sola vez
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    const map = L.map(containerRef.current, {
      center: MAP_DEFAULTS.center,
      zoom: MAP_DEFAULTS.zoom,
      minZoom: MAP_DEFAULTS.minZoom,
      maxZoom: MAP_DEFAULTS.maxZoom,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    L.tileLayer(MAP_DEFAULTS.tileUrl, {
      attribution: MAP_DEFAULTS.attribution,
      maxZoom: MAP_DEFAULTS.maxZoom,
    }).addTo(map);

    markersRef.current.addTo(map);
    mapRef.current = map;

    // Inyectar CSS de animación para los marcadores
    if (!document.getElementById('pulse-animation-style')) {
      const style = document.createElement('style');
      style.id = 'pulse-animation-style';
      style.textContent = `
        @keyframes pulseGreen {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.4; }
        }
      `;
      document.head.appendChild(style);
    }

    // Forzar resize para que los tiles carguen bien
    requestAnimationFrame(() => {
      map.invalidateSize();
    });

    // Cleanup
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Actualizar marcadores cuando cambian los centros
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const layerGroup = markersRef.current;
    layerGroup.clearLayers();

    if (centers.length === 0) return;

    const validCenters = centers.filter(
      (c) => c.latitude != null && c.longitude != null
    );

    if (validCenters.length === 0) return;

    const bounds = L.latLngBounds([] as L.LatLng[]);

    validCenters.forEach((center) => {
      const latLng = L.latLng(center.latitude!, center.longitude!);
      bounds.extend(latLng);

      const pulseHtml = `
        <div style="
          width: 14px; height: 14px;
          background: #16a34a;
          border: 2.5px solid white;
          border-radius: 50%;
          box-shadow: 0 0 0 5px rgba(22, 163, 74, 0.35);
          animation: pulseGreen 2s ease-in-out infinite;
        "></div>
      `;

      const icon = L.divIcon({
        html: pulseHtml,
        className: '',
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const marker = L.marker(latLng, { icon });

      const popupContent = `
        <div style="min-width:170px;font-family:system-ui,sans-serif;">
          <p style="margin:0 0 3px;font-weight:600;font-size:13px;">${center.country?.name || ''}</p>
          ${center.state ? `<p style="margin:0;font-size:11px;color:#64748b;">${center.state.name}</p>` : ''}
          ${center.city ? `<p style="margin:0 0 3px;font-size:11px;color:#64748b;">${center.city.name}</p>` : ''}
          <p style="margin:0 0 4px;font-size:10px;color:#94a3b8;">${center.address.substring(0, 50)}</p>
          <a href="/centro/${center.id}" style="display:inline-block;padding:4px 10px;background:#16a34a;color:white;border-radius:6px;font-size:11px;text-decoration:none;">Ver detalle →</a>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 250 });
      layerGroup.addLayer(marker);
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 14,
        animate: true,
        duration: 0.5,
      });
    }
  }, [centers]);

  return (
    <div
      ref={containerRef}
      style={{ height: '450px' }}
      className="w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100"
      aria-label="Mapa de centros de acopio"
    />
  );
}
