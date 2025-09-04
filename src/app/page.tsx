'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useRef, useState, useTransition } from "react";
import { useFormState } from "react-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createFeedingRecord, FormState } from "./actions";
import { supabase } from "@/lib/supabase";

const initialState: FormState = {
  error: null,
  success: false,
};

interface FeedingRecord {
  id: string;
  created_at: string;
  notes: string | null;
  image_url: string | null;
}

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button type="submit" disabled={isPending}>
      {isPending ? "기록 중..." : "기록하기"}
    </Button>
  );
}

export default function Home() {
  const [records, setRecords] = useState<FeedingRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(createFeedingRecord, initialState);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  useEffect(() => {
    async function fetchRecords() {
      const { data, error } = await supabase
        .from("feeding_records")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        setError(error.message);
      } else {
        setRecords(data);
      }
    }
    fetchRecords();
  }, [state.success]); // Refetch when a new record is successfully added

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      const formData = new FormData(event.currentTarget);
      const picture = formData.get('picture') as File;

      if (picture && (picture.type === 'image/heic' || picture.type === 'image/heif' || picture.name.toLowerCase().endsWith('.heic') || picture.name.toLowerCase().endsWith('.heif'))) {
        try {
          const heic2any = (await import('heic2any')).default;
          const convertedBlob = await heic2any({
            blob: picture,
            toType: 'image/jpeg',
            quality: 0.8,
          });
          const convertedFile = new File([convertedBlob as Blob], picture.name.replace(/\.[^/.]+$/, ".jpg"), { type: 'image/jpeg' });
          formData.set('picture', convertedFile);
        } catch (error) {
          console.error('Image conversion error:', error);
          // Optionally, show an error to the user
          return;
        }
      }
      formAction(formData);
    });
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">디지노리 새끼 고양이 밥주기 기록 🐾</h1>

      <Card className="mb-8">
        <form ref={formRef} onSubmit={handleFormSubmit}>
          <CardHeader>
            <CardTitle>새로운 기록 추가</CardTitle>
            <CardDescription>사진과 함께 오늘의 기록을 남겨주세요.</CardDescription>
            {state.error && <p className="text-sm font-medium text-destructive">{state.error}</p>}
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="notes">메모</label>
              <Textarea id="notes" name="notes" placeholder="오늘의 고양이들 상태는 어떤가요?" />
            </div>
            <div>
              <label htmlFor="picture">사진 (선택)</label>
              <Input id="picture" name="picture" type="file" accept="image/*,.heic,.heif" />
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton isPending={isPending} />
          </CardFooter>
        </form>
      </Card>

      <div>
        <h2 className="text-xl font-bold mb-4">최근 기록</h2>
        {error && <p className="text-red-500">{error}</p>}
        {records && records.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {records.map((record) => (
              <Card key={record.id}>
                <CardHeader>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {record.image_url && <img src={record.image_url} alt={record.notes || "Cat"} className="rounded-md" />}
                </CardHeader>
                <CardContent>
                  <p>{record.notes}</p>
                  <p className="text-sm text-gray-500">{new Date(record.created_at).toLocaleString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p>아직 기록이 없습니다.</p>
        )}
      </div>
    </main>
  );
}