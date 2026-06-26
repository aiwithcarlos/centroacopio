import { NextRequest, NextResponse } from 'next/server';
import { State } from 'country-state-city';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const countryId = searchParams.get('country_id'); // ISO2 code: "VE", "CO", etc.

  if (!countryId) {
    return NextResponse.json(
      { error: 'Se requiere country_id (ISO2)' },
      { status: 400 }
    );
  }

  try {
    const states = State.getStatesOfCountry(countryId).map((s) => ({
      id: s.isoCode,       // ISO code: "VE-A", "VE-B", etc.
      name: s.name,
    }));

    states.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    return NextResponse.json(states);
  } catch {
    return NextResponse.json(
      { error: 'Error al cargar los estados' },
      { status: 500 }
    );
  }
}
