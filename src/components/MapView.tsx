import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { TournamentEvent } from '../types';
import { EVENT_TYPE_COLORS, EVENT_TYPE_LABELS } from '../types';
import { formatDate } from '../utils/date';

interface Props {
  events: TournamentEvent[];
  selectedId: string | null;
  onSelect: (event: TournamentEvent) => void;
}

function FlyToSelected({ events, selectedId }: { events: TournamentEvent[]; selectedId: string | null }) {
  const map = useMap();
  const prevId = useRef<string | null>(null);

  useEffect(() => {
    if (!selectedId || selectedId === prevId.current) return;
    const event = events.find(e => e.id === selectedId);
    if (event) {
      map.flyTo([event.lat, event.lng], 12, { duration: 0.8 });
      prevId.current = selectedId;
    }
  }, [selectedId, events, map]);

  return null;
}

export function MapView({ events, selectedId, onSelect }: Props) {
  return (
    <MapContainer
      center={[36.2, 138.2]}
      zoom={5}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToSelected events={events} selectedId={selectedId} />
      {events.map(event => (
        <CircleMarker
          key={event.id}
          center={[event.lat, event.lng]}
          radius={selectedId === event.id ? 14 : 10}
          pathOptions={{
            color: '#fff',
            weight: 2,
            fillColor: EVENT_TYPE_COLORS[event.type],
            fillOpacity: 0.9,
          }}
          eventHandlers={{ click: () => onSelect(event) }}
        >
          <Popup>
            <div className="map-popup">
              <span
                className="popup-badge"
                style={{ background: EVENT_TYPE_COLORS[event.type] }}
              >
                {EVENT_TYPE_LABELS[event.type]}
              </span>
              <p className="popup-name">{event.name}</p>
              <p className="popup-date">{formatDate(event.date)}</p>
              <p className="popup-venue">{event.venue}</p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
