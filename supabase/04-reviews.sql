-- ============================================================
-- 매일백세한의원 관리자 — 4단계: 후기 관리
-- Supabase 대시보드 → SQL Editor → New query 에 붙여넣고 Run
--
-- 후기 형식: A4 후기 사진(인바디 결과지 등) 한 장 + 그 아래 관리자 코멘트
-- 공개 범위: 로그인한 회원만 (의료법 제56조 — 치료 경험담은 제한적 제공)
-- ============================================================

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,      -- A4 후기 사진
  image_alt text,               -- 사진 설명(대체텍스트)
  comment text not null,        -- 사진 아래 붙는 관리자 코멘트
  status text not null default 'draft' check (status in ('draft', 'published', 'private')),
  published_date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table reviews enable row level security;

-- 로그인한 회원은 "발행됨" 상태만 읽기 가능
-- (실제 노출은 페이지 쪽의 로그인+동의 확인과 함께 이중으로 걸립니다)
create policy "reviews_member_read_published"
  on reviews for select to authenticated using (status = 'published');

-- 쓰기 정책은 05번(권한 잠그기)에서 is_admin()으로 다시 겁니다.
create policy "reviews_admin_write"
  on reviews for insert to authenticated with check (true);
create policy "reviews_admin_update"
  on reviews for update to authenticated using (true) with check (true);
create policy "reviews_admin_delete"
  on reviews for delete to authenticated using (true);

-- 후기 사진 저장 공간
insert into storage.buckets (id, name, public)
values ('reviews', 'reviews', true)
on conflict (id) do nothing;

create policy "reviews_bucket_public_read"
  on storage.objects for select to anon, authenticated using (bucket_id = 'reviews');
create policy "reviews_bucket_admin_insert"
  on storage.objects for insert to authenticated with check (bucket_id = 'reviews');
create policy "reviews_bucket_admin_delete"
  on storage.objects for delete to authenticated using (bucket_id = 'reviews');
