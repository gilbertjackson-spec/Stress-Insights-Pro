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

interface EditProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (newUrl: string) => void;
}

export function EditProfileDialog({ isOpen, onOpenChange, onSave }: EditProfileDialogProps) {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const defaultAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');


  useEffect(() => {
    if (isOpen) {
      const savedAvatar = localStorage.getItem('user-avatar-url');
      setAvatarUrl(savedAvatar || defaultAvatar?.imageUrl || '');
    }
  }, [isOpen, defaultAvatar]);

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
                <Label htmlFor="avatar-url">URL da Imagem do Avatar</Label>
                <Input
                    id="avatar-url"
                    type="url"
                    placeholder="https://exemplo.com/sua-imagem.png"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                    Cole o link para a nova imagem do seu avatar.
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
