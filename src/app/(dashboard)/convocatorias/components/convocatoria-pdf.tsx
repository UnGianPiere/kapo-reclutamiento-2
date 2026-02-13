'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/modal';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Font
} from '@react-pdf/renderer';

interface ConvocatoriaPdfProps {
  isOpen: boolean;
  onClose: () => void;
  convocatoria: any;
}

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40, // Márgenes más amplios para documento formal
  },
  header: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 8,
  },
  title: {
    fontSize: 14, // text-sm ≈ 14px
    fontWeight: 'semibold',
    color: '#1f2937',
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 12, // text-xs ≈ 12px
    color: '#6b7280',
    marginBottom: 8,
  },
  status: {
    fontSize: 10,
    color: '#065f46',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 6,
    padding: 12,
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statValue: {
    fontSize: 12, // text-xs ≈ 12px
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12, // text-xs ≈ 12px
    color: '#6b7280',
    fontWeight: 'medium',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12, // text-sm ≈ 14px pero reducido para PDF
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    width: '50%',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12, // text-xs font-semibold ≈ 12px
    color: '#6b7280',
    fontWeight: 'semibold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 1,
  },
  infoValue: {
    fontSize: 12, // text-xs font-medium ≈ 12px
    color: '#1f2937',
    fontWeight: 'medium',
  },
  detailsSection: {
    marginTop: 8,
  },
  detailsTitle: {
    fontSize: 12,
    fontWeight: 'semibold',
    color: '#1f2937',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailsContent: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 1.4,
  },
});

