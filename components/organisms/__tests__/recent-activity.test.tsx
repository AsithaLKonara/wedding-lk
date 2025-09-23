import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RecentActivity } from '../recent-activity';

describe('RecentActivity', () => {
  it('renders the Recent Activity card and activities', () => {
    render(<RecentActivity />);
    expect(screen.getByRole('region', { name: /recent activity/i })).toBeInTheDocument();
    expect(screen.getByText(/Recent Activity/i)).toBeInTheDocument();
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0);
  });
});

