export type PostImages = {
  imgs?: string[];
  tin?: string;
};

export type Post = {
  id: number;
  client_id: string | null;
  owner: string | null;
  owner_client: string | null;
  title: string | null;
  loai: string | null;
  quan: string | null;
  phuong: string | null;
  duong: string | null;
  gia: string | null;
  dien_tich: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  mota: string | null;
  status: string | null;
  trang_thai: string | null;
  video: string | null;
  anh: PostImages | null;
  created_at: string | null;
};

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  membership_tier: string | null;
  membership_expires_at: string | null;
  is_admin: boolean | null;
  age: number | null;
  gender: string | null;
  address: string | null;
  bio: string | null;
  created_at: string | null;
};
