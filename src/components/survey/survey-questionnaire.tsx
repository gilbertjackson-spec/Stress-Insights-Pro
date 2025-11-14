'use client';

import { useState, useEffect } from 'react';
import type { Demographics, Domain, Question } from '@/lib/types';
import { getMockSurveyTemplate } from '@/lib/mock-data-fortesting';
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
import { useFirestore } from '@/firebase';

interface SurveyQuestionnaireProps {
  deploymentId: string;
  demographics: Partial<Demographics>;
  onComplete: () => void;
}

type AnswersState = Record<number, string>; // question_id: raw_response

export default function SurveyQuestionnaire({ deploymentId, demographics, onComplete }: SurveyQuestionnaireProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [template, setTemplate] = useState(getMockSurveyTemplate());
  const [answers, setAnswers] = useState<AnswersState>({});
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!api) return;
    setTotalSlides(api.scrollSnapList().length);
    api.on('select', () => setCurrentSlide(api.selectedScrollSnap()));
  }, [api]);

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };
  
  const allQuestions = template.domains.flatMap(d => d.questions);
  const totalQuestionsAnswered = Object.keys(answers).length;
  const progress = (totalQuestionsAnswered / allQuestions.length) * 100;

  const handleSubmit = async () => {
    if (totalQuestionsAnswered < allQuestions.length) {
        toast({
            variant: 'destructive',
            title: 'Perguntas Incompletas',
            description: 'Por favor, responda a todas as perguntas antes de enviar.',
        });
        return;
    }
    
    if (!firestore) return;

    setIsSubmitting(true);
    try {
        await addAnswerBatch(firestore, {
            deploymentId,
            demographics,
            answers,
            template,
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

  return (
    <div>
        <CardHeader>
            <CardTitle>Questionário</CardTitle>
            <CardDescription>Responda a todas as perguntas. Suas respostas são anônimas.</CardDescription>
        </CardHeader>
        <div className="p-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground text-center mt-2">{totalQuestionsAnswered} de {allQuestions.length} perguntas respondidas</p>
        </div>

        <Carousel setApi={setApi} className="w-full px-12">
            <CarouselContent>
            {template.domains.map((domain: Domain) => (
                <CarouselItem key={domain.domain_id}>
                    <div className="p-1">
                        <h3 className="text-lg font-semibold text-center mb-4">{domain.name}</h3>
                        <div className="space-y-6">
                        {domain.questions.map((question: Question) => (
                            <div key={question.question_id} className="p-4 border rounded-lg bg-secondary/30">
                                <p className="font-medium mb-4">{question.question_text}</p>
                                <RadioGroup
                                    onValueChange={(value) => handleAnswerChange(question.question_id, value)}
                                    value={answers[question.question_id]}
                                    className="flex flex-wrap justify-center gap-4"
                                >
                                {LIKERT_SCALE.map((option, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <RadioGroupItem value={option} id={`q${question.question_id}-o${index}`} />
                                        <Label htmlFor={`q${question.question_id}-o${index}`}>{option}</Label>
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
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
        
        <div className="flex justify-between items-center p-6">
            <p className="text-sm text-muted-foreground">Domínio {currentSlide + 1} de {totalSlides}</p>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Enviando...' : 'Finalizar e Enviar Respostas'}
            </Button>
        </div>
    </div>
  );
}
