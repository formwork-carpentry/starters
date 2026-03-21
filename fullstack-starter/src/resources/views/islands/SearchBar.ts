/**
 * SearchBar island — lazy hydrated search input.
 * Only hydrates when the user scrolls near the component.
 */
import { Island } from '@formwork/ui';
import type { HydrationStrategy } from '@formwork/ui';

interface SearchBarProps {
  placeholder: string;
  action: string;
}

export const SearchBarIsland = Island<SearchBarProps>({
  name: 'SearchBar',
  hydration: 'lazy' as HydrationStrategy,

  render(props: SearchBarProps): string {
    return `
      <div data-island="SearchBar" style="position: relative;">
        <form action="${props.action}" method="GET" style="display: flex; gap: 0.5rem;">
          <input
            type="search"
            name="q"
            placeholder="${props.placeholder}"
            data-search-input
            style="flex: 1; padding: 0.75rem 1rem; border: 1px solid #dee2e6; border-radius: 8px; font-size: 1rem; outline: none;"
          />
          <button type="submit" class="btn btn-primary">Search</button>
        </form>
        <div data-search-results style="position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid #dee2e6; border-radius: 0 0 8px 8px; display: none; z-index: 10;"></div>
      </div>
    `;
  },
});
