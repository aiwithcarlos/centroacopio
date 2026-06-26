import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/admin';
import { createHash } from 'crypto';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Obtener IP del cliente (de manera privada: hash de IP + center_id)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor?.split(',')[0]?.trim() || '127.0.0.1';
    const ipHash = createHash('sha256')
      .update(`${ip}:${id}`)
      .digest('hex');

    const supabase = createAdminSupabase();

    // Verificar si ya reportó en las últimas 24h
    const { data: hasRecent } = await supabase.rpc('has_recent_report', {
      p_center_id: id,
      p_ip_hash: ipHash,
    });

    if (hasRecent) {
      // Aún así, devolver el conteo actual
      const { count } = await supabase
        .from('center_reports')
        .select('*', { count: 'exact', head: true })
        .eq('center_id', id);

      return NextResponse.json(
        {
          error: 'Ya has reportado este centro en las últimas 24 horas',
          report_count: count || 0,
        },
        { status: 429 }
      );
    }

    // Insertar reporte
    const { error: insertError } = await supabase
      .from('center_reports')
      .insert({
        center_id: id,
        ip_hash: ipHash,
      });

    if (insertError) throw insertError;

    // Obtener el conteo actualizado
    const { count } = await supabase
      .from('center_reports')
      .select('*', { count: 'exact', head: true })
      .eq('center_id', id);

    return NextResponse.json({
      success: true,
      report_count: count || 0,
    });
  } catch (error) {
    console.error('Error reporting center:', error);
    return NextResponse.json(
      { error: 'Error al reportar el centro de acopio' },
      { status: 500 }
    );
  }
}
