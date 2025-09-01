'use client';

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
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
  image_url: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "기록 중..." : "기록하기"}
    </Button>
  );
}

export default function Home() {
  const [records, setRecords] = useState<FeedingRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(createFeedingRecord, initialState);

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

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">디지노리 새끼 고양이 밥주기 기록 🐾</h1>

      <Card className="mb-8">
        <form ref={formRef} action={formAction}>
          <CardHeader>
            <CardTitle>새로운 기록 추가</CardTitle>
            <CardDescription>사진과 함께 오늘의 기록을 남겨주세요.</CardDescription>
            {state.error && <p className="text-sm font-medium text-destructive">{state.error}</p>}
          </CardHeader>
          <CardContent className="space-y-4">
              <div>
                <label htmlFor="picture">사진</label>
                <Input id="picture" name="picture" type="file" required />
              </div>
              <div>
                <label htmlFor="notes">메모</label>
                <Textarea id="notes" name="notes" placeholder="오늘의 고양이들 상태는 어떤가요?" />
              </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
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
                  <img src={record.image_url} alt={record.notes || "Cat"} className="rounded-md" />
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
