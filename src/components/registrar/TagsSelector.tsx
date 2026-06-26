'use client';

import { PREDEFINED_TAGS } from '@/lib/constants/tags';
import type { TagDefinition } from '@/lib/constants/tags';

interface TagsSelectorProps {
  selected: string[];
  onChange: (tags: string[]) => void;
}

export default function TagsSelector({ selected, onChange }: TagsSelectorProps) {
  const toggleTag = (slug: string) => {
    if (selected.includes(slug)) {
      onChange(selected.filter((s) => s !== slug));
    } else {
      onChange([...selected, slug]);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-text">
        Selecciona los insumos que necesitas
      </h3>
      <p className="text-xs text-text-muted">
        Marca todos los insumos que se reciben en este centro de acopio
      </p>
      <div className="flex flex-wrap gap-2">
        {PREDEFINED_TAGS.map((tag: TagDefinition) => {
          const isSelected = selected.includes(tag.slug);
          return (
            <button
              key={tag.slug}
              type="button"
              onClick={() => toggleTag(tag.slug)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                isSelected
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white text-text-muted border-gray-200 hover:border-primary/40 hover:text-text'
              }`}
            >
              {tag.name}
            </button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <p className="text-xs text-text-muted">
          {selected.length} insumo{selected.length !== 1 ? 's' : ''} seleccionado{selected.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}
