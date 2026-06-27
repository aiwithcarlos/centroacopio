import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { Country, State } from 'country-state-city';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { PREDEFINED_TAGS } from '@/lib/constants/tags';

export const dynamic = 'force-dynamic';

const VALID_TAG_SLUGS = new Set(PREDEFINED_TAGS.map((t) => t.slug));

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || '127.0.0.1';
}

function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim();
}

// Resolver nombres de ubicación usando country-state-city
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

// Fórmula Haversine: calcula distancia en metros entre dos coordenadas
function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6_371_000; // Radio de la Tierra en metros
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const MAX_DISTANCE_M = 30_000; // 30 kilómetros

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
    // Rate limiting para GET (anti-scraping)
    const ip = getClientIp(request);
    const rl = rateLimit(ip, 'get-centers', RATE_LIMITS.GET_CENTERS);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intenta de nuevo en unos segundos.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(rl.resetIn),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    const supabase = await createServerSupabase();

    const hasLocation = !isNaN(lat) && !isNaN(lng);

    // ============================================================
    // Modo "Cerca de mí": filtrar por distancia real (< 30 km)
    // ============================================================
    if (hasLocation) {
      const { data: allCenters, error } = await supabase
        .from('centers')
        .select(
          'id, photo_url, address, latitude, longitude, country_id, state_id, city_id, contact_name, contact_phone, created_at'
        )
        .eq('status', 'active')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (error) throw error;

      // Calcular distancia y filtrar
      type CenterWithDistance = Record<string, unknown> & { distance: number };

      const withDistance: CenterWithDistance[] = (allCenters || [])
        .map((center) => {
          const cLat = center.latitude as number;
          const cLng = center.longitude as number;
          const distance = haversineDistance(lat, lng, cLat, cLng);
          return { ...center, distance } as CenterWithDistance;
        })
        .filter((c) => c.distance <= MAX_DISTANCE_M)
        .sort((a, b) => a.distance - b.distance);

      const total = withDistance.length;
      const totalPages = Math.ceil(total / limit);
      const paginated = withDistance.slice(offset, offset + limit);

      const centerIds = paginated.map((c) => c.id as string);
      const { data: reportCounts } = await supabase
        .from('center_reports')
        .select('center_id')
        .in('center_id', centerIds.length ? centerIds : ['none']);

      const reportMap: Record<string, number> = {};
      (reportCounts || []).forEach((r: { center_id: string }) => {
        reportMap[r.center_id] = (reportMap[r.center_id] || 0) + 1;
      });

      const centers = paginated.map((c) => {
        const loc = resolveLocation(
          c.country_id as string,
          c.state_id as string | null,
          c.city_id as string | null
        );
        return {
          id: c.id,
          photo_url: c.photo_url,
          address: c.address,
          latitude: c.latitude,
          longitude: c.longitude,
          contact_name: c.contact_name,
          contact_phone: c.contact_phone,
          created_at: c.created_at,
          country: loc.country,
          state: loc.state,
          city: loc.city,
          report_count: reportMap[(c.id as string)] || 0,
        };
      });

      return NextResponse.json({
        centers,
        pagination: { page, limit, total, totalPages },
      });
    }

    // ============================================================
    // Modo normal: filtros por país/estado/municipio
    // ============================================================
    let query = supabase
      .from('centers')
      .select(
        'id, photo_url, address, latitude, longitude, country_id, state_id, city_id, contact_name, contact_phone, created_at',
        { count: 'exact' }
      )
      .eq('status', 'active');

    if (countryId) query = query.eq('country_id', countryId);
    if (stateId) query = query.eq('state_id', stateId);
    if (cityId) query = query.eq('city_id', cityId);

    query = query.order('created_at', { ascending: false });

    const { data, error, count } = await query.range(
      offset,
      offset + limit - 1
    );

    if (error) throw error;

    const centerIds = (data || []).map((c: { id: string }) => c.id);
    const { data: reportCounts } = await supabase
      .from('center_reports')
      .select('center_id')
      .in('center_id', centerIds.length ? centerIds : ['none']);

    const reportMap: Record<string, number> = {};
    (reportCounts || []).forEach((r: { center_id: string }) => {
      reportMap[r.center_id] = (reportMap[r.center_id] || 0) + 1;
    });

    const centers = (data || []).map((c: Record<string, unknown>) => {
      const loc = resolveLocation(
        c.country_id as string,
        c.state_id as string | null,
        c.city_id as string | null
      );
      return {
        id: c.id,
        photo_url: c.photo_url,
        address: c.address,
        latitude: c.latitude,
        longitude: c.longitude,
        contact_name: c.contact_name,
        contact_phone: c.contact_phone,
        created_at: c.created_at,
        country: loc.country,
        state: loc.state,
        city: loc.city,
        report_count: reportMap[(c.id as string)] || 0,
      };
    });

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
    // Rate limiting para POST (anti-bots)
    const ip = getClientIp(request);
    const rl = rateLimit(ip, 'post-centers', RATE_LIMITS.POST_CENTER);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Has registrado demasiados centros. Intenta más tarde.' },
        {
          status: 429,
          headers: { 'Retry-After': String(rl.resetIn) },
        }
      );
    }

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
      // Campos de seguridad
      website,       // honeypot
      _t,             // timestamp token (generado por el servidor)
    } = body;

    // Honeypot: si el campo oculto tiene valor, es un bot
    if (website) {
      // Responder como éxito para no revelar que fue detectado
      return NextResponse.json({ id: 'ok' }, { status: 201 });
    }

    // Time check: el formulario debe haberse llenado en al menos 5 segundos
    if (_t) {
      const elapsed = Date.now() - parseInt(_t);
      if (elapsed < 5000) {
        return NextResponse.json(
          { error: 'Por favor, completa el formulario con más detalle.' },
          { status: 400 }
        );
      }
    }

    // Validación básica
    if (!country_id || !address || !address.trim()) {
      return NextResponse.json(
        { error: 'País y dirección son obligatorios' },
        { status: 400 }
      );
    }

    // Validación de longitud
    const sanitizedAddress = sanitize(address).substring(0, 500);
    if (!sanitizedAddress) {
      return NextResponse.json(
        { error: 'La dirección no es válida.' },
        { status: 400 }
      );
    }

    // Validar tags
    const validTags = (tags || []).filter((t: string) =>
      VALID_TAG_SLUGS.has(t)
    );

    // Validar longitud de campos opcionales
    const sanitizedName = contact_name
      ? sanitize(contact_name).substring(0, 100)
      : null;
    const sanitizedPhone = contact_phone
      ? sanitize(contact_phone).substring(0, 100)
      : null;

    const supabase = await createServerSupabase();

    // Las coordenadas vienen del frontend (resueltas desde la API de cities)
    // Si no se enviaron, quedan como null (aceptable para el MVP)

    // Convertir hora de "8:00 AM" a "08:00:00" (TIME de PostgreSQL)
    const convertTime = (t: string | null): string | null => {
      if (!t) return null;
      const match = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) return null;
      let hours = parseInt(match[1]);
      const minutes = match[2];
      const ampm = match[3].toUpperCase();
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
      return `${String(hours).padStart(2, '0')}:${minutes}:00`;
    };

    // Insertar el centro
    const { data: center, error: centerError } = await supabase
      .from('centers')
      .insert({
        country_id,
        state_id: state_id || null,
        city_id: city_id || null,
        address: sanitizedAddress,
        latitude: latitude || null,
        longitude: longitude || null,
        contact_name: sanitizedName,
        contact_phone: sanitizedPhone,
        photo_url: photo_url || null,
        is_24h: is_24h || false,
        open_time: !is_24h ? convertTime(open_time) : null,
        close_time: !is_24h ? convertTime(close_time) : null,
        is_all_days: is_all_days || false,
        days_of_week:
          !is_all_days && days_of_week?.length ? days_of_week : null,
      })
      .select('id')
      .single();

    if (centerError) throw centerError;

    // Insertar etiquetas (solo slugs válidos)
    if (validTags.length > 0) {
      const tagInserts = validTags.map((slug: string) => ({
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
