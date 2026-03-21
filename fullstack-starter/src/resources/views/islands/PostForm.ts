/**
 * PostForm island — eager hydrated form with live validation.
 * Uses @formwork/ui useForm for client-side form state management.
 */
import { Island } from '@formwork/ui';
import type { HydrationStrategy } from '@formwork/ui';

interface PostFormProps {
  categories: Array<{ id: number; slug: string; name: string }>;
  post: { id: number; title: string; body: string; category: string; status: string } | null;
  submitUrl: string;
  method: string;
}

export const PostFormIsland = Island<PostFormProps>({
  name: 'PostForm',
  hydration: 'eager' as HydrationStrategy,

  render(props: PostFormProps): string {
    const categoryOptions = props.categories
      .map(
        (c) =>
          `<option value="${c.slug}" ${props.post?.category === c.slug ? 'selected' : ''}>${c.name}</option>`,
      )
      .join('');

    return `
      <div data-island="PostForm">
        <form data-post-form action="${props.submitUrl}" method="POST" style="display: flex; flex-direction: column; gap: 1.25rem;">
          ${props.method !== 'POST' ? `<input type="hidden" name="_method" value="${props.method}">` : ''}

          <div>
            <label for="title" style="display: block; margin-bottom: 0.25rem; font-weight: 500;">Title</label>
            <input type="text" id="title" name="title" required minlength="3" maxlength="200"
              value="${props.post?.title ?? ''}"
              style="width: 100%; padding: 0.5rem; border: 1px solid #dee2e6; border-radius: 6px; font-size: 1rem;" />
            <div data-error="title" style="color: #dc3545; font-size: 0.85rem; margin-top: 0.25rem;"></div>
          </div>

          <div>
            <label for="category" style="display: block; margin-bottom: 0.25rem; font-weight: 500;">Category</label>
            <select id="category" name="category" required
              style="width: 100%; padding: 0.5rem; border: 1px solid #dee2e6; border-radius: 6px; font-size: 1rem;">
              <option value="">Select category...</option>
              ${categoryOptions}
            </select>
            <div data-error="category" style="color: #dc3545; font-size: 0.85rem; margin-top: 0.25rem;"></div>
          </div>

          <div>
            <label for="body" style="display: block; margin-bottom: 0.25rem; font-weight: 500;">Content</label>
            <textarea id="body" name="body" required minlength="20" rows="12"
              style="width: 100%; padding: 0.5rem; border: 1px solid #dee2e6; border-radius: 6px; font-size: 1rem; font-family: inherit;">${props.post?.body ?? ''}</textarea>
            <div data-error="body" style="color: #dc3545; font-size: 0.85rem; margin-top: 0.25rem;"></div>
          </div>

          <div>
            <label for="status" style="display: block; margin-bottom: 0.25rem; font-weight: 500;">Status</label>
            <select id="status" name="status"
              style="width: 100%; padding: 0.5rem; border: 1px solid #dee2e6; border-radius: 6px; font-size: 1rem;">
              <option value="draft" ${props.post?.status === 'draft' || !props.post ? 'selected' : ''}>Draft</option>
              <option value="published" ${props.post?.status === 'published' ? 'selected' : ''}>Published</option>
            </select>
          </div>

          <div style="display: flex; gap: 1rem; justify-content: flex-end;">
            <a href="/posts" class="btn" style="background: #f8f9fa; border: 1px solid #dee2e6; color: #495057;">Cancel</a>
            <button type="submit" class="btn btn-primary" data-submit-btn>
              ${props.post ? 'Update Post' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    `;
  },
});
