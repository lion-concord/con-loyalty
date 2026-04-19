import type { LevelInfo } from "../../shop/types";

type Props = {
  balanceKon: number;
  levelInfo: LevelInfo;
  nextLevelInfo: LevelInfo | null;
  progressToNext: number;
  konToNext: number;
  onOpenCard?: () => void;
};

export default function LoyaltyCardMini({
  balanceKon,
  levelInfo,
  nextLevelInfo,
  progressToNext,
  konToNext,
  onOpenCard,
}: Props) {
  return (
    <button
      type="button"
      onClick={onOpenCard}
      className="w-full text-left block rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-4 shadow-lg active:scale-[0.98] transition-transform"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{levelInfo.emoji}</span>
          <div>
            <div className="text-xs text-slate-400">Ваш уровень</div>
            <div className="text-sm font-semibold text-white">
              {levelInfo.name}
            </div>
          </div>
        </div>
<div className="text-right">
          <div className="text-xs text-slate-400">Баллы</div>
          <div className="text-lg font-bold text-purple-300">
            {balanceKon.toFixed(2)} КОН
          </div>
        </div>
      </div>

      {nextLevelInfo && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>
              До {nextLevelInfo.name} {nextLevelInfo.emoji}
            </span>
            <span>{konToNext.toFixed(0)} КОН</span>
          </div>
          <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${progressToNext}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span>📱</span>
          <span>Открыть QR-карту</span>
        </div>
        <svg
          className="w-4 h-4 text-slate-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </button>
  );
}
