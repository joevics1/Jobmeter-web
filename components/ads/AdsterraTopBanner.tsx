import AdsterraBanner from './AdsterraBanner';
import { ADSTERRA } from '@/lib/constants/adsterraKeys';

/**
 * Both sizes render at once but only one is ever visible — Tailwind's
 * responsive display classes handle the swap purely in CSS, so there's no
 * layout flash or JS-based viewport detection to get wrong. The hidden one
 * does still load in the background; Adsterra doesn't offer a single
 * "auto-responsive" format the way AdSense does, since each unit is a fixed
 * size, so this is the standard way to handle it for a fixed-size network.
 */
export default function AdsterraTopBanner() {
  return (
    <div className="w-full flex justify-center overflow-hidden">
      <div className="hidden md:block">
        <AdsterraBanner {...ADSTERRA.LEADERBOARD_728x90} />
      </div>
      <div className="md:hidden">
        <AdsterraBanner {...ADSTERRA.MOBILE_BANNER_320x50} />
      </div>
    </div>
  );
}
