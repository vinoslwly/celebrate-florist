-- Closing copy after photobooth (Selesai / Lewati).
-- Studio-editable; default matches the Sky ending scene.

alter table public.experiences
  add column if not exists ending_message text not null
  default 'Hadiah ini milikmu. Buka lagi kapan saja —
kenangannya tetap di sini.';
