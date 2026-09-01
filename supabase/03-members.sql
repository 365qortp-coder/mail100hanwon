-- ============================================================
-- 매일백세한의원 관리자 — 3단계: 회원(카카오 로그인) 동의 기록 + 회원 목록
-- Supabase 대시보드 → SQL Editor → New query 에 붙여넣고 Run
-- ============================================================

-- 1) 개인정보 동의 기록
--    누가 · 언제 · 무엇에 동의했는지 남깁니다. (법적 요건)
create table if not exists member_consents (
  user_id uuid primary key references auth.users(id) on delete cascade,
  agreed_required boolean not null default false,   -- [필수] 개인정보 수집·이용 동의
  agreed_marketing boolean not null default false,  -- [선택] 마케팅 정보 수신 동의
  agreed_at timestamptz not null default now()
);

alter table member_consents enable row level security;

-- 본인 동의 기록만 본인이 남기고 읽을 수 있음
create policy "member_consents_self_insert"
  on member_consents for insert to authenticated with check (auth.uid() = user_id);
create policy "member_consents_self_read"
  on member_consents for select to authenticated using (auth.uid() = user_id);

-- 2) 회원 목록
--    auth.users 표는 보안상 관리자 화면에서 직접 못 읽습니다.
--    그래서 가입할 때 필요한 정보만 이 표로 자동 복사해 둡니다.
create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nickname text,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "profiles_self_read"
  on profiles for select to authenticated using (auth.uid() = user_id);

-- 새로 가입하는 사람(관리자 제외)마다 자동으로 profiles에 한 줄 추가
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(new.raw_app_meta_data->>'role', '') <> 'admin' then
    insert into public.profiles (user_id, nickname)
    values (
      new.id,
      coalesce(
        new.raw_user_meta_data->>'nickname',
        new.raw_user_meta_data->>'name',
        new.raw_user_meta_data->>'full_name'
      )
    )
    on conflict (user_id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- 이미 가입되어 있던 회원도 소급 반영
insert into profiles (user_id, nickname)
select id, coalesce(
    raw_user_meta_data->>'nickname',
    raw_user_meta_data->>'name',
    raw_user_meta_data->>'full_name'
  )
from auth.users
where coalesce(raw_app_meta_data->>'role', '') <> 'admin'
on conflict (user_id) do nothing;