// Componente PDF
const ConvocatoriaPDFDocument = ({ convocatoria }: { convocatoria: any }) => {
  if (!convocatoria) return null;

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const detalle = convocatoria.detalle_staff_snapshot || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {convocatoria.cargo_nombre || 'Convocatoria'}
          </Text>
          <Text style={styles.subtitle}>
            Código: {convocatoria.codigo_convocatoria}
          </Text>
          <Text style={styles.status}>
            {convocatoria.estado_convocatoria?.replace('_', ' ')}
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{convocatoria.vacantes}</Text>
            <Text style={styles.statLabel}>Vacantes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>Nivel {convocatoria.prioridad}</Text>
            <Text style={styles.statLabel}>Prioridad</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {formatShortDate(convocatoria.fecha_creacion)}
            </Text>
            <Text style={styles.statLabel}>Publicado</Text>
          </View>
        </View>

        {/* Información del Cargo y Ubicación */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información del Cargo y Ubicación</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Cargo</Text>
              <Text style={styles.infoValue}>{convocatoria.cargo_nombre}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Categoría</Text>
              <Text style={styles.infoValue}>{convocatoria.categoria_nombre}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Especialidad</Text>
              <Text style={styles.infoValue}>{convocatoria.especialidad_nombre}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Tipo</Text>
              <Text style={styles.infoValue}>{convocatoria.tipo_requerimiento?.replace('_', ' ')}</Text>
            </View>
            {convocatoria.empresa_nombre && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Empresa</Text>
                <Text style={styles.infoValue}>{convocatoria.empresa_nombre}</Text>
              </View>
            )}
            {convocatoria.obra_nombre && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Obra/Proyecto</Text>
                <Text style={styles.infoValue}>{convocatoria.obra_nombre}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Detalles de la Solicitud */}
        {detalle && Object.keys(detalle).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detalles de la Solicitud</Text>

            <View style={{ borderLeftWidth: 1, borderLeftColor: '#d1d5db', paddingLeft: 12 }}>
              {/* Información básica */}
              <View style={styles.infoGrid}>
                {detalle.fecha_contratacion_deseada && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Fecha deseada</Text>
                    <Text style={styles.infoValue}>
                      {formatShortDate(detalle.fecha_contratacion_deseada)}
                    </Text>
                  </View>
                )}
                {detalle.area_solicitante_nombre && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Área solicitante</Text>
                    <Text style={styles.infoValue}>{detalle.area_solicitante_nombre}</Text>
                  </View>
                )}
                {detalle.jefe_inmediato_nombre && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Jefe inmediato</Text>
                    <Text style={styles.infoValue}>{detalle.jefe_inmediato_nombre}</Text>
                  </View>
                )}
                {detalle.encargado_induccion_nombre && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Encargado inducción</Text>
                    <Text style={styles.infoValue}>{detalle.encargado_induccion_nombre}</Text>
                  </View>
                )}
                {detalle.tipo_para_cubrir && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Tipo</Text>
                    <Text style={styles.infoValue}>{detalle.tipo_para_cubrir.replace('_', ' ')}</Text>
                  </View>
                )}
                {detalle.horario_tiempo && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Horario</Text>
                    <Text style={styles.infoValue}>{detalle.horario_tiempo}</Text>
                  </View>
                )}
                {detalle.equipo_asignado && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Equipo</Text>
                    <Text style={styles.infoValue}>{detalle.equipo_asignado}</Text>
                  </View>
                )}
                {detalle.lugar_trabajo && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Lugar trabajo</Text>
                    <Text style={styles.infoValue}>{detalle.lugar_trabajo}</Text>
                  </View>
                )}
                {typeof detalle.disponibilidad_viajar === 'boolean' && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Disponibilidad viajes</Text>
                    <Text style={styles.infoValue}>
                      {detalle.disponibilidad_viajar ? 'Sí' : 'No'}
                    </Text>
                  </View>
                )}
              </View>

              {/* Formación Académica */}
              {detalle.formacion_academica && (
                <View style={{ marginTop: 12 }}>
                  <View style={{ borderLeftWidth: 1, borderLeftColor: '#d1d5db', paddingLeft: 8 }}>
                    <Text style={styles.detailsTitle}>Formación Requerida</Text>
                    <Text style={styles.detailsContent}>
                      {detalle.formacion_academica.universitario?.length > 0 &&
                        `Universitario: ${detalle.formacion_academica.universitario.join(', ')}\n`}
                      {detalle.formacion_academica.tecnico?.length > 0 &&
                        `Técnico: ${detalle.formacion_academica.tecnico.join(', ')}`}
                    </Text>
                  </View>
                </View>
              )}

              {/* Experiencia */}
              {detalle.experiencia_laboral_requerida && (
                <View style={{ marginTop: 12 }}>
                  <View style={{ borderLeftWidth: 1, borderLeftColor: '#d1d5db', paddingLeft: 8 }}>
                    <Text style={styles.detailsTitle}>Experiencia Requerida</Text>
                    <Text style={styles.detailsContent}>
                      {detalle.experiencia_laboral_requerida}
                    </Text>
                  </View>
                </View>
              )}

              {/* Motivo */}
              {detalle.motivo_solicitud && (
                <View style={{ marginTop: 12 }}>
                  <View style={{ borderLeftWidth: 1, borderLeftColor: '#d1d5db', paddingLeft: 8 }}>
                    <Text style={styles.detailsTitle}>Motivo de la Solicitud</Text>
                    <Text style={styles.detailsContent}>
                      {detalle.motivo_solicitud}
                    </Text>
                  </View>
                </View>
              )}

              {/* Requisitos Mínimos */}
              {detalle.requisitos_minimos && (
                <View style={{ marginTop: 12 }}>
                  <View style={{ borderLeftWidth: 1, borderLeftColor: '#d1d5db', paddingLeft: 8 }}>
                    <Text style={styles.detailsTitle}>Requisitos Mínimos</Text>
                    <Text style={styles.detailsContent}>
                      {detalle.requisitos_minimos}
                    </Text>
                  </View>
                </View>
              )}

              {/* Funciones Principales */}
              {detalle.funciones_principales && (
                <View style={{ marginTop: 12 }}>
                  <View style={{ borderLeftWidth: 1, borderLeftColor: '#d1d5db', paddingLeft: 8 }}>
                    <Text style={styles.detailsTitle}>Funciones Principales</Text>
                    <Text style={styles.detailsContent}>
                      {detalle.funciones_principales}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default function ConvocatoriaPdf({ isOpen, onClose, convocatoria }: ConvocatoriaPdfProps) {
  if (!convocatoria) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-5 w-5 text-text-secondary" />
              <span className="text-sm font-semibold text-text-primary">
                {convocatoria.cargo_nombre || 'Convocatoria'} - PDF
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-semibold border bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900">
                {convocatoria.estado_convocatoria?.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-text-secondary font-normal">
              Código: {convocatoria.codigo_convocatoria}
            </p>
          </div>
        </div>
      }
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <Button
            variant="custom"
            color="gray"
            onClick={onClose}
          >
            Cerrar
          </Button>
          <PDFDownloadLink
            document={<ConvocatoriaPDFDocument convocatoria={convocatoria} />}
            fileName={`${convocatoria.cargo_nombre || 'Convocatoria'}.pdf`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-semibold"
          >
            {({ loading }) => (
              <>
                <Download className="h-4 w-4" />
                {loading ? 'Generando...' : 'Descargar PDF'}
              </>
            )}
          </PDFDownloadLink>
        </div>
      }
    >
      <div className="h-[70vh] w-full">
        <PDFDownloadLink
          document={<ConvocatoriaPDFDocument convocatoria={convocatoria} />}
          fileName={`${convocatoria.cargo_nombre || 'Convocatoria'}.pdf`}
        >
          {({ blob, url, loading, error }) => {
            if (loading) {
              return (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
                    <p className="text-sm text-text-secondary">Generando PDF...</p>
                  </div>
                </div>
              );
            }

            if (error) {
              return (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <FileText className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <p className="text-sm text-red-500">Error al generar el PDF</p>
                  </div>
                </div>
              );
            }

            return url ? (
              <iframe
                src={url}
                className="w-full h-full border-0 rounded-lg"
                title={`PDF - ${convocatoria.cargo_nombre || 'Convocatoria'}`}
                allowFullScreen
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-text-secondary mx-auto mb-4" />
                  <p className="text-sm text-text-secondary">Cargando PDF...</p>
                </div>
              </div>
            );
          }}
        </PDFDownloadLink>
      </div>
    </Modal>
  );
}