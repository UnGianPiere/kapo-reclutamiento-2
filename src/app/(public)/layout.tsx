export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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