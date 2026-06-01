export type EventType =
  | 'b4store'
  | 's1'
  | 'ambassador'
  | 'extreme-cup'
  | 'casual-battle'
  | 'tour'
  | 'other'
  | 'fan';

export interface TournamentEvent {
  id: string;
  name: string;
  type: EventType;
  date: string;
  endDate?: string;
  venue: string;
  address: string;
  prefecture: string;
  lat: number;
  lng: number;
  url?: string;
  note?: string;
}

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  'b4store': 'B4ストア',
  's1': 'S1イベント',
  'ambassador': 'アンバサダー',
  'extreme-cup': 'エクストリームカップ',
  'casual-battle': 'カジュアルバトルデイ',
  'tour': '出張イベント',
  'other': 'その他',
  'fan': 'ファン主催',
};

export const EVENT_TYPE_COLORS: Record<EventType, string> = {
  'b4store': '#e63946',
  's1': '#f4a261',
  'ambassador': '#2a9d8f',
  'extreme-cup': '#e9c46a',
  'casual-battle': '#457b9d',
  'tour': '#a8dadc',
  'other': '#8ecae6',
  'fan': '#b5838d',
};
