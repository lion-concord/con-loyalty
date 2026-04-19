import type { LevelInfo } from "../../shop/types";

type Props = {
  levelInfo: LevelInfo;
};

export default function ShopBanner({ levelInfo }: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-900 via-amber-800 to-stone-900 p-6 shadow-lg">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-600/20 blur-2xl" />
      <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-orange-500/20 blur-xl" />

      <div className="relative z-10 flex items-start gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm text-4xl shadow-lg">
          ☕
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">КОН Coffee</h1>
          <p className="mt-1 text-sm text-amber-100/80">
            Кофейня в экосистеме КОН
          </p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-500/20 border border-green-400/30 px-3 py-1">
            <span className="text-sm">{levelInfo.emoji}</span>
            <span className="text-xs font-medium text-green-200">
              Кешбэк {levelInfo.cashbackPct}% баллами
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
