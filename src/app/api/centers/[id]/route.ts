import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const supabase = await createServerSupabase();

    const { data: center, error } = await supabase
      .from('centers')
      .select(
        `
        *,
        country:countries!centers_country_id_fkey(id, name, iso2),
        state:states!centers_state_id_fkey(id, name),
        city:cities!centers_city_id_fkey(id, name)
      `
      )
      .eq('id', id)
      .single();

    if (error || !center) {
      return NextResponse.json(
        { error: 'Centro de acopio no encontrado' },
        { status: 404 }
      );
    }

    // Obtener etiquetas
    const { data: centerTags } = await supabase
      .from('center_tags')
      .select('tag_slug, tag:tags(slug, name)')
      .eq('center_id', id);

    // Obtener conteo de reportes
    const { count: reportCount } = await supabase
      .from('center_reports')
      .select('*', { count: 'exact', head: true })
      .eq('center_id', id);

    const tags = (centerTags || []).map((ct: Record<string, unknown>) => {
      const tag = ct.tag as { slug: string; name: string } | null;
      return tag || { slug: ct.tag_slug, name: ct.tag_slug };
    });

    return NextResponse.json({
      ...center,
      tags,
      report_count: reportCount || 0,
    });
  } catch (error) {
    console.error('Error fetching center detail:', error);
    return NextResponse.json(
      { error: 'Error al cargar el centro de acopio' },
      { status: 500 }
    );
  }
}
