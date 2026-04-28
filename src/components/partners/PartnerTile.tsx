import { useEffect, useRef } from "react";
import "./PartnerTile.css";

interface Props {
  title: string;
  subtitle: string;
  badge?: string;
  footnote?: string;
  onOpen: () => void;
}

export default function PartnerTile({ title, subtitle, badge, footnote, onOpen }: Props) {
  const boatRef = useRef<HTMLDivElement>(null);
  const isSemrek = title === "Семь рек";

  useEffect(() => {
    let frame = 0;
    let raf = 0;
    const tick = () => {
      frame++;
      if (boatRef.current) {
        const y = Math.sin(frame / 30) * 4;
        const r = Math.sin(frame / 25) * 2;
        boatRef.current.style.transform = "translateY(" + y + "px) rotate(" + r + "deg)";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <button
        onClick={onOpen}
        className={isSemrek ? "ptile ptile--semrek" : "ptile"}
      >
        <div className="ptile__bg" />
        <div className="ptile__glow" />
        <div className="ptilewave ptilewave--1">
          <svg viewBox="0 0 1200 100" preserveAspectRatio="none">
            <path d="M0,50 C150,80 350,20 600,50 C850,80 1050,20 1200,50 L1200,100 L0,100 Z" fill="#c77a3a" opacity="0.15" />
          </svg>
        </div>
        <div className="ptilewave ptilewave--2">
          <svg viewBox="0 0 1200 100" preserveAspectRatio="none">
            <path d="M0,50 C150,80 350,20 600,50 C850,80 1050,20 1200,50 L1200,100 L0,100 Z" fill="#c77a3a" opacity="0.3" />
          </svg>
        </div>
        <div className="ptilewave ptilewave--3">
          <svg viewBox="0 0 1200 100" preserveAspectRatio="none">
            <path d="M0,50 C150,80 350,20 600,50 C850,80 1050,20 1200,50 L1200,100 L0,100 Z" fill="#c77a3a" opacity="0.45" />
          </svg>
        </div>
        <div className="ptile__bubbles">
          <span className="ptile__bubble" style={{ left: "10%", animationDelay: "0s" }} />
          <span className="ptile__bubble" style={{ left: "25%", animationDelay: "0.7s" }} />
          <span className="ptile__bubble" style={{ left: "40%", animationDelay: "1.4s" }} />
          <span className="ptile__bubble" style={{ left: "55%", animationDelay: "2.1s" }} />
          <span className="ptile__bubble" style={{ left: "70%", animationDelay: "2.8s" }} />
          <span className="ptile__bubble" style={{ left: "85%", animationDelay: "3.5s" }} />
        </div>
        <div ref={boatRef} className="ptile__boat">🚤</div>

        <div className="ptile__content">
          {isSemrek ? (
            <div className="ptile__banner">
              <div className="ptile__bannerTop">
                <div className="ptile__medallion">⚓</div>
                <div className="ptile__bannerText">
                  <div className="ptile__title">{title}</div>
                  <div className="ptile__subtitle">{subtitle}</div>
                </div>
              </div>

              <div className="ptile__bannerBottom">
                <div className="ptile__bannerCta">Открыть модуль</div>
                {badge && <div className="ptile__badge">{badge}</div>}
              </div>
            </div>
          ) : (
            <>
              <div className="ptile__medallion">⚓</div>
              <div className="ptile__text">
                <div className="ptile__title">{title}</div>
                <div className="ptile__subtitle">{subtitle}</div>
</div>
              {badge && <div className="ptile__badge">{badge}</div>}
              <div className="ptile__arrow">Открыть →</div>
            </>
          )}
        </div>
      </button>
      {footnote && <div className="ptile__footnote">{footnote}</div>}
    </>
  );
}
