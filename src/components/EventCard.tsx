import type { TournamentEvent } from '../types';
import { getBadgeLabel, getBadgeColor } from '../types';
import { formatDate } from '../utils/date';

interface Props {
  event: TournamentEvent;
  selected: boolean;
  onClick: () => void;
}

export function EventCard({ event, selected, onClick }: Props) {
  const color = getBadgeColor(event);
  const label = getBadgeLabel(event);

  return (
    <button
      className={`event-card${selected ? ' event-card--selected' : ''}`}
      onClick={onClick}
      style={{ borderLeftColor: color }}
    >
      <div className="event-card__header">
        <span className="event-card__badge" style={{ background: color }}>
          {label}
        </span>
        <span className="event-card__date">{formatDate(event.startDate)}</span>
      </div>
      <p className="event-card__name">{event.name}</p>
      <p className="event-card__venue">
        <span className="event-card__pref">{event.prefecture}</span>
        {event.venue}
      </p>
    </button>
  );
}
