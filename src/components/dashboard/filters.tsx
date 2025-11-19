import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEMOGRAPHIC_FILTERS } from "@/lib/constants";
import type { Filters } from "@/lib/analysis";
import type { DashboardData } from "@/lib/types";

interface DashboardFiltersProps {
    options: DashboardData['demographic_options'];
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
    disabled: boolean;
}

export default function DashboardFilters({ options, filters, setFilters, disabled }: DashboardFiltersProps) {
    const handleFilterChange = (filterName: keyof Filters) => (value: string) => {
        setFilters(prev => ({ ...prev, [filterName]: value === 'all' ? 'all' : value }));
    };
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {Object.entries(DEMOGRAPHIC_FILTERS).map(([key, label]) => (
                <div key={key}>
                    <Select
                        value={filters[key as keyof Filters] || 'all'}
                        onValueChange={handleFilterChange(key as keyof Filters)}
                        disabled={disabled}
                    >
                        <SelectTrigger className="w-full bg-card">
                            <SelectValue placeholder={label} />
                        </SelectTrigger>
                        <SelectContent>
                            {options[(key + 's') as keyof typeof options]?.map((option, index) => (
                                <SelectItem key={`${option}-${index}`} value={option}>
                                    {option === 'all' ? `Todos os ${label.toLowerCase()}s` : option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            ))}
        </div>
    );
}
