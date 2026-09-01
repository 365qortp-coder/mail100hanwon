-- ============================================================
-- 매일백세한의원 관리자 — 2단계: 방문·클릭 기록 (관리자 홈 화면용)
-- Supabase 대시보드 → SQL Editor → New query 에 붙여넣고 Run
--
-- 칸 이름은 gambihwan(표준)과 똑같이 맞춰 두었습니다.
-- 표준에서 검증된 화면 코드를 고치지 않고 그대로 쓰기 위해서입니다.
-- ============================================================

-- 1) 문의 버튼 클릭 기록 (전화·카카오·네이버예약)
create table if not exists button_clicks (
  id bigint generated always as identity primary key,
  button_key text not null,                      -- 'kakao' | 'reserve' | 'tel'
  clicked_at timestamptz not null default now()
);

create index if not exists button_clicks_key_date_idx
  on button_clicks (button_key, clicked_at);

alter table button_clicks enable row level security;

-- 방문자가 버튼을 누르면 기록이 남아야 하므로 누구나 기록 추가 가능
create policy "button_clicks_public_insert"
  on button_clicks for insert to anon, authenticated with check (true);

-- 읽기는 05번(권한 잠그기)에서 관리자만으로 좁힙니다
create policy "button_clicks_admin_read"
  on button_clicks for select to authenticated using (true);

-- 2) AI 봇 방문 기록 (챗GPT·클로드·퍼플렉시티 등이 읽어 갔는지)
create table if not exists bot_visits (
  id bigint generated always as identity primary key,
  bot_name text not null,                        -- 'GPTBot (OpenAI)' 등
  path text not null,
  visited_at timestamptz not null default now()
);

create index if not exists bot_visits_name_date_idx
  on bot_visits (bot_name, visited_at);

alter table bot_visits enable row level security;

-- 서버(미들웨어)가 로그인 없이 기록을 남겨야 하므로 익명 insert 허용
create policy "bot_visits_public_insert"
  on bot_visits for insert to anon, authenticated with check (true);

create policy "bot_visits_admin_read"
  on bot_visits for select to authenticated using (true);
