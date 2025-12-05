'use client';

import { redirect } from "@/i18n/navigation";
import { useAppSelector } from "@/redux/hooks";
import { Spinner } from "@/components/common";

interface RequireAuthProps {
  children: React.ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="flex justify-center my-8">
        require auth...<Spinner lg />
      </div>
    );
  }

  if (!isAuthenticated) {
    redirect('/auth/login');
    return null;
  }

  return <>{children}</>;
} 