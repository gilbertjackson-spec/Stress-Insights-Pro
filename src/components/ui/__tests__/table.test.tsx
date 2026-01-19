import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
} from '../table';

describe('Table Components', () => {
    it('should render a complete table structure', () => {
        render(
            <Table>
                <TableCaption>Test Table Caption</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Header 1</TableHead>
                        <TableHead>Header 2</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>Cell 1</TableCell>
                        <TableCell>Cell 2</TableCell>
                    </TableRow>
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell>Footer 1</TableCell>
                        <TableCell>Footer 2</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        );

        expect(screen.getByText('Test Table Caption')).toBeInTheDocument();
        expect(screen.getByText('Header 1')).toBeInTheDocument();
        expect(screen.getByText('Cell 1')).toBeInTheDocument();
        expect(screen.getByText('Footer 1')).toBeInTheDocument();

        const table = screen.getByRole('table');
        expect(table).toBeInTheDocument();
    });

    it('should apply custom classNames to table elements', () => {
        const { container } = render(
            <Table className="custom-table">
                <TableHeader className="custom-header">
                    <TableRow className="custom-row">
                        <TableHead className="custom-head">Head</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="custom-body">
                    <TableRow>
                        <TableCell className="custom-cell">Cell</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        );

        expect(container.querySelector('.custom-table')).toBeInTheDocument();
        expect(container.querySelector('.custom-header')).toBeInTheDocument();
        // TableRow/Head/Cell might have complex class merging, but custom classes should be present
        expect(container.querySelector('.custom-row')).toBeInTheDocument();
        expect(container.querySelector('.custom-head')).toBeInTheDocument();
        expect(container.querySelector('.custom-body')).toBeInTheDocument();
        expect(container.querySelector('.custom-cell')).toBeInTheDocument();
    });

    it('should render correctly with different cell types', () => {
        render(
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <button>Action</button>
                        </TableCell>
                        <TableCell>
                            <span>Text</span>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        );

        expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument();
        expect(screen.getByText('Text')).toBeInTheDocument();
    });
});
