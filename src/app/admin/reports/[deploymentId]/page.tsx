'use client';

import MainDashboard from "@/components/dashboard/main-dashboard";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";

export default function ReportPage() {
  const params = useParams();
  const deploymentId = params.deploymentId as string;
  const firestore = useFirestore();

  const deploymentRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'survey_deployments', deploymentId);
  }, [firestore, deploymentId]);

  const { data: deployment, isLoading: isLoadingDeployment } = useDoc(deploymentRef);

  const companyRef = useMemoFirebase(() => {
    if (!firestore || !deployment?.companyId) return null;
    return doc(firestore, 'companies', deployment.companyId);
  }, [firestore, deployment?.companyId]);

  const { data: company, isLoading: isLoadingCompany } = useDoc(companyRef);

  const isLoading = isLoadingDeployment || isLoadingCompany;

  return (
    <div className="space-y-6">
      {isLoading ? (
        <Skeleton className="h-6 w-1/2" />
      ) : (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/admin/companies" className="hover:text-primary transition-colors">
            Empresas
          </Link>
          <ChevronRight className="h-4 w-4" />
          {company && (
            <>
              <Link href={`/admin/companies/${company.id}`} className="hover:text-primary transition-colors">
                {company.name}
              </Link>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
          <span className="font-medium text-foreground">Relatório da Pesquisa</span>
        </div>
      )}
      <MainDashboard deploymentId={deploymentId} />
    </div>
  );
}
