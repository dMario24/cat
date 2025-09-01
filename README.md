# cat
디지노리 사무실 앞 마스코드 엄마냥 - 까만 새끼 고양이 두마리의 엄마의 이야기

<img width="555" alt=" 까만 새끼 고양이 두마리의 엄마냥" src="https://github.com/user-attachments/assets/b73d12f2-005d-4ae5-95ac-730b1fbd735a" />


## Getting Started
```bash
npm install
npm run dev
```

## SUPABASE DB
```sql
물론이죠. 아래 SQL 쿼리를 Supabase 대시보드의 SQL 편집기에서 실행하시면 됩니다.

테이블 생성:

CREATE TABLE public.feeding_records (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    notes text NULL,
    image_url text NULL,
    CONSTRAINT feeding_records_pkey PRIMARY KEY (id)
);
저장소 버킷 생성: 저장소 버킷은 SQL로 직접 생성할 수 없습니다. Supabase 대시보드의 Storage 섹션에서 cat-pictures라는 이름의 공개 버킷을 만들어 주세요.

RLS 활성화 및 정책 생성:

-- Row Level Security 활성화
ALTER TABLE public.feeding_records ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 접근 정책 생성
CREATE POLICY "Public read access" ON public.feeding_records
FOR SELECT USING (true);

-- 공개 쓰기 접근 정책 생성
CREATE POLICY "Public insert access" ON public.feeding_records
FOR INSERT WITH CHECK (true);
이 쿼리들을 실행하신 후에 알려주세요.
```
