import type { ReactNode } from "react";

interface Props {
  title: string;
  right?: ReactNode;
}

export default function TopBar({ title, right }: Props) {
  return (
    <div className="lk-topbar">
      <div className="lk-topbar__title">{title}</div>
      <div>{right}</div>
    </div>
  );
}
