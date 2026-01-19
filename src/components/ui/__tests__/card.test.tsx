import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../card';

describe('Card Components', () => {
    describe('Card', () => {
        it('should render card with children', () => {
            render(
                <Card>
                    <div>Card content</div>
                </Card>
            );
            expect(screen.getByText('Card content')).toBeInTheDocument();
        });

        it('should apply custom className', () => {
            const { container } = render(
                <Card className="custom-class">
                    <div>Content</div>
                </Card>
            );
            const card = container.firstChild as HTMLElement;
            expect(card).toHaveClass('custom-class');
        });
    });

    describe('CardHeader', () => {
        it('should render card header', () => {
            render(
                <Card>
                    <CardHeader>
                        <div>Header content</div>
                    </CardHeader>
                </Card>
            );
            expect(screen.getByText('Header content')).toBeInTheDocument();
        });
    });

    describe('CardTitle', () => {
        it('should render card title', () => {
            render(
                <Card>
                    <CardHeader>
                        <CardTitle>Test Title</CardTitle>
                    </CardHeader>
                </Card>
            );
            expect(screen.getByText('Test Title')).toBeInTheDocument();
        });
    });

    describe('CardDescription', () => {
        it('should render card description', () => {
            render(
                <Card>
                    <CardHeader>
                        <CardDescription>Test Description</CardDescription>
                    </CardHeader>
                </Card>
            );
            expect(screen.getByText('Test Description')).toBeInTheDocument();
        });
    });

    describe('CardContent', () => {
        it('should render card content', () => {
            render(
                <Card>
                    <CardContent>
                        <p>Main content</p>
                    </CardContent>
                </Card>
            );
            expect(screen.getByText('Main content')).toBeInTheDocument();
        });
    });

    describe('CardFooter', () => {
        it('should render card footer', () => {
            render(
                <Card>
                    <CardFooter>
                        <p>Footer content</p>
                    </CardFooter>
                </Card>
            );
            expect(screen.getByText('Footer content')).toBeInTheDocument();
        });
    });

    describe('Complete Card', () => {
        it('should render complete card with all sections', () => {
            render(
                <Card>
                    <CardHeader>
                        <CardTitle>Card Title</CardTitle>
                        <CardDescription>Card Description</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Card Content</p>
                    </CardContent>
                    <CardFooter>
                        <p>Card Footer</p>
                    </CardFooter>
                </Card>
            );

            expect(screen.getByText('Card Title')).toBeInTheDocument();
            expect(screen.getByText('Card Description')).toBeInTheDocument();
            expect(screen.getByText('Card Content')).toBeInTheDocument();
            expect(screen.getByText('Card Footer')).toBeInTheDocument();
        });
    });
});
