-- ============================================================
-- MUSINSA Global B2B - Storage Bucket Policies
--
-- 사전 작업: Supabase Dashboard → Storage → New Bucket → 'media' (Public)
-- 이 SQL은 버킷 생성 후 실행하세요.
-- ============================================================
-- 데모 / 내부 운영용: anon 사용자도 업로드/읽기 가능
-- 운영 단계에선 인증된 어드민만 가능하도록 제한 필요
-- ============================================================

-- 기존 정책 제거 (재실행 안전)
drop policy if exists "media_anon_select" on storage.objects;
drop policy if exists "media_anon_insert" on storage.objects;
drop policy if exists "media_anon_update" on storage.objects;
drop policy if exists "media_anon_delete" on storage.objects;

-- ============================================================
-- 모든 사용자가 'media' 버킷 파일 읽기 가능 (public bucket이라 사실상 자동)
-- ============================================================
create policy "media_anon_select" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'media');

-- ============================================================
-- anon 업로드 허용 (데모용)
-- ============================================================
create policy "media_anon_insert" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'media');

create policy "media_anon_update" on storage.objects
  for update to anon, authenticated
  using (bucket_id = 'media');

create policy "media_anon_delete" on storage.objects
  for delete to anon, authenticated
  using (bucket_id = 'media');

-- 완료 메시지
select 'Storage policies applied for media bucket.' as status;
