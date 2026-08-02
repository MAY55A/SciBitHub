import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PaginationLink } from './pagination';

describe('PaginationLink disabled behaviour', () => {
    it('does not call onClick when disabled and clicked', async () => {
        const onClick = vi.fn();
        const user = userEvent.setup();
        render(
            <PaginationLink disabled onClick={onClick}>
                Next
            </PaginationLink>
        );

        await user.click(screen.getByText('Next'));
        expect(onClick).not.toHaveBeenCalled();
    });

    it('is removed from tab order when disabled', () => {
        render(
            <PaginationLink disabled onClick={vi.fn()}>
                Next
            </PaginationLink>
        );
        expect(screen.getByText('Next')).toHaveAttribute('tabindex', '-1');
    });

    it('cannot be keyboard-activated (Enter) when disabled', async () => {
        const onClick = vi.fn();
        render(
            <PaginationLink disabled onClick={onClick}>
                Next
            </PaginationLink>
        );

        const link = screen.getByText('Next');
        link.focus();
        await userEvent.keyboard('{Enter}');
        expect(onClick).not.toHaveBeenCalled();
    });

    it('exposes aria-disabled for assistive tech', () => {
        render(
            <PaginationLink disabled onClick={vi.fn()}>
                Next
            </PaginationLink>
        );
        expect(screen.getByText('Next')).toHaveAttribute('aria-disabled', 'true');
    });

    it('still calls onClick when not disabled (regression check)', async () => {
        const onClick = vi.fn();
        const user = userEvent.setup();
        render(
            <PaginationLink onClick={onClick}>
                Next
            </PaginationLink>
        );

        await user.click(screen.getByText('Next'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('is reachable in tab order when not disabled', () => {
        render(
            <PaginationLink onClick={vi.fn()}>
                Next
            </PaginationLink>
        );
        expect(screen.getByText('Next')).not.toHaveAttribute('tabindex', '-1');
    });

    it('does not set aria-disabled when enabled', () => {
        render(
            <PaginationLink onClick={vi.fn()}>
                Next
            </PaginationLink>
        );
        expect(screen.getByText('Next')).not.toHaveAttribute('aria-disabled');
    });
});
