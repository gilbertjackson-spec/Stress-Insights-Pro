'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';

interface EditProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (newUrl: string) => void;
}

export function EditProfileDialog({ isOpen, onOpenChange, onSave }: EditProfileDialogProps) {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const defaultAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      const savedAvatar = localStorage.getItem('user-avatar-url');
      setAvatarUrl(savedAvatar || defaultAvatar?.imageUrl || '');
    }
  }, [isOpen, defaultAvatar]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
            variant: "destructive",
            title: "Arquivo muito grande",
            description: "Por favor, escolha uma imagem com menos de 2MB.",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSave = () => {
    setIsLoading(true);
    // Simulate a network request
    setTimeout(() => {
      localStorage.setItem('user-avatar-url', avatarUrl);
      onSave(avatarUrl);
      setIsLoading(false);
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogDescription>
            Faça alterações no seu perfil aqui. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-4">
             <Avatar className="h-24 w-24">
                <AvatarImage src={avatarUrl} alt="User Avatar" />
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="avatar-file">Carregar nova imagem</Label>
                <Input
                    id="avatar-file"
                    type="file"
                    accept="image/png, image/jpeg, image/gif"
                    onChange={handleFileChange}
                    className="cursor-pointer file:cursor-pointer file:text-primary file:font-semibold"
                />
                <p className="text-sm text-muted-foreground">
                    Escolha um arquivo de imagem (JPG, PNG, GIF) de até 2MB.
                </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
