import type { TournamentEvent } from '../types';
import { EVENT_TYPE_COLORS, EVENT_TYPE_LABELS } from '../types';
import { formatDate } from '../utils/date';

interface Props {
  event: TournamentEvent;
  selected: boolean;
  onClick: () => void;
}

export function EventCard({ event, selected, onClick }: Props) {
  const color = EVENT_TYPE_COLORS[event.type];

  return (
    <button
      className={`event-card${selected ? ' event-card--selected' : ''}`}
      onClick={onClick}
      style={{ borderLeftColor: color }}
    >
      <div className="event-card__header">
        <span className="event-card__badge" style={{ background: color }}>
          {EVENT_TYPE_LABELS[event.type]}
        </span>
        <span className="event-card__date">{formatDate(event.date)}</span>
      </div>
      <p className="event-card__name">{event.name}</p>
      <p className="event-card__venue">
        <span className="event-card__pref">{event.prefecture}</span>
        {event.venue}
      </p>
    </button>
  );
}
