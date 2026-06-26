import { NextResponse } from 'next/server';
import { Country } from 'country-state-city';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const countries = Country.getAllCountries().map((c) => ({
      id: c.isoCode,        // ISO2: "VE", "CO", etc.
      name: c.name,
      iso2: c.isoCode,
      flag: c.flag,
    }));

    // Ordenar: Venezuela primero, luego alfabéticamente
    countries.sort((a, b) => {
      if (a.iso2 === 'VE') return -1;
      if (b.iso2 === 'VE') return 1;
      return a.name.localeCompare(b.name, 'es');
    });

    return NextResponse.json(countries);
  } catch {
    return NextResponse.json(
      { error: 'Error al cargar los países' },
      { status: 500 }
    );
  }
}
