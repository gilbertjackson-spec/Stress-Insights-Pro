'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Demographics, Domain, Question, SurveyTemplate } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { LIKERT_SCALE } from '@/lib/constants';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '../ui/carousel';
import { Progress } from '../ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { addAnswerBatch } from '@/lib/answer-service';
import { useCollection, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, getDocs } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';

interface SurveyQuestionnaireProps {
  deploymentId: string;
  templateId: string;
  demographics: Partial<Demographics>;
  onComplete: () => void;
}

type AnswersState = Record<string, string>; // question_id: raw_response

export default function SurveyQuestionnaire({ deploymentId, templateId, demographics, onComplete }: SurveyQuestionnaireProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [answers, setAnswers] = useState<AnswersState>({});
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Survey Template, Domains, and Questions dynamically
  const templateRef = useMemoFirebase(() => firestore ? doc(firestore, 'survey_templates', templateId) : null, [firestore, templateId]);
  const { data: template, isLoading: isLoadingTemplate } = useDoc<SurveyTemplate>(templateRef);

  const domainsRef = useMemoFirebase(() => firestore ? collection(firestore, 'survey_templates', templateId, 'domains') : null, [firestore, templateId]);
  const { data: domains, isLoading: isLoadingDomains } = useCollection<Domain>(domainsRef);

  const [questionsByDomain, setQuestionsByDomain] = useState<Record<string, Question[]>>({});
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

  useEffect(() => {
    if (!firestore || !domains) return;

    const fetchAllQuestions = async () => {
        setIsLoadingQuestions(true);
        const questionsData: Record<string, Question[]> = {};
        for (const domain of domains) {
            const questionsRef = collection(firestore, 'survey_templates', templateId, 'domains', domain.id, 'questions');
            const questionsSnap = await getDocs(questionsRef);
            questionsData[domain.id] = questionsSnap.docs.map(d => ({ ...d.data(), id: d.id } as Question));
        }
        setQuestionsByDomain(questionsData);
        setIsLoadingQuestions(false);
    };

    fetchAllQuestions();
  }, [firestore, domains, templateId]);


  useEffect(() => {
    if (!api) return;
    setTotalSlides(api.scrollSnapList().length);
    const handleSelect = () => {
        setCurrentSlide(api.selectedScrollSnap());
    };
    api.on('select', handleSelect);
    
    return () => {
        api.off('select', handleSelect);
    }
  }, [api]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };
  
  const allQuestions = domains ? domains.flatMap(d => questionsByDomain[d.id] || []) : [];
  const totalQuestionsAnswered = Object.keys(answers).length;
  const progress = allQuestions.length > 0 ? (totalQuestionsAnswered / allQuestions.length) * 100 : 0;

  const handleSubmit = async () => {
    if (totalQuestionsAnswered < allQuestions.length) {
        toast({
            variant: 'destructive',
            title: 'Perguntas Incompletas',
            description: 'Por favor, responda a todas as perguntas antes de enviar.',
        });
        return;
    }
    
    if (!firestore || !template || !domains) return;

    // Reconstruct the full template object for submission
    const fullTemplate: SurveyTemplate = {
      ...template,
      domains: domains.map(d => ({...d, questions: questionsByDomain[d.id] || []}))
    }

    setIsSubmitting(true);
    try {
        await addAnswerBatch(firestore, {
            deploymentId,
            demographics,
            answers,
            template: fullTemplate,
        });
        toast({
            title: 'Respostas Enviadas!',
            description: 'Obrigado por sua valiosa contribuição.',
        });
        onComplete();
    } catch(e) {
        console.error("Failed to submit answers:", e);
        toast({
            variant: 'destructive',
            title: 'Erro no Envio',
            description: 'Não foi possível enviar suas respostas. Tente novamente.',
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = useCallback(() => api?.scrollNext(), [api]);

  const isLoading = isLoadingTemplate || isLoadingDomains || isLoadingQuestions;
  const isLastSlide = currentSlide === totalSlides - 1;

  if (isLoading) {
    return (
        <div className="p-8 space-y-4">
            <Skeleton className="h-8 w-1/2 mx-auto" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <div className="space-y-4 pt-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        </div>
    )
  }

  return (
    <div>
        <CardHeader>
            <CardTitle>{template?.name || 'Questionário'}</CardTitle>
            <CardDescription>Responda a todas as perguntas. Suas respostas são anônimas.</CardDescription>
        </CardHeader>
        <div className="p-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground text-center mt-2">{totalQuestionsAnswered} de {allQuestions.length} perguntas respondidas</p>
        </div>

        <Carousel setApi={setApi} className="w-full px-12">
            <CarouselContent>
            {domains?.map((domain: Domain) => (
                <CarouselItem key={domain.id}>
                    <div className="p-1">
                        <h3 className="text-lg font-semibold text-center mb-4">{domain.name}</h3>
                        <div className="space-y-6">
                        {(questionsByDomain[domain.id] || []).map((question: Question) => (
                            <div key={question.id} className="p-4 border rounded-lg bg-secondary/30">
                                <p className="font-medium mb-4">{question.questionText}</p>
                                <RadioGroup
                                    onValueChange={(value) => handleAnswerChange(question.id, value)}
                                    value={answers[question.id]}
                                    className="flex flex-wrap justify-center gap-4"
                                >
                                {LIKERT_SCALE.map((option, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <RadioGroupItem value={option} id={`q${question.id}-o${index}`} />
                                        <Label htmlFor={`q${question.id}-o${index}`}>{option}</Label>
                                    </div>
                                ))}
                                </RadioGroup>
                            </div>
                        ))}
                        </div>
                    </div>
                </CarouselItem>
            ))}
            </CarouselContent>
            {/* The side arrows can be confusing with the bottom buttons, hiding them on mobile for a cleaner experience */}
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
        </Carousel>
        
        <div className="flex justify-between items-center p-6">
            <p className="text-sm text-muted-foreground">Domínio {currentSlide + 1} de {totalSlides}</p>
            <div className='flex gap-2'>
                <Button variant="outline" onClick={scrollPrev} disabled={currentSlide === 0}>Anterior</Button>
                {isLastSlide ? (
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSubmitting ? 'Enviando...' : 'Finalizar e Enviar Respostas'}
                    </Button>
                ) : (
                    <Button onClick={scrollNext}>Próximo</Button>
                )}
            </div>
        </div>
    </div>
  );
}
