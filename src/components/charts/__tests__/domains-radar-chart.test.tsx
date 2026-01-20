import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils';
import DomainsRadarChart from '../domains-radar-chart';
import type { DomainAnalysis } from '@/lib/types';

// Mock recharts library to avoid rendering complex SVG in JSDOM
vi.mock('recharts', async (importOriginal) => {
    const original = await importOriginal<typeof import('recharts')>();
    return {
        ...original,
        RadarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="radar-chart">{children}</div>,
        PolarGrid: () => <div data-testid="polar-grid" />,
        PolarAngleAxis: ({ dataKey }: { dataKey: string }) => <div data-testid="polar-angle-axis" data-key={dataKey} />,
        Radar: ({ name, dataKey }: { name: string, dataKey: string }) => <div data-testid={`radar-${name}`} data-key={dataKey} />,
        ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
        Tooltip: ({ children }: { children: React.ReactNode }) => <div data-testid="tooltip">{children}</div>,
    };
});

const mockData: DomainAnalysis[] = [
    {
        domain_id: '1',
        domain_name: 'Demandas',
        domain_score: 3.5,
        benchmark_private_sector: 3.2,
        percentile_25: 2.8,
        percentile_75: 4.0,
        questions_analysis: [],
        description: 'desc',
        strong_point: null,
        weak_point: null,
        text_result_high: '',
        text_result_low: '',
        text_result_medium: '',
    },
    {
        domain_id: '2',
        domain_name: 'Controle',
        domain_score: 4.1,
        benchmark_private_sector: 3.8,
        percentile_25: 3.0,
        percentile_75: 4.2,
        questions_analysis: [],
        description: 'desc',
        strong_point: null,
        weak_point: null,
        text_result_high: '',
        text_result_low: '',
        text_result_medium: '',
    },
];

describe('DomainsRadarChart Component', () => {
    it('should render the chart container', () => {
        render(<DomainsRadarChart data={mockData} />);
        expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
        expect(screen.getByTestId('radar-chart')).toBeInTheDocument();
    });

    it('should render a radar for score and benchmark', () => {
        render(<DomainsRadarChart data={mockData} />);
        const scoreRadar = screen.getByTestId('radar-Empresa');
        const benchmarkRadar = screen.getByTestId('radar-Benchmark');

        expect(scoreRadar).toBeInTheDocument();
        expect(scoreRadar).toHaveAttribute('data-key', 'score');
        
        expect(benchmarkRadar).toBeInTheDocument();
        expect(benchmarkRadar).toHaveAttribute('data-key', 'benchmark');
    });

    it('should render polar grid and angle axis', () => {
        render(<DomainsRadarChart data={mockData} />);
        
        expect(screen.getByTestId('polar-grid')).toBeInTheDocument();
        
        const axis = screen.getByTestId('polar-angle-axis');
        expect(axis).toBeInTheDocument();
        expect(axis).toHaveAttribute('data-key', 'name');
    });

    it('should handle empty data without crashing', () => {
        render(<DomainsRadarChart data={[]} />);
        expect(screen.getByTestId('radar-chart')).toBeInTheDocument();
    });
});
