import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import FigureDeck from './figureDeck';
import { useGame } from '../../hooks/useGame';
import { Figure, FigureCard } from '../../types/gameTypes';
import { render } from '../../services/testUtils';

vi.mock('../../hooks/useGame');

describe('RenderFigureCard', () => {
  const mockHandleClickCard = vi.fn();
  const mockSelectedCard = { cardID: 1, type: Figure.fig01 };

  beforeEach(() => {
    vi.resetAllMocks();
    (useGame as Mock).mockReturnValue({
      handleClickCard: mockHandleClickCard,
      selectedCard: mockSelectedCard,
    });
  });

  afterEach(() => {
    cleanup();
  });

  const mockCards: FigureCard[] = [
    { cardID: 1, type: Figure.fig01, isBlocked: false },
    { cardID: 2, type: Figure.fig02, isBlocked: true },
  ];

  it('renders without crashing', () => {
    render(<FigureDeck figures={mockCards} vertical={true} amount={3} />);
    expect(screen.getAllByRole('button')).toHaveLength(mockCards.length + 1);
  });

  it('renders without crashing when vertical', () => {
    render(
      <FigureDeck
        figures={
          [
            { cardID: 1, type: Figure.fig01, isBlocked: false },
            { cardID: 2, type: Figure.fig02, isBlocked: true },
            { cardID: 3, type: Figure.fig03, isBlocked: false },
            { cardID: 4, type: Figure.fig04, isBlocked: false },
            { cardID: 5, type: Figure.fig05, isBlocked: false },
            { cardID: 6, type: Figure.fig06, isBlocked: false },
            { cardID: 7, type: Figure.fig07, isBlocked: false },
            { cardID: 8, type: Figure.fig08, isBlocked: false },
            { cardID: 9, type: Figure.fig09, isBlocked: false },
            { cardID: 10, type: Figure.fig10, isBlocked: false },
            { cardID: 11, type: Figure.fig11, isBlocked: false },
            { cardID: 12, type: Figure.fig12, isBlocked: false },
            { cardID: 13, type: Figure.fig13, isBlocked: false },
            { cardID: 14, type: Figure.fig14, isBlocked: false },
            { cardID: 15, type: Figure.fig15, isBlocked: false },
            { cardID: 16, type: Figure.fig16, isBlocked: false },
            { cardID: 17, type: Figure.fig17, isBlocked: false },
            { cardID: 18, type: Figure.fig18, isBlocked: false },
            { cardID: 19, type: Figure.fige01, isBlocked: false },
            { cardID: 20, type: Figure.fige02, isBlocked: false },
            { cardID: 21, type: Figure.fige03, isBlocked: false },
            { cardID: 22, type: Figure.fige04, isBlocked: false },
            { cardID: 23, type: Figure.fige05, isBlocked: false },
            { cardID: 24, type: Figure.fige06, isBlocked: false },
            { cardID: 25, type: Figure.fige07, isBlocked: false },
          ] as FigureCard[]
        }
        vertical={true}
        amount={3}
      />
    );
    expect(screen.getAllByRole('button')).toHaveLength(26);
  });

  it('calls handleClickCard when a card is clicked', async () => {
    const user = userEvent.setup();
    render(<FigureDeck figures={mockCards} vertical={true} amount={3} />);
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[1]);
    expect(mockHandleClickCard).toHaveBeenCalledWith(mockCards[0]);
  });

  it('applies correct styles for selected and blocked cards', () => {
    render(<FigureDeck figures={mockCards} vertical={true} amount={3} />);
    const buttons = screen.getAllByRole('button');

    // Check styles for the first card (selected)
    expect(buttons[1]).toHaveStyle('transform: scale(1.1)');
    expect(buttons[1]).not.toHaveStyle('filter: brightness(0.5)');

    // Check styles for the second card (blocked)
    expect(buttons[2]).toHaveStyle('filter: brightness(0.5)');
  });

  it('Apply correct style on hover', async () => {
    const user = userEvent.setup();

    render(<FigureDeck figures={mockCards} vertical={true} amount={3} />);
    const buttons = screen.getAllByRole('button');

    // Hover on the first card
    await user.hover(buttons[1]);
    expect(buttons[1]).toHaveStyle('transform: scale(1.1)');
  });

  it('Render in vertical mode', () => {
    render(<FigureDeck figures={mockCards} vertical={true} amount={3} />);
    expect(screen.getByLabelText('Figure deck vertical')).toBeInTheDocument();
  });

  it('Render in horizontal mode', () => {
    render(<FigureDeck figures={mockCards} vertical={false} amount={3} />);
    expect(screen.getByLabelText('Figure deck horizontal')).toBeInTheDocument();
  });

  it('renders with chiquito size', () => {
    render(
      <FigureDeck
        figures={mockCards}
        vertical={true}
        amount={3}
        chiquito={true}
      />
    );
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toHaveStyle('width: 10vh');
      expect(button).toHaveStyle('height: 10vh');
    });
  });

  it('renders with default size', () => {
    render(
      <FigureDeck
        figures={mockCards}
        vertical={true}
        amount={3}
        chiquito={false}
      />
    );
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toHaveStyle('width: 12vh');
      expect(button).toHaveStyle('height: 12vh');
    });
  });
});
