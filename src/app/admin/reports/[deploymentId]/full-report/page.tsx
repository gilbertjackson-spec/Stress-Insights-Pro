'use client';

import { useParams } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import type { DashboardData, Company, SurveyDeployment } from '@/lib/types';
import { getDashboardData } from '@/lib/analysis';
import FullReport from '@/components/dashboard/full-report';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function FullReportPage() {
  const params = useParams();
  const deploymentId = params.deploymentId as string;
  const firestore = useFirestore();

  const [reportData, setReportData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deploymentRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'survey_deployments', deploymentId);
  }, [firestore, deploymentId]);

  const { data: deployment } = useDoc<SurveyDeployment>(deploymentRef);

  const companyRef = useMemoFirebase(() => {
    if (!firestore || !deployment?.companyId) return null;
    return doc(firestore, 'companies', deployment.companyId);
  }, [firestore, deployment?.companyId]);

  const { data: company } = useDoc<Company>(companyRef);

  useEffect(() => {
    if (!deploymentId || !firestore) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getDashboardData(firestore, deploymentId, {});
        setReportData(result);
      } catch (e: any) {
        console.error("Failed to load report data:", e);
        setError(e.message || "Ocorreu um erro ao carregar os dados.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [deploymentId, firestore]);

  const handleDownloadPdf = async () => {
    const reportElement = document.getElementById('full-report-content');
    if (!reportElement) return;

    setIsGeneratingPdf(true);

    try {
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4',
        });

        // The html2canvas library has a bug with its typings, so we have to use 'any' here.
        // It returns a promise that resolves with the canvas.
        const canvas = await (html2canvas as any)(reportElement, {
            scale: 2, // Higher scale for better quality
            useCORS: true,
            logging: false, // Suppress logging in console
            windowWidth: pdf.internal.pageSize.getWidth() * 4, // Simulate wider screen
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;
        let height = pdfWidth / ratio;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, height);
        let heightLeft = height - pageHeight;

        while (heightLeft > 0) {
            position = -pageHeight * (pdf.internal.pages.length - 1);
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, height);
            heightLeft -= pageHeight;
        }

        pdf.save('Relatorio_Stress_Insights.pdf');

    } catch (error) {
        console.error("Error generating PDF:", error);
        setError("Não foi possível gerar o PDF. Tente novamente.");
    } finally {
        setIsGeneratingPdf(false);
    }
};


  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-6">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error && !isGeneratingPdf) { // Don't show this error if it's just a PDF generation error
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Erro ao Carregar Relatório</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (!reportData || !company || !deployment) {
    return (
         <div className="max-w-4xl mx-auto p-4 sm:p-8">
            <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Sem Dados</AlertTitle>
                <AlertDescription>Não foi possível encontrar dados para este relatório.</AlertDescription>
            </Alert>
        </div>
    );
  }


  return (
    <div className="bg-background min-h-screen">
       <div className="p-4 sm:p-8 print:hidden max-w-4xl mx-auto flex justify-between items-center">
            <Button variant="outline" asChild>
                <Link href={`/admin/reports/${deploymentId}`}>
                    Voltar ao Dashboard
                </Link>
            </Button>
            <Button onClick={handleDownloadPdf} disabled={isGeneratingPdf}>
                {isGeneratingPdf && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isGeneratingPdf ? 'Gerando PDF...' : 'Salvar como PDF'}
            </Button>
        </div>
      <div id="full-report-content" className="bg-card">
        <FullReport data={reportData} company={company} deployment={deployment} />
      </div>
    </div>
  );
}
