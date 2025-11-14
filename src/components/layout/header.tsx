'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Bell, Search, BrainCircuit } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { EditProfileDialog } from '../profile/edit-profile-dialog';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AppHeader() {
  const defaultAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');
  const [avatarUrl, setAvatarUrl] = useState(defaultAvatar?.imageUrl);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

  // This effect runs only on the client, after the initial render.
  useEffect(() => {
    const savedAvatar = localStorage.getItem('user-avatar-url');
    if (savedAvatar) {
      setAvatarUrl(savedAvatar);
    }
  }, []);

  const handleProfileSave = (newUrl: string) => {
    setAvatarUrl(newUrl);
    // The dialog itself will save to localStorage
    setIsProfileDialogOpen(false);
  };


  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-2">
        <Link href="/admin/companies" className="flex items-center gap-2 text-foreground">
          <BrainCircuit className="h-6 w-6" />
          <div className="flex flex-col">
            <h2 className="text-md font-headline font-semibold">
              Stress Insights
            </h2>
          </div>
        </Link>
      </div>

      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-secondary pl-8 pr-4 h-9 md:w-[200px] lg:w-[320px] focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <Button variant="ghost" size="icon" className="rounded-full">
        <Bell className="h-5 w-5" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 rounded-full"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={avatarUrl}
                alt="User Avatar"
                data-ai-hint={defaultAvatar?.imageHint}
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setIsProfileDialogOpen(true)}>Perfil</DropdownMenuItem>
          <DropdownMenuItem>Configurações</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Sair</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditProfileDialog 
        isOpen={isProfileDialogOpen}
        onOpenChange={setIsProfileDialogOpen}
        onSave={handleProfileSave}
      />
    </header>
  );
}
