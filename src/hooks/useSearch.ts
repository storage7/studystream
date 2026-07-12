import { useState, useMemo } from 'react';
import { Batch } from '../types';

interface SearchResult {
  type: 'batch' | 'subject' | 'lecture';
  id: string;
  title: string;
  subtitle: string;
  batchId: string;
  subjectId?: string;
  lectureId?: string;
}

export function useSearch(batches: Batch[]) {
  const [query, setQuery] = useState('');

  const results = useMemo((): SearchResult[] => {
    if (!query.trim() || query.length < 2) return [];
    const q = query.toLowerCase();
    const items: SearchResult[] = [];

    for (const batch of batches) {
      if (batch.name.toLowerCase().includes(q)) {
        items.push({
          type: 'batch',
          id: batch.id,
          title: batch.name,
          subtitle: `${batch.subjects.length} subjects`,
          batchId: batch.id,
        });
      }

      for (const subject of batch.subjects) {
        if (subject.name.toLowerCase().includes(q)) {
          items.push({
            type: 'subject',
            id: subject.id,
            title: subject.name,
            subtitle: `${batch.name} • ${subject.lectures.length} lectures`,
            batchId: batch.id,
            subjectId: subject.id,
          });
        }

        for (const lecture of subject.lectures) {
          if (lecture.title.toLowerCase().includes(q)) {
            items.push({
              type: 'lecture',
              id: lecture.id,
              title: lecture.title,
              subtitle: `${batch.name} → ${subject.name}`,
              batchId: batch.id,
              subjectId: subject.id,
              lectureId: lecture.id,
            });
          }
        }
      }
    }

    return items.slice(0, 20);
  }, [query, batches]);

  return { query, setQuery, results };
}
