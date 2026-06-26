'use client';

import { useState, useRef } from 'react';

interface PhotoUploadProps {
  onFileChange: (file: File | null) => void;
}

export default function PhotoUpload({ onFileChange }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | null) => {
    if (!file) {
      setPreview(null);
      onFileChange(null);
      return;
    }

    // Validar tipo
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Tipo de archivo no permitido. Use JPG, PNG o WebP.');
      return;
    }

    // Validar tamaño
    if (file.size > 5 * 1024 * 1024) {
      alert('El archivo es demasiado grande. Máximo 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    onFileChange(file);
  };

  const removePhoto = () => {
    setPreview(null);
    onFileChange(null);
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-text">Foto del centro de acopio</h3>
      <p className="text-xs text-text-muted">
        Agrega una foto de referencia del lugar (opcional)
      </p>

      {preview ? (
        <div className="relative w-full max-w-sm">
          <img
            src={preview}
            alt="Vista previa"
            className="w-full h-48 object-cover rounded-xl border border-gray-200"
          />
          <button
            type="button"
            onClick={removePhoto}
            className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow"
          >
            ✕
          </button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Tomar foto */}
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="flex-1 flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary/50 hover:bg-primary-light/30 transition-colors cursor-pointer"
          >
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm font-medium text-text">Tomar foto</span>
            <span className="text-xs text-text-muted">Usar cámara</span>
          </button>

          {/* Seleccionar de galería */}
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="flex-1 flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary/50 hover:bg-primary-light/30 transition-colors cursor-pointer"
          >
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium text-text">Galería</span>
            <span className="text-xs text-text-muted">Seleccionar de archivos</span>
          </button>
        </div>
      )}

      {/* Input oculto para cámara */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => handleFile(e.target.files?.[0] || null)}
        className="hidden"
      />

      {/* Input oculto para galería */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFile(e.target.files?.[0] || null)}
        className="hidden"
      />
    </div>
  );
}
