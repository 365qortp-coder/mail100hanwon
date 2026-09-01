-- ============================================================
-- 매일백세한의원 관리자 — 5단계: 관리자와 일반 회원 구분해서 잠그기
-- Supabase 대시보드 → SQL Editor → New query 에 붙여넣고 Run
--
-- ⚠️ 이 파일이 제일 중요합니다. 반드시 실행하세요.
--
-- 왜 필요한가: 앞의 01~04번 정책들은 "로그인만 했으면 통과"입니다.
-- 그런데 곧 카카오 회원 로그인을 열 예정이라, 그대로 두면
-- **카카오로 로그인한 아무 환자나 병원 정보를 고치고 후기를 지울 수 있습니다.**
-- 이 파일이 그걸 "진짜 관리자만"으로 다시 잠급니다.
--
-- 실행 시점: 회원 로그인(카카오)을 열기 **전에** 반드시 실행.
-- ============================================================

-- 1) 지금 있는 계정(원장님 관리자 계정)에 "role: admin" 표식을 남깁니다.
--    카카오 회원은 이 뒤에 생기므로 영향받지 않습니다.
--    ⚠️ 카카오 로그인을 이미 연 뒤라면, 아래를 그냥 실행하면 회원까지
--       관리자가 되어 버립니다. 그 경우 where 절로 관리자 계정만 지정하세요.
--       예: where email = '원장님관리자이메일@example.com'
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb;

-- 2) "이 요청을 보낸 사람이 관리자인가?"를 확인하는 함수
create or replace function is_admin()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

-- 3) 앞에서 만든 정책들을 "로그인만 하면 통과" → "관리자여야 통과"로 교체

-- 병원 정보
drop policy if exists "clinic_settings_admin_update" on clinic_settings;
create policy "clinic_settings_admin_update" on clinic_settings
  for update to authenticated using (is_admin()) with check (is_admin());

-- 팝업
drop policy if exists "popups_admin_write" on popups;
create policy "popups_admin_write" on popups
  for insert to authenticated with check (is_admin());
drop policy if exists "popups_admin_update" on popups;
create policy "popups_admin_update" on popups
  for update to authenticated using (is_admin()) with check (is_admin());
drop policy if exists "popups_admin_delete" on popups;
create policy "popups_admin_delete" on popups
  for delete to authenticated using (is_admin());

drop policy if exists "popups_bucket_admin_insert" on storage.objects;
create policy "popups_bucket_admin_insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'popups' and is_admin());
drop policy if exists "popups_bucket_admin_delete" on storage.objects;
create policy "popups_bucket_admin_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'popups' and is_admin());

-- 후기
drop policy if exists "reviews_admin_write" on reviews;
create policy "reviews_admin_write" on reviews
  for insert to authenticated with check (is_admin());
drop policy if exists "reviews_admin_update" on reviews;
create policy "reviews_admin_update" on reviews
  for update to authenticated using (is_admin()) with check (is_admin());
drop policy if exists "reviews_admin_delete" on reviews;
create policy "reviews_admin_delete" on reviews
  for delete to authenticated using (is_admin());
-- 관리자는 초안·비공개까지 전부 읽을 수 있어야 목록·수정이 됩니다
drop policy if exists "reviews_admin_read_all" on reviews;
create policy "reviews_admin_read_all" on reviews
  for select to authenticated using (is_admin());

drop policy if exists "reviews_bucket_admin_insert" on storage.objects;
create policy "reviews_bucket_admin_insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'reviews' and is_admin());
drop policy if exists "reviews_bucket_admin_delete" on storage.objects;
create policy "reviews_bucket_admin_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'reviews' and is_admin());

-- 통계(관리자만 읽기)
drop policy if exists "button_clicks_admin_read" on button_clicks;
create policy "button_clicks_admin_read" on button_clicks
  for select to authenticated using (is_admin());

drop policy if exists "bot_visits_admin_read" on bot_visits;
create policy "bot_visits_admin_read" on bot_visits
  for select to authenticated using (is_admin());

-- 회원 동의 기록·회원 목록(관리자만 전체 조회)
drop policy if exists "member_consents_admin_read" on member_consents;
create policy "member_consents_admin_read" on member_consents
  for select to authenticated using (is_admin());

drop policy if exists "profiles_admin_read" on profiles;
create policy "profiles_admin_read" on profiles
  for select to authenticated using (is_admin());

-- ============================================================
-- 확인용 — 아래를 실행해서 true 가 나오면 관리자로 인식된 것입니다.
--   select is_admin();
-- ============================================================
