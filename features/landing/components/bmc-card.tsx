'use client';

import { motion } from 'motion/react';
import type { BmcCardProps } from '../types';

// Helper to get title from BMC items (value_propositions first item)
function getBmcTitle(bmc: BmcCardProps['bmc']): string {
  const valueProps = bmc.items.find(
    (item) => item.tag === 'value_propositions'
  );
  return valueProps?.content[0] ?? 'Business Model Canvas';
}

// Helper to get category from BMC items (customer_segments first item)
function getBmcCategory(bmc: BmcCardProps['bmc']): string {
  const segments = bmc.items.find((item) => item.tag === 'customer_segments');
  return segments?.content[0] ?? 'Business';
}

// Helper to get location name from coordinates (simplified)
function getLocationName(lat: number): string {
  // Simple mapping based on known Indonesian cities
  if (lat > 3) return 'Medan';
  if (lat > 1) return 'Manado';
  if (lat > -1) return 'Samarinda';
  if (lat > -3) return 'Palembang';
  if (lat > -5.5) return 'Makassar';
  if (lat > -6.5) return 'Jakarta';
  if (lat > -7) return 'Bandung';
  if (lat > -7.5) return 'Surabaya';
  if (lat > -8) return 'Yogyakarta';
  return 'Denpasar';
}

export function BmcCard({ bmc, onClick }: BmcCardProps) {
  const title = getBmcTitle(bmc);
  const category = getBmcCategory(bmc);
  const location = getLocationName(bmc.coordinates.lat);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="flex w-full flex-col overflow-hidden rounded-2xl bg-card text-left shadow-sm transition-shadow hover:shadow-lg"
      data-testid="bmc-card"
    >
      {/* Thumbnail with gradient */}
      <div className="relative aspect-4/3 w-full overflow-hidden">
        <div className="h-full w-full bg-linear-to-br from-emerald-400 via-teal-500 to-amber-300" />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Bottom content */}
      <div className="flex flex-col gap-2 p-4">
        <span className="text-sm font-medium text-primary line-clamp-1">
          {location}
        </span>
        <h4 className="text-lg font-semibold leading-tight text-white drop-shadow-md line-clamp-2">
          {title}
        </h4>
        {/* <p className="text-sm text-muted-foreground">
          {new Date(bmc.createdAt).toLocaleDateString('id-ID')}
        </p> */}
      </div>
    </motion.button>
  );
}
