export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string | null;
  photo: string;
  country_code: string;
  phone_number: string;
  created_at: string; // atau `Date` jika kamu ingin parsing ke objek Date
  updated_at: string; // atau `Date`
}
