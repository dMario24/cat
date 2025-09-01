"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/lib/supabaseClient';

// Define the type for a record for better type safety
type Record = {
  id: number;
  created_at: string;
  note: string;
  image_url: string;
};

export default function Home() {
  const [note, setNote] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [records, setRecords] = useState<Record[]>([]);

  const fetchRecords = async () => {
    const { data, error } = await supabase
      .from('feeding_records')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching records:', error);
    } else {
      setRecords(data as Record[]);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !note) {
      alert('사진과 메모를 모두 입력해주세요.');
      return;
    }

    setUploading(true);

    const fileName = `${Date.now()}_${file.name}`;
    const { error: fileError } = await supabase.storage
      .from('cat-photos')
      .upload(fileName, file);

    if (fileError) {
      console.error('Error uploading file:', fileError);
      alert('파일 업로드에 실패했습니다.');
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from('cat-photos')
      .getPublicUrl(fileName);

    const imageUrl = urlData.publicUrl;

    const { error: dbError } = await supabase
      .from('feeding_records')
      .insert([{ note, image_url: imageUrl }]);

    if (dbError) {
      console.error('Error inserting data:', dbError);
      alert('데이터 저장에 실패했습니다.');
    } else {
      alert('기록이 성공적으로 저장되었습니다.');
      setNote('');
      setFile(null);
      // Reset the file input visually
      const fileInput = document.getElementById('photo') as HTMLInputElement;
      if(fileInput) fileInput.value = '';

      fetchRecords(); // Refresh the list of records
    }

    setUploading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold">까만 새끼 고양이 밥주기 기록</h1>
        <p className="text-lg text-gray-600">디지노리 사무실 앞 고양이들을 위한 기록 페이지</p>
      </header>

      <main className="max-w-lg mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>새 기록 추가</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="note" className="block text-sm font-medium text-gray-700">메모</label>
                <Textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="고양이들의 상태나 특이사항을 기록해주세요."
                  required
                />
              </div>
              <div>
                <label htmlFor="photo" className="block text-sm font-medium text-gray-700">사진</label>
                <Input
                  id="photo"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  required
                />
              </div>
              <Button type="submit" disabled={uploading}>
                {uploading ? '기록 중...' : '기록하기'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-center mb-6">최근 기록</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {records.map((record) => (
            <Card key={record.id}>
              <CardHeader>
                <img src={record.image_url} alt="고양이 사진" className="rounded-md object-cover aspect-square" />
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{record.note}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(record.created_at).toLocaleString('ko-KR')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
