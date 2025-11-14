import type { Icon } from "lucide-react";
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
  age_range: 'Faixa Etária',
  current_role_time: 'Tempo no cargo',
};

export const DOMAIN_ICONS: Record<string, Icon> = {
    "Papéis": Briefcase,
    "Controle": SlidersHorizontal,
    "Demandas": Hourglass,
    "Relacionamentos": HeartHandshake,
    "Suporte dos Colegas": Users,
    "Suporte da Gestão": UserCheck,
    "Mudanças": RefreshCw,
};
