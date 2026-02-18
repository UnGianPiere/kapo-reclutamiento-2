'use client';

import { useEffect } from 'react';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Forzar tema light removiendo la clase 'dark'
    const root = document.documentElement;
    root.classList.remove('dark');

    // Cleanup: no restaurar ya que queremos que sea permanente para esta sección
  }, []);

  return (
    <>
      {/* Background layer */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: "url('/fondo-form.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* Content layer - con restricciones de overflow para compatibilidad con Select */}
      <div className="min-h-screen relative overflow-hidden">
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
}