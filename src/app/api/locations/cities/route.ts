import { NextRequest, NextResponse } from 'next/server';
import { City } from 'country-state-city';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const countryId = searchParams.get('country_id'); // ISO2: "VE", "CO"
  const stateId = searchParams.get('state_id');      // State ISO: "VE-A", "VE-B"

  if (!countryId || !stateId) {
    return NextResponse.json(
      { error: 'Se requieren country_id y state_id' },
      { status: 400 }
    );
  }

  try {
    const cities = City.getCitiesOfState(countryId, stateId).map((c) => ({
      id: c.name,          // Usar el nombre de la ciudad como ID
      name: c.name,
      latitude: Number(c.latitude) || null,
      longitude: Number(c.longitude) || null,
    }));

    cities.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    return NextResponse.json(cities);
  } catch {
    return NextResponse.json(
      { error: 'Error al cargar las ciudades' },
      { status: 500 }
    );
  }
}
