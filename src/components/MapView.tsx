import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L, { type LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const canvasRenderer = L.canvas({ padding: 0.5 });
import type { TournamentEvent, TournamentGrade } from '../types';
import { getBadgeColor, getBadgeLabel } from '../types';
import { formatDate, formatTime } from '../utils/date';

const GRADE_RANK: TournamentGrade[] = ['G3', 'G2', 'G1', 'S1', 'other'];

function topEvent(group: TournamentEvent[]): TournamentEvent {
  return group.reduce((best, e) => {
    const bi = GRADE_RANK.indexOf(best.grade);
    const ei = GRADE_RANK.indexOf(e.grade);
    return ei < bi ? e : best;
  });
}

interface Props {
  events: TournamentEvent[];
  selectedId: string | null;
  onSelect: (event: TournamentEvent) => void;
}

/** lat/lng を固定小数点文字列にして同座標グループのキーにする */
function locKey(e: TournamentEvent) {
  return `${e.lat.toFixed(5)},${e.lng.toFixed(5)}`;
}

function FlyToSelected({ events, selectedId }: { events: TournamentEvent[]; selectedId: string | null }) {
  const map = useMap();
  const prevId = useRef<string | null>(null);

  useEffect(() => {
    if (!selectedId || selectedId === prevId.current) return;
    const event = events.find(e => e.id === selectedId);
    if (event) {
      map.panTo([event.lat, event.lng], { animate: true, duration: 0.5 });
      prevId.current = selectedId;
    }
  }, [selectedId, events, map]);

  return null;
}

function LocateButton() {
  const map = useMap();
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  function handleLocate() {
    if (!navigator.geolocation) { setStatus('error'); return; }
    setStatus('loading');
    navigator.geolocation.getCurrentPosition(
      pos => { map.flyTo([pos.coords.latitude, pos.coords.longitude], 13, { duration: 1 }); setStatus('idle'); },
      () => setStatus('error'),
      { timeout: 8000 },
    );
  }

  const label = status === 'loading' ? '…' : status === 'error' ? '✕' : '⊕';
  const title = status === 'error' ? '位置情報を取得できませんでした' : '現在地に移動';

  return (
    <button
      className={`locate-btn${status === 'error' ? ' locate-btn--error' : ''}`}
      onClick={handleLocate} title={title} aria-label={title}
    >
      {label}
    </button>
  );
}

function InitialLocate() {
  const map = useMap();
  const done = useRef(false);

  useEffect(() => {
    if (done.current || !navigator.geolocation) return;
    done.current = true;
    navigator.geolocation.getCurrentPosition(
      pos => map.setView([pos.coords.latitude, pos.coords.longitude], 10),
      () => {},
      { timeout: 5000 },
    );
  }, [map]);

  return null;
}

interface MarkersProps {
  groups: TournamentEvent[][];
  selectedId: string | null;
  onSelect: (event: TournamentEvent) => void;
}

function Markers({ groups, selectedId, onSelect }: MarkersProps) {
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);

  useMapEvents({
    moveend(e) { setBounds(e.target.getBounds()); },
    zoomend(e) { setBounds(e.target.getBounds()); },
    load(e)    { setBounds(e.target.getBounds()); },
  });

  // 初回レンダリング時にも bounds を取得
  const map = useMap();
  useEffect(() => { setBounds(map.getBounds()); }, [map]);

  // 少しマージンを持たせてビューポート外を除外
  const visible = useMemo(() => {
    if (!bounds) return groups;
    const pad = bounds.pad(0.1);
    return groups.filter(g => pad.contains([g[0].lat, g[0].lng]));
  }, [groups, bounds]);

  return (
    <>
      {visible.map(group => {
        const first = group[0];
        const isSelected = group.some(e => e.id === selectedId);
        const fillColor = getBadgeColor(topEvent(group));

        return (
          <CircleMarker
            key={locKey(first)}
            center={[first.lat, first.lng]}
            radius={isSelected ? 14 : group.length > 1 ? 12 : 10}
            pathOptions={{
              color: '#111',
              weight: 1.5,
              fillColor,
              fillOpacity: 1,
            }}
            renderer={canvasRenderer}
            eventHandlers={{ click: () => onSelect(first) }}
          >
            <Popup minWidth={220} maxHeight={360}>
              <div className="map-popup">
                {/* 会場・住所・マップリンクは共通なので1回だけ表示 */}
                <p className="popup-venue">{first.prefecture} · {first.venue}</p>
                <p className="popup-address">{first.address}</p>
                <a
                  className="popup-maps-link"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(first.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Maps ↗
                </a>
                {group.length > 1 && (
                  <p className="popup-count">{group.length} 件の大会</p>
                )}
                {group.map(event => {
                  const time = formatTime(event.startDate);
                  return (
                    <div
                      key={event.id}
                      className="popup-item"
                      onClick={() => onSelect(event)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={ev => ev.key === 'Enter' && onSelect(event)}
                    >
                      <span
                        className="popup-badge"
                        style={{ background: getBadgeColor(event) }}
                      >
                        {getBadgeLabel(event)}
                      </span>
                      <p className="popup-name">{event.name}</p>
                      <p className="popup-date">
                        {formatDate(event.startDate)}{time && `　${time}`}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
}

export function MapView({ events, selectedId, onSelect }: Props) {
  const groups = useMemo(() => {
    const map = new Map<string, TournamentEvent[]>();
    for (const e of events) {
      const k = locKey(e);
      const g = map.get(k) ?? [];
      g.push(e);
      map.set(k, g);
    }
    return [...map.values()];
  }, [events]);

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
      <InitialLocate />
      <FlyToSelected events={events} selectedId={selectedId} />
      <LocateButton />
      <Markers groups={groups} selectedId={selectedId} onSelect={onSelect} />
    </MapContainer>
  );
}
