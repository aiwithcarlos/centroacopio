import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { Country, State } from 'country-state-city';

export const dynamic = 'force-dynamic';

function resolveLocation(
  countryId: string,
  stateId: string | null,
  cityId: string | null
) {
  const country = Country.getCountryByCode(countryId);
  let state = null;
  let city = null;

  if (stateId) {
    const s = State.getStateByCodeAndCountry(stateId, countryId);
    if (s) state = { id: s.isoCode, name: s.name };
  }

  if (cityId) {
    city = { id: cityId, name: cityId };
  }

  return {
    country: country
      ? { id: country.isoCode, name: country.name, iso2: country.isoCode }
      : { id: countryId, name: countryId, iso2: countryId },
    state,
    city,
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const supabase = await createServerSupabase();

    const { data: center, error } = await supabase
      .from('centers')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !center) {
      return NextResponse.json(
        { error: 'Centro de acopio no encontrado' },
        { status: 404 }
      );
    }

    // Resolver nombres de ubicación
    const loc = resolveLocation(
      center.country_id,
      center.state_id,
      center.city_id
    );

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
      country: loc.country,
      state: loc.state,
      city: loc.city,
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
