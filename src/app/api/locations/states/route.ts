import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const countryId = searchParams.get('country_id');

  if (!countryId) {
    return NextResponse.json(
      { error: 'Se requiere country_id' },
      { status: 400 }
    );
  }

  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from('states')
      .select('id, name')
      .eq('country_id', countryId)
      .order('name', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json(
      { error: 'Error al cargar los estados' },
      { status: 500 }
    );
  }
}
