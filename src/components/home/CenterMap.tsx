'use client';

import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { CenterListItem } from '@/lib/types/center';
import { MAP_DEFAULTS } from '@/lib/constants/map';

interface CenterMapProps {
  centers: CenterListItem[];
}

export default function CenterMap({ centers }: CenterMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup>(L.layerGroup());
  const initializedRef = useRef(false);

  // Inicializar el mapa
  const initMap = useCallback(() => {
    if (initializedRef.current || !containerRef.current) return;

    const map = L.map(containerRef.current, {
      center: MAP_DEFAULTS.center,
      zoom: MAP_DEFAULTS.zoom,
      minZoom: MAP_DEFAULTS.minZoom,
      maxZoom: MAP_DEFAULTS.maxZoom,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer(MAP_DEFAULTS.tileUrl, {
      attribution: MAP_DEFAULTS.attribution,
      maxZoom: MAP_DEFAULTS.maxZoom,
    }).addTo(map);

    markersRef.current.addTo(map);
    mapRef.current = map;
    initializedRef.current = true;

    // Fix para tiles que no cargan al redimensionar
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, []);

  // Efecto de inicialización
  useEffect(() => {
    // Pequeño delay para asegurar que el container está renderizado
    const timer = setTimeout(initMap, 200);
    return () => clearTimeout(timer);
  }, [initMap]);

  // Actualizar marcadores cuando cambian los centros
  useEffect(() => {
    if (!mapRef.current) return;

    const layerGroup = markersRef.current;
    layerGroup.clearLayers();

    if (centers.length === 0) return;

    const bounds = L.latLngBounds([] as L.LatLng[]);

    centers.forEach((center) => {
      if (center.latitude == null || center.longitude == null) return;

      const lat = center.latitude;
      const lng = center.longitude;
      const latLng = L.latLng(lat, lng);
      bounds.extend(latLng);

      // Crear icono personalizado con efecto de pulso verde
      const pulseHtml = `
        <div style="
          width: 16px;
          height: 16px;
          background: #16a34a;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.4);
          animation: pulseGreen 2s ease-in-out infinite;
        "></div>
      `;

      const icon = L.divIcon({
        html: pulseHtml,
        className: '',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker(latLng, { icon });

      // Popup con info del centro
      const popupContent = `
        <div style="min-width: 180px; font-family: system-ui, sans-serif;">
          <p style="margin:0 0 4px; font-weight:600; font-size:14px;">
            ${center.country?.name || 'Desconocido'}
          </p>
          ${center.state ? `<p style="margin:0 0 2px; font-size:12px; color:#64748b;">${center.state.name}</p>` : ''}
          ${center.city ? `<p style="margin:0 0 4px; font-size:12px; color:#64748b;">${center.city.name}</p>` : ''}
          <p style="margin:0 0 4px; font-size:11px; color:#94a3b8; max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
            ${center.address.substring(0, 60)}${center.address.length > 60 ? '...' : ''}
          </p>
          <a href="/centro/${center.id}" style="
            display: inline-block;
            margin-top: 4px;
            padding: 4px 10px;
            background: #16a34a;
            color: white;
            border-radius: 6px;
            font-size: 12px;
            text-decoration: none;
            font-weight: 500;
          ">
            Ver detalle →
          </a>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 260 });
      layerGroup.addLayer(marker);
    });

    // Ajustar vista según los marcadores
    if (bounds.isValid()) {
      mapRef.current.fitBounds(bounds, {
        padding: [40, 40],
        maxZoom: 14,
        animate: true,
      });
    }
  }, [centers]);

  // Inyectar la animación CSS de pulso en el head
  useEffect(() => {
    if (document.getElementById('pulse-animation-style')) return;
    const style = document.createElement('style');
    style.id = 'pulse-animation-style';
    style.textContent = `
      @keyframes pulseGreen {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.4); opacity: 0.6; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      // No remover, puede ser usado por otros componentes
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-[400px] sm:h-[500px] w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100"
      aria-label="Mapa de centros de acopio"
    />
  );
}
