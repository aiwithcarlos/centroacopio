import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { createAdminSupabase } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12')));
  const offset = (page - 1) * limit;
  const countryId = searchParams.get('country_id') || null;
  const stateId = searchParams.get('state_id') || null;
  const cityId = searchParams.get('city_id') || null;
  const lat = parseFloat(searchParams.get('lat') || '');
  const lng = parseFloat(searchParams.get('lng') || '');

  try {
    const supabase = await createServerSupabase();

    // Construir la consulta base
    let query = supabase
      .from('centers')
      .select(
        `
        id, photo_url, address, latitude, longitude, created_at,
        country:countries!centers_country_id_fkey(id, name, iso2),
        state:states!centers_state_id_fkey(id, name),
        city:cities!centers_city_id_fkey(id, name)
      `,
        { count: 'exact' }
      )
      .eq('status', 'active');

    if (countryId) query = query.eq('country_id', countryId);
    if (stateId) query = query.eq('state_id', stateId);
    if (cityId) query = query.eq('city_id', cityId);

    // Si hay coordenadas, ordenar por distancia
    if (!isNaN(lat) && !isNaN(lng)) {
      query = query.order('latitude', { ascending: true });
      // Nota: ordenamiento por distancia real requeriría PostGIS o la extensión earthdistance
      // Para MVP ordenamos por proximidad aproximada
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) throw error;

    // Obtener el conteo de reportes para cada centro
    const centerIds = (data || []).map((c: { id: string }) => c.id);

    const { data: reportCounts } = await supabase
      .from('center_reports')
      .select('center_id')
      .in('center_id', centerIds.length ? centerIds : ['none']);

    const reportMap: Record<string, number> = {};
    (reportCounts || []).forEach((r: { center_id: string }) => {
      reportMap[r.center_id] = (reportMap[r.center_id] || 0) + 1;
    });

    const centers = (data || []).map((c: Record<string, unknown>) => ({
      ...c,
      report_count: reportMap[(c.id as string)] || 0,
    }));

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      centers,
      pagination: { page, limit, total, totalPages },
    });
  } catch (error) {
    console.error('Error fetching centers:', error);
    return NextResponse.json(
      { error: 'Error al cargar los centros de acopio' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      country_id,
      state_id,
      city_id,
      address,
      latitude,
      longitude,
      contact_name,
      contact_phone,
      photo_url,
      is_24h,
      open_time,
      close_time,
      is_all_days,
      days_of_week,
      tags,
    } = body;

    // Validación básica
    if (!country_id || !address || !address.trim()) {
      return NextResponse.json(
        { error: 'País y dirección son obligatorios' },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabase();

    // Insertar el centro
    const { data: center, error: centerError } = await supabase
      .from('centers')
      .insert({
        country_id,
        state_id: state_id || null,
        city_id: city_id || null,
        address: address.trim(),
        latitude: latitude || null,
        longitude: longitude || null,
        contact_name: contact_name?.trim() || null,
        contact_phone: contact_phone?.trim() || null,
        photo_url: photo_url || null,
        is_24h: is_24h || false,
        open_time: !is_24h && open_time ? open_time : null,
        close_time: !is_24h && close_time ? close_time : null,
        is_all_days: is_all_days || false,
        days_of_week: !is_all_days && days_of_week?.length ? days_of_week : null,
      })
      .select('id')
      .single();

    if (centerError) throw centerError;

    // Insertar etiquetas
    if (tags && Array.isArray(tags) && tags.length > 0) {
      const tagInserts = tags.map((slug: string) => ({
        center_id: center.id,
        tag_slug: slug,
      }));

      const { error: tagError } = await supabase
        .from('center_tags')
        .insert(tagInserts);

      if (tagError) console.error('Error inserting tags:', tagError);
    }

    return NextResponse.json({ id: center.id }, { status: 201 });
  } catch (error) {
    console.error('Error creating center:', error);
    return NextResponse.json(
      { error: 'Error al registrar el centro de acopio' },
      { status: 500 }
    );
  }
}
