import type { ReactNode } from "react";

type DashboardLayoutProps = {
  summaryCards: ReactNode;
  middle: ReactNode;
  bottom: ReactNode;
};

export default function DashboardLayout({
  summaryCards,
  middle,
  bottom,
}: DashboardLayoutProps) {
  return (
    <div className="space-y-6">
      <section>{summaryCards}</section>
      <section>{middle}</section>
      <section>{bottom}</section>
    </div>
  );
}
