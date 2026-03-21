/**
 * Counter island — interactive counter with eager hydration.
 * Demonstrates basic Island Architecture with client-side state.
 */
import { Island } from '@formwork/ui';
import type { HydrationStrategy } from '@formwork/ui';

interface CounterProps {
  initialCount: number;
  label: string;
}

export const CounterIsland = Island<CounterProps>({
  name: 'Counter',
  hydration: 'eager' as HydrationStrategy,

  render(props: CounterProps): string {
    return `
      <div data-island="Counter" style="text-align: center;">
        <div style="font-size: 2rem; font-weight: 700; color: #4361ee;" data-counter-value>${props.initialCount}</div>
        <div style="color: #6c757d; margin-bottom: 0.5rem;">${props.label}</div>
        <div style="display: flex; gap: 0.5rem; justify-content: center;">
          <button class="btn" data-counter-dec style="padding: 0.25rem 0.75rem;">−</button>
          <button class="btn btn-primary" data-counter-inc style="padding: 0.25rem 0.75rem;">+</button>
        </div>
      </div>
    `;
  },
});
