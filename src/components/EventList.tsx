import type { TournamentEvent } from '../types';
import { EventCard } from './EventCard';

interface Props {
  events: TournamentEvent[];
  selectedId: string | null;
  onSelect: (event: TournamentEvent) => void;
}

export function EventList({ events, selectedId, onSelect }: Props) {
  if (events.length === 0) {
    return (
      <div className="event-list__empty">
        <p>該当する大会が見つかりません</p>
      </div>
    );
  }

  return (
    <div className="event-list">
      {events.map(event => (
        <EventCard
          key={event.id}
          event={event}
          selected={event.id === selectedId}
          onClick={() => onSelect(event)}
        />
      ))}
    </div>
  );
}
