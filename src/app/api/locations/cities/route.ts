import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const stateId = searchParams.get('state_id');

  if (!stateId) {
    return NextResponse.json(
      { error: 'Se requiere state_id' },
      { status: 400 }
    );
  }

  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from('cities')
      .select('id, name')
      .eq('state_id', stateId)
      .order('name', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json(
      { error: 'Error al cargar las ciudades' },
      { status: 500 }
    );
  }
}
