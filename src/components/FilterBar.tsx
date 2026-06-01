import type { AgeCategory, TournamentGrade } from '../types';
import { AGE_CATEGORY_LABELS, GRADE_LABELS, GRADE_COLORS } from '../types';

const ALL_GRADES: TournamentGrade[] = ['G3', 'G2', 'G1', 'S1', 'other'];
const ALL_AGES: AgeCategory[] = ['open', 'regular'];

interface Props {
  activeAgeCategories: Set<AgeCategory>;
  onToggleAge: (cat: AgeCategory) => void;
  activeGrades: Set<TournamentGrade>;
  onToggleGrade: (grade: TournamentGrade) => void;
  query: string;
  onQueryChange: (q: string) => void;
}

export function FilterBar({
  activeAgeCategories,
  onToggleAge,
  activeGrades,
  onToggleGrade,
  query,
  onQueryChange,
}: Props) {
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

      <div className="filter-section">
        <p className="filter-section__label">年齢区分</p>
        <div className="filter-checks">
          {ALL_AGES.map(cat => (
            <label key={cat} className="filter-check">
              <input
                type="checkbox"
                checked={activeAgeCategories.has(cat)}
                onChange={() => onToggleAge(cat)}
              />
              <span>{AGE_CATEGORY_LABELS[cat]}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <p className="filter-section__label">大会タイプ</p>
        <div className="filter-checks">
          {ALL_GRADES.map(grade => (
            <label key={grade} className="filter-check">
              <input
                type="checkbox"
                checked={activeGrades.has(grade)}
                onChange={() => onToggleGrade(grade)}
              />
              <span
                className="filter-check__badge"
                style={{ background: GRADE_COLORS[grade] }}
              >
                {GRADE_LABELS[grade]}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
