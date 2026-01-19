import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';

/**
 * Wrapper customizado para testes que inclui providers necessários
 */
function AllTheProviders({ children }: { children: ReactNode }) {
    return <>{children}</>;
}

/**
 * Função de render customizada que inclui todos os providers
 */
export function renderWithProviders(
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>
) {
    return render(ui, { wrapper: AllTheProviders, ...options });
}

/**
 * Mock de dados de usuário para testes
 */
export const mockUser = {
    uid: 'test-user-id',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: null,
};

/**
 * Mock de dados de empresa para testes
 */
export const mockCompany = {
    id: 'test-company-id',
    name: 'Test Company',
    cnpj: '12.345.678/0001-90',
    status: 'active' as const,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
};

/**
 * Mock de dados de pesquisa para testes
 */
export const mockSurvey = {
    id: 'test-survey-id',
    title: 'Test Survey',
    description: 'Test survey description',
    companyId: 'test-company-id',
    status: 'active' as const,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
};

/**
 * Mock de deployment de pesquisa para testes
 */
export const mockDeployment = {
    id: 'test-deployment-id',
    surveyId: 'test-survey-id',
    companyId: 'test-company-id',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    totalInvited: 100,
    totalResponses: 50,
    status: 'active' as const,
};

/**
 * Mock de resposta de pesquisa para testes
 */
export const mockResponse = {
    id: 'test-response-id',
    deploymentId: 'test-deployment-id',
    surveyId: 'test-survey-id',
    companyId: 'test-company-id',
    demographics: {
        age: '25-34',
        gender: 'male',
        sector: 'IT',
        position: 'Developer',
    },
    answers: {},
    createdAt: new Date('2024-01-15'),
};

/**
 * Função helper para criar delay em testes assíncronos
 */
export const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Re-exportar tudo do testing-library para conveniência
 */
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
