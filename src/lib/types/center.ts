export interface Country {
  id: string;
  name: string;
  iso2: string;
}

export interface State {
  id: string;
  country_id: string;
  name: string;
}

export interface City {
  id: string;
  state_id: string;
  name: string;
}

export interface CenterTag {
  slug: string;
  name: string;
}

export interface Center {
  id: string;
  country_id: string;
  state_id: string | null;
  city_id: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  contact_name: string | null;
  contact_phone: string | null;
  photo_url: string | null;
  is_24h: boolean;
  open_time: string | null;
  close_time: string | null;
  is_all_days: boolean;
  days_of_week: number[] | null;
  status: 'active' | 'inactive' | 'disabled';
  created_at: string;
  updated_at: string;
}

export interface CenterListItem {
  id: string;
  photo_url: string | null;
  country: Country;
  state: State | null;
  city: City | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  report_count: number;
  created_at: string;
}

export interface CenterDetail extends Center {
  country: Country;
  state: State | null;
  city: City | null;
  tags: CenterTag[];
  report_count: number;
}

export interface CreateCenterPayload {
  country_id: string;
  state_id: string | null;
  city_id: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  contact_name: string | null;
  contact_phone: string | null;
  photo_url: string | null;
  is_24h: boolean;
  open_time: string | null;
  close_time: string | null;
  is_all_days: boolean;
  days_of_week: number[] | null;
  tags: string[];
}

export interface CenterReport {
  id: string;
  center_id: string;
  reported_at: string;
}
