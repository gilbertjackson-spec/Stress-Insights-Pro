'use client';
import type { ElementType } from "react";
import { Briefcase, HeartHandshake, Hourglass, RefreshCw, SlidersHorizontal, UserCheck, Users } from "lucide-react";

export const DOMAIN_QUESTIONS_MAP: Record<string, string[]> = {
  'Papéis': ['Q-01', 'Q-04', 'Q-11', 'Q-13', 'Q-17'],
  'Controle': ['Q-02', 'Q-10', 'Q-15', 'Q-19', 'Q-25', 'Q-30'],
  'Demandas': ['Q-03', 'Q-06', 'Q-09', 'Q-12', 'Q-16', 'Q-18', 'Q-20', 'Q-22'],
  'Relacionamentos': ['Q-05', 'Q-14', 'Q-21', 'Q-34'],
  'Suporte dos Colegas': ['Q-07', 'Q-24', 'Q-27', 'Q-31'],
  'Suporte da Gestão': ['Q-08', 'Q-23', 'Q-29', 'Q-33', 'Q-35'],
  'Mudanças': ['Q-26', 'Q-28', 'Q-32'],
};

export const LIKERT_SCALE = ["Nunca", "Raramente", "Às vezes", "Muitas vezes", "Sempre"];
export const INVERTED_DOMAINS = ['Demandas', 'Relacionamentos'];

export const DEMOGRAPHIC_FILTERS = {
  unit: 'Unidade',
  sector: 'Setor',
  position: 'Cargo',
  age_range: 'Faixa Etária',
  gender: 'Gênero',
  current_role_time: 'Tempo no cargo',
};

export const DOMAIN_ICONS: Record<string, ElementType> = {
    "Papéis": Briefcase,
    "Controle": SlidersHorizontal,
    "Demandas": Hourglass,
    "Relacionamentos": HeartHandshake,
    "Suporte dos Colegas": Users,
    "Suporte da Gestão": UserCheck,
    "Mudanças": RefreshCw,
};

export const DEMO_OPTIONS = {
  units: ['Unidade 01', 'Unidade 02', 'Unidade 03'],
  sectors: ['Setor 01', 'Setor 02', 'Setor 03', 'Setor 04', 'Setor 05'],
  positions: ['Cargo 01', 'Cargo 02', 'Cargo 03'],
  current_role_times: ['Menos de 1 ano', 'Entre 1 e 2 anos', 'Entre 2 e 5 anos', 'Mais de 5 anos'],
  age_ranges: ['18-24', '25-34', '35-44', '45-54', '55+'],
  genders: ['Masculino', 'Feminino', 'Outro', 'Prefiro não dizer'],
  health_issues: ['Sim', 'Não', 'Prefiro não dizer'] as ('Sim' | 'Não' | 'Prefiro não dizer')[],
};

// Demographic form fields configuration
export const DEMO_FIELDS: { name: 'unit' | 'sector' | 'position' | 'age_range' | 'current_role_time' | 'gender'; label: string; options: { id: string; name: string }[] }[] = [
    { name: 'unit', label: 'Unidade', options: [] }, // Options populated from props
    { name: 'sector', label: 'Setor', options: [] }, // Options populated from props
    { name: 'position', label: 'Cargo', options: [] }, // Options populated from props
    { name: 'age_range', label: 'Faixa Etária', options: DEMO_OPTIONS.age_ranges.map(o => ({id: o, name: o})) },
    { name: 'current_role_time', label: 'Tempo no Cargo Atual', options: DEMO_OPTIONS.current_role_times.map(o => ({id: o, name: o})) },
    { name: 'gender', label: 'Gênero', options: DEMO_OPTIONS.genders.map(o => ({id: o, name: o})) },
];
