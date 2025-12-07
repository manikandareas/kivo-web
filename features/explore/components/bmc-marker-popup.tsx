'use client';

import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { ApiBmc } from '../hooks/use-public-bmcs';

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true, locale: id });
}

function getLocationName(lat: number, lon: number): string {
  const locations: Record<string, { lat: number; lon: number }> = {
    Jakarta: { lat: -6.2, lon: 106.816666 },
    Bandung: { lat: -6.914744, lon: 107.60981 },
    Surabaya: { lat: -7.250445, lon: 112.768845 },
    Yogyakarta: { lat: -7.79558, lon: 110.36949 },
    Denpasar: { lat: -8.65, lon: 115.216667 },
    Medan: { lat: 3.589665, lon: 98.673447 },
    Makassar: { lat: -5.147665, lon: 119.432732 },
    Samarinda: { lat: -0.502183, lon: 117.153801 },
    Palembang: { lat: -2.990934, lon: 104.756554 },
    Manado: { lat: 1.47483, lon: 124.842079 },
  };

  for (const [name, coords] of Object.entries(locations)) {
    if (Math.abs(coords.lat - lat) < 0.1 && Math.abs(coords.lon - lon) < 0.1) {
      return name;
    }
  }
  return 'Indonesia';
}

// API returns content as string, not array
function getBmcContent(bmc: ApiBmc, tag: string): string {
  return bmc.items.find((i) => i.tag === tag)?.content || '';
}

interface BmcMarkerPopupProps {
  bmc: ApiBmc;
  avatarSeed: string;
}

export function createBmcPopupHTML({
  bmc,
  avatarSeed,
}: BmcMarkerPopupProps): string {
  const title =
    getBmcContent(bmc, 'value_propositions').split(',')[0]?.trim() ||
    'Business Model Canvas';
  const segment =
    getBmcContent(bmc, 'customer_segments').split(',')[0]?.trim() || '';
  const location = bmc.location
    ? getLocationName(bmc.location.latitude, bmc.location.longitude)
    : 'Indonesia';
  const relativeTime = formatRelativeTime(bmc.createdAt);
  const channelsStr = getBmcContent(bmc, 'channels');
  const channels = channelsStr
    ? channelsStr.split(',').map((c) => c.trim())
    : [];
  const keyActivitiesStr = getBmcContent(bmc, 'key_activities');
  const keyActivities = keyActivitiesStr
    ? keyActivitiesStr.split(',').map((a) => a.trim())
    : [];

  const avatarUrl = `https://api.dicebear.com/9.x/open-peeps/svg?backgroundColor=b6e3f4,c0aede,d1d4f9&seed=${encodeURIComponent(avatarSeed)}`;

  return `
    <div style="
      font-family: system-ui, -apple-system, sans-serif;
      min-width: 280px;
      max-width: 320px;
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    ">
      <!-- Header -->
      <div style="
        padding: 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        gap: 12px;
        align-items: flex-start;
      ">
        <div style="
          width: 48px;
          height: 48px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          background: #e5e7eb;
          border: 2px solid rgba(59, 130, 246, 0.5);
        ">
          <img 
            src="${avatarUrl}" 
            alt="Avatar" 
            style="width: 100%; height: 100%; object-fit: cover;"
          />
        </div>
        <div style="flex: 1; min-width: 0;">
          <div style="
            font-weight: 600;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.95);
            line-height: 1.3;
            margin-bottom: 6px;
          ">${title}</div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap; align-items: center;">
            <span style="
              font-size: 11px;
              padding: 2px 8px;
              background: rgba(59, 130, 246, 0.2);
              border: 1px solid rgba(59, 130, 246, 0.3);
              border-radius: 4px;
              color: rgba(147, 197, 253, 1);
            ">${location}</span>
            <span style="
              font-size: 11px;
              color: rgba(255, 255, 255, 0.5);
            ">${relativeTime}</span>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div style="padding: 12px 16px;">
        ${
          segment
            ? `
        <div style="margin-bottom: 12px;">
          <div style="
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: rgba(255, 255, 255, 0.4);
            margin-bottom: 4px;
          ">Target Segment</div>
          <div style="
            font-size: 12px;
            color: rgba(255, 255, 255, 0.7);
          ">${segment}</div>
        </div>
        `
            : ''
        }

        ${
          channels.length > 0
            ? `
        <div style="margin-bottom: 12px;">
          <div style="
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: rgba(255, 255, 255, 0.4);
            margin-bottom: 6px;
          ">Channels</div>
          <div style="display: flex; gap: 4px; flex-wrap: wrap;">
            ${channels
              .slice(0, 3)
              .map(
                (ch) => `
              <span style="
                font-size: 10px;
                padding: 2px 6px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 3px;
                color: rgba(255, 255, 255, 0.6);
              ">${ch}</span>
            `
              )
              .join('')}
          </div>
        </div>
        `
            : ''
        }

        ${
          keyActivities.length > 0
            ? `
        <div>
          <div style="
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: rgba(255, 255, 255, 0.4);
            margin-bottom: 6px;
          ">Key Activities</div>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            ${keyActivities
              .slice(0, 2)
              .map(
                (activity) => `
              <div style="
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 11px;
                color: rgba(255, 255, 255, 0.6);
              ">
                <span style="
                  width: 4px;
                  height: 4px;
                  border-radius: 50%;
                  background: rgba(59, 130, 246, 0.6);
                  flex-shrink: 0;
                "></span>
                ${activity}
              </div>
            `
              )
              .join('')}
          </div>
        </div>
        `
            : ''
        }
      </div>

      <!-- Footer -->
      <div style="
        padding: 10px 16px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
      ">
        <div style="
          font-size: 10px;
          color: rgba(255, 255, 255, 0.4);
        ">Business Model Canvas</div>
        <div style="
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: rgba(59, 130, 246, 0.8);
          cursor: pointer;
        ">
          <span>Lihat Detail</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    </div>
  `;
}
