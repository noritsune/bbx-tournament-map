import { useState, useMemo } from 'react';
import { MapView } from './components/MapView';
import { EventList } from './components/EventList';
import { EventDetail } from './components/EventDetail';
import { FilterBar } from './components/FilterBar';
import rawEvents from './data/events.json';
import type { TournamentEvent, EventType } from './types';
import { EVENT_TYPE_LABELS } from './types';

const ALL_TYPES = Object.keys(EVENT_TYPE_LABELS) as EventType[];
const events = rawEvents as TournamentEvent[];

export function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTypes, setActiveTypes] = useState<Set<EventType>>(new Set(ALL_TYPES));
  const [query, setQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const filteredEvents = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter(e => {
      if (!activeTypes.has(e.type)) return false;
      if (!q) return true;
      return (
        e.name.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q) ||
        e.prefecture.toLowerCase().includes(q) ||
        e.address.toLowerCase().includes(q)
      );
    });
  }, [activeTypes, query]);

  const selectedEvent = selectedId ? events.find(e => e.id === selectedId) ?? null : null;

  function handleSelect(event: TournamentEvent) {
    setSelectedId(event.id);
    if (window.innerWidth < 768) setSidebarOpen(false);
  }

  function toggleType(type: EventType) {
    setActiveTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }

  return (
    <div className="app">
      <header className="app-header">
        <button
          className="app-header__menu"
          onClick={() => setSidebarOpen(o => !o)}
          aria-label="メニューを開く"
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>
        <div className="app-header__title">
          <span className="app-header__logo">⚡</span>
          <span>BBX 大会マップ</span>
        </div>
        <a
          className="app-header__official"
          href="https://beyblade.takaratomy.co.jp/beyblade-x/event/schedule.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          公式スケジュール ↗
        </a>
      </header>

      <div className="app-body">
        <aside className={`sidebar${sidebarOpen ? ' sidebar--open' : ''}`}>
          <FilterBar
            activeTypes={activeTypes}
            onToggle={toggleType}
            query={query}
            onQueryChange={setQuery}
          />
          <div className="sidebar__count">
            {filteredEvents.length} 件の大会
          </div>
          <EventList
            events={filteredEvents}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </aside>

        <main className="map-wrapper">
          <MapView
            events={filteredEvents}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
          {selectedEvent && (
            <div className="detail-overlay">
              <EventDetail
                event={selectedEvent}
                onClose={() => setSelectedId(null)}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
