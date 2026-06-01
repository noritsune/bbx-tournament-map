import type { EventType } from '../types';
import { EVENT_TYPE_COLORS, EVENT_TYPE_LABELS } from '../types';

const ALL_TYPES = Object.keys(EVENT_TYPE_LABELS) as EventType[];

interface Props {
  activeTypes: Set<EventType>;
  onToggle: (type: EventType) => void;
  query: string;
  onQueryChange: (q: string) => void;
}

export function FilterBar({ activeTypes, onToggle, query, onQueryChange }: Props) {
  return (
    <div className="filter-bar">
      <div className="filter-bar__search">
        <input
          type="search"
          className="filter-bar__input"
          placeholder="会場名・都道府県を検索"
          value={query}
          onChange={e => onQueryChange(e.target.value)}
        />
      </div>
      <div className="filter-bar__types">
        {ALL_TYPES.map(type => {
          const active = activeTypes.has(type);
          return (
            <button
              key={type}
              className={`filter-chip${active ? ' filter-chip--active' : ''}`}
              style={active ? { background: EVENT_TYPE_COLORS[type], borderColor: EVENT_TYPE_COLORS[type] } : {}}
              onClick={() => onToggle(type)}
            >
              {EVENT_TYPE_LABELS[type]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
