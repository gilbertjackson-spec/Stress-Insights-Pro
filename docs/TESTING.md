# 🧪 Guia de Testes - Stress Insights Pro

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Estrutura de Testes](#estrutura-de-testes)
- [Como Executar](#como-executar)
- [Escrevendo Testes](#escrevendo-testes)
- [Mocks e Utilitários](#mocks-e-utilitários)
- [Cobertura de Código](#cobertura-de-código)
- [CI/CD](#cicd)
- [Boas Práticas](#boas-práticas)

---

## 🌟 Visão Geral

Este projeto utiliza **Vitest** como framework de testes, combinado com **React Testing Library** para testes de componentes. O objetivo é garantir a qualidade e confiabilidade do código através de testes automatizados.

### ✅ Status Atual

- ✅ Vitest configurado
- ✅ React Testing Library configurado
- ✅ Mocks do Next.js e Firebase
- ✅ Utilitários de teste
- ✅ Coverage configurado
- ✅ CI/CD com testes
- ✅ 16 testes passando (Button + Card)

---

## 🔧 Tecnologias

- **[Vitest](https://vitest.dev/)** - Framework de testes rápido e moderno
- **[React Testing Library](https://testing-library.com/react)** - Testes de componentes React
- **[@testing-library/jest-dom](https://github.com/testing-library/jest-dom)** - Matchers customizados
- **[@testing-library/user-event](https://testing-library.com/docs/user-event/intro)** - Simulação de eventos de usuário
- **[jsdom](https://github.com/jsdom/jsdom)** - Ambiente DOM para testes
- **[@vitest/ui](https://vitest.dev/guide/ui.html)** - Interface visual para testes
- **[@vitest/coverage-v8](https://vitest.dev/guide/coverage.html)** - Relatórios de cobertura

---

## 📁 Estrutura de Testes

```
src/
├── test/
│   ├── setup.ts              # Configuração global de testes
│   └── utils.tsx             # Utilitários e mocks
├── components/
│   └── ui/
│       ├── __tests__/        # Testes de componentes UI
│       │   ├── button.test.tsx
│       │   └── card.test.tsx
│       ├── button.tsx
│       └── card.tsx
└── ...
```

### Convenções de Nomenclatura

- Arquivos de teste: `*.test.tsx` ou `*.spec.tsx`
- Pasta de testes: `__tests__/` dentro do diretório do componente
- Mocks: `*.mock.ts` ou dentro de `__mocks__/`

---

## 🚀 Como Executar

### Scripts Disponíveis

```bash
# Executar todos os testes (modo CI)
npm test

# Executar testes em modo watch (desenvolvimento)
npm run test:watch

# Executar testes com interface visual
npm run test:ui

# Executar testes com relatório de cobertura
npm run test:coverage
```

### Executar Testes Específicos

```bash
# Executar testes de um arquivo específico
npm test button.test.tsx

# Executar testes que correspondem a um padrão
npm test -- --grep="Button"

# Executar apenas testes modificados
npm run test:watch -- --changed
```

---

## ✍️ Escrevendo Testes

### Estrutura Básica

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import { MeuComponente } from '../meu-componente';

describe('MeuComponente', () => {
  it('should render correctly', () => {
    render(<MeuComponente />);
    expect(screen.getByText('Texto esperado')).toBeInTheDocument();
  });
});
```

### Exemplo Completo

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '@/test/utils';
import { Button } from '../button';

describe('Button Component', () => {
  it('should call onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick} disabled>Click me</Button>);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

---

## 🎭 Mocks e Utilitários

### Utilitários Disponíveis

#### `renderWithProviders`

Renderiza componentes com todos os providers necessários:

```typescript
import { renderWithProviders } from '@/test/utils';

renderWithProviders(<MeuComponente />);
```

#### Mocks de Dados

```typescript
import { 
  mockUser, 
  mockCompany, 
  mockSurvey,
  mockDeployment,
  mockResponse 
} from '@/test/utils';

// Usar em testes
const { id, name } = mockCompany;
```

### Mocks Globais

#### Next.js Router

```typescript
// Já mockado globalmente em src/test/setup.ts
// Usar diretamente nos testes
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push('/dashboard');
```

#### Firebase

```typescript
// Mock customizado por teste
vi.mock('@/firebase/config', () => ({
  auth: {
    currentUser: mockUser,
  },
  db: {
    collection: vi.fn(),
  },
}));
```

### Criar Mocks Customizados

```typescript
import { vi } from 'vitest';

// Mock de função
const mockFn = vi.fn();
mockFn.mockReturnValue('valor');
mockFn.mockResolvedValue('valor async');

// Mock de módulo
vi.mock('@/lib/utils', () => ({
  formatDate: vi.fn(() => '01/01/2024'),
}));
```

---

## 📊 Cobertura de Código

### Gerar Relatório de Cobertura

```bash
npm run test:coverage
```

### Visualizar Relatório

Após executar o comando acima, abra:

```
coverage/index.html
```

### Configuração de Cobertura

Configurado em `vitest.config.ts`:

```typescript
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'html', 'lcov'],
  exclude: [
    'node_modules/',
    'src/test/',
    '**/*.d.ts',
    '**/*.config.*',
    '**/mockData',
    'src/app/**', // Testar com E2E
  ],
}
```

### Metas de Cobertura

| Métrica | Meta | Atual |
|---------|------|-------|
| Statements | 80% | - |
| Branches | 75% | - |
| Functions | 80% | - |
| Lines | 80% | - |

---

## 🔄 CI/CD

### GitHub Actions

Os testes são executados automaticamente em cada push e pull request:

```yaml
- name: Run tests
  run: npm run test:coverage

- name: Upload coverage reports
  uses: codecov/codecov-action@v4
  with:
    token: ${{ secrets.CODECOV_TOKEN }}
    files: ./coverage/lcov.info
```

### Codecov

Para habilitar relatórios de cobertura no Codecov:

1. Acesse [codecov.io](https://codecov.io)
2. Conecte seu repositório GitHub
3. Copie o token
4. Adicione como secret no GitHub: `CODECOV_TOKEN`

---

## 📚 Boas Práticas

### 1. Teste Comportamento, Não Implementação

❌ **Ruim:**
```typescript
expect(component.state.count).toBe(1);
```

✅ **Bom:**
```typescript
expect(screen.getByText('Count: 1')).toBeInTheDocument();
```

### 2. Use Queries Acessíveis

Ordem de prioridade:

1. `getByRole` - ✅ Melhor
2. `getByLabelText` - ✅ Bom
3. `getByPlaceholderText` - ⚠️ OK
4. `getByText` - ⚠️ OK
5. `getByTestId` - ❌ Último recurso

```typescript
// ✅ Melhor
screen.getByRole('button', { name: /submit/i });

// ❌ Evitar
screen.getByTestId('submit-button');
```

### 3. Simule Interações Reais

```typescript
import { userEvent } from '@/test/utils';

const user = userEvent.setup();

// ✅ Simula interação real
await user.click(button);
await user.type(input, 'texto');

// ❌ Evitar
fireEvent.click(button);
```

### 4. Teste Estados de Loading e Erro

```typescript
it('should show loading state', () => {
  render(<MeuComponente loading />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});

it('should show error state', () => {
  render(<MeuComponente error="Erro!" />);
  expect(screen.getByText(/erro/i)).toBeInTheDocument();
});
```

### 5. Organize Testes com describe

```typescript
describe('MeuComponente', () => {
  describe('when user is logged in', () => {
    it('should show dashboard', () => {
      // ...
    });
  });

  describe('when user is not logged in', () => {
    it('should show login form', () => {
      // ...
    });
  });
});
```

### 6. Use beforeEach para Setup Comum

```typescript
describe('MeuComponente', () => {
  let mockFn: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFn = vi.fn();
  });

  it('test 1', () => {
    // mockFn está limpo
  });

  it('test 2', () => {
    // mockFn está limpo novamente
  });
});
```

### 7. Teste Casos de Borda

```typescript
describe('Input Component', () => {
  it('should handle empty value', () => {
    render(<Input value="" />);
    // ...
  });

  it('should handle very long value', () => {
    render(<Input value={'a'.repeat(1000)} />);
    // ...
  });

  it('should handle special characters', () => {
    render(<Input value="<script>alert('xss')</script>" />);
    // ...
  });
});
```

---

## 🎯 Próximos Passos

### Testes Pendentes

- [ ] Testes de componentes admin
- [ ] Testes de componentes dashboard
- [ ] Testes de charts
- [ ] Testes de hooks customizados
- [ ] Testes de utilitários
- [ ] Testes de integração com Firebase
- [ ] Testes E2E com Playwright

### Melhorias Planejadas

- [ ] Aumentar cobertura para 80%+
- [ ] Adicionar testes de snapshot
- [ ] Configurar testes de performance
- [ ] Adicionar testes de acessibilidade (a11y)
- [ ] Configurar testes visuais de regressão

---

## 📞 Suporte

Para dúvidas sobre testes:

1. Consulte a [documentação do Vitest](https://vitest.dev/)
2. Consulte a [documentação do React Testing Library](https://testing-library.com/react)
3. Veja exemplos em `src/components/ui/__tests__/`
4. Abra uma issue no GitHub

---

**Desenvolvido com 🧪 e ❤️**
