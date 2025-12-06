'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/features/shared/components/ui/dialog';
import { Button } from '@/features/shared/components/ui/button';
import { MapPin } from 'lucide-react';

export interface LocationPermissionModalProps {
  open: boolean;
  onAllow: () => void;
  onSkip: () => void;
  isLoading?: boolean;
}

export function LocationPermissionModal({
  open,
  onAllow,
  onSkip,
  isLoading = false,
}: LocationPermissionModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onSkip()}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader className="items-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle>Izinkan Akses Lokasi</DialogTitle>
          <DialogDescription className="text-center">
            Dengan mengizinkan akses lokasi, kami dapat memberikan rekomendasi
            bisnis yang lebih relevan dengan area Anda. Ini bersifat opsional.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button onClick={onAllow} disabled={isLoading} className="w-full">
            {isLoading ? 'Meminta izin...' : 'Izinkan Lokasi'}
          </Button>
          <Button
            variant="ghost"
            onClick={onSkip}
            disabled={isLoading}
            className="w-full text-muted-foreground"
          >
            Lewati untuk sekarang
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
