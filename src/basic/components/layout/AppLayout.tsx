import { ReactNode } from "react";

type AppLayoutProps = {
  children: ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
};
