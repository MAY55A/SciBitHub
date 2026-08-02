import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CustomPagination from './pagination';

const push = vi.fn();
let currentSearchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
    usePathname: () => '/projects',
    useSearchParams: () => currentSearchParams,
    useRouter: () => ({ push }),
}));

describe('CustomPagination', () => {
    beforeEach(() => {
        push.mockClear();
        currentSearchParams = new URLSearchParams();
    });

    it('does not navigate when clicking Previous on the first page', async () => {
        const user = userEvent.setup();
        render(<CustomPagination totalPages={5} />);

        const prev = screen.getByLabelText('Go to previous page');
        expect(prev).toHaveAttribute('aria-disabled', 'true');
        expect(prev).toHaveAttribute('tabindex', '-1');

        await user.click(prev);
        expect(push).not.toHaveBeenCalled();
    });

    it('does not navigate when activating Previous via keyboard on the first page', async () => {
        const user = userEvent.setup();
        render(<CustomPagination totalPages={5} />);

        await user.tab();
        expect(screen.getByLabelText('Go to previous page')).not.toHaveFocus();

        screen.getByLabelText('Go to previous page').focus();
        await user.keyboard('{Enter}');
        expect(push).not.toHaveBeenCalled();
    });

    it('does not navigate when clicking Next on the last page', async () => {
        const user = userEvent.setup();
        render(<CustomPagination totalPages={1} />);

        const next = screen.getByLabelText('Go to next page');
        expect(next).toHaveAttribute('aria-disabled', 'true');

        await user.click(next);
        expect(push).not.toHaveBeenCalled();
    });

    it('navigates to the next page when Next is enabled', async () => {
        const user = userEvent.setup();
        render(<CustomPagination totalPages={5} />);

        const next = screen.getByLabelText('Go to next page');
        expect(next).not.toHaveAttribute('aria-disabled', 'true');

        await user.click(next);
        expect(push).toHaveBeenCalledWith('/projects?page=2');
    });

    it('navigates to the previous page when Previous is enabled', async () => {
        currentSearchParams = new URLSearchParams('page=2');
        const user = userEvent.setup();
        render(<CustomPagination totalPages={5} />);

        const prev = screen.getByLabelText('Go to previous page');
        expect(prev).not.toHaveAttribute('aria-disabled', 'true');

        await user.click(prev);
        expect(push).toHaveBeenCalledWith('/projects?page=1');
    });
});
