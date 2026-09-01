-- ============================================================
-- 매일백세한의원 관리자 — 1단계: 병원 정보 + 팝업
-- Supabase 대시보드 → SQL Editor → New query 에 붙여넣고 Run
--
-- 실행 순서: 01 → 02 → 03 → 04 → 05  (번호대로)
--
-- ⚠️ 이 사이트는 칼럼(.md 글 파일)을 Supabase로 옮기지 않습니다.
--    칼럼 39편과 관리 앱 연결(문 3개)이 파일 방식에 맞춰져 있어서입니다.
--    그래서 gambihwan에 있는 columns/column_categories 표는 만들지 않습니다.
-- ============================================================

-- 1) 병원 기본 정보 (항상 딱 1줄만 있는 표)
--    기본값은 지금 사이트(src/data/clinic.ts)에 있는 실제 값으로 채워 둡니다.
create table if not exists clinic_settings (
  id int primary key default 1,
  name text not null default '매일백세한의원',
  director text not null default '송원석',
  tel text not null default '0507-1467-0195',
  tel_href text not null default 'tel:050714670195',
  kakao_url text not null default 'https://pf.kakao.com/_JEzRK/chat',
  reserve_url text not null default 'https://naver.me/F88gzvcg',
  naver_review_url text not null default 'https://map.naver.com/p/entry/place/1632908709',
  region text not null default '서울 중랑구',
  address text not null default '서울특별시 중랑구 공릉로 21',
  map_lat numeric not null default 37.6094,
  map_lng numeric not null default 127.0763,
  hours jsonb not null default '[
    {"day":"평일","time":"09:30 - 18:30"},
    {"day":"점심","time":"13:00 - 14:00"},
    {"day":"토요일","time":"09:30 - 13:00"},
    {"day":"휴진","time":"일요일"}
  ]'::jsonb,
  -- 회원 로그인 방식 켜고 끄기
  auth_kakao_enabled boolean not null default false,
  updated_at timestamptz not null default now(),
  constraint clinic_settings_singleton check (id = 1)
);

insert into clinic_settings (id) values (1) on conflict (id) do nothing;

-- 2) 팝업
create table if not exists popups (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text,
  link_url text,
  start_date date not null,
  end_date date not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 접근 권한 (RLS)
-- 원칙: 방문자는 읽기만, 관리자는 읽기+쓰기
-- ⚠️ "누구나 읽기"는 반드시 to anon, authenticated 둘 다 — anon만 걸면
--    로그인한 일반 회원에게 안 보이는 버그가 납니다 (관리자.md 함정 9번)
-- ============================================================

alter table clinic_settings enable row level security;
alter table popups enable row level security;

create policy "clinic_settings_public_read"
  on clinic_settings for select to anon, authenticated using (true);

create policy "popups_public_read"
  on popups for select to anon, authenticated using (true);

-- 쓰기 정책은 05번(권한 잠그기)에서 is_admin()으로 다시 겁니다.
-- 여기서는 우선 로그인한 사람만 쓸 수 있게 해 둡니다.
create policy "clinic_settings_admin_update"
  on clinic_settings for update to authenticated using (true) with check (true);

create policy "popups_admin_write"
  on popups for insert to authenticated with check (true);
create policy "popups_admin_update"
  on popups for update to authenticated using (true) with check (true);
create policy "popups_admin_delete"
  on popups for delete to authenticated using (true);

-- 3) 팝업 이미지 저장 공간
insert into storage.buckets (id, name, public)
values ('popups', 'popups', true)
on conflict (id) do nothing;

create policy "popups_bucket_public_read"
  on storage.objects for select to anon, authenticated using (bucket_id = 'popups');
create policy "popups_bucket_admin_insert"
  on storage.objects for insert to authenticated with check (bucket_id = 'popups');
create policy "popups_bucket_admin_delete"
  on storage.objects for delete to authenticated using (bucket_id = 'popups');
