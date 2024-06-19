import { NextResponse } from 'next/server';

// GET 요청을 처리하는 핸들러
export async function GET(request: Request) {
  try {
    // API에서 포스트 데이터를 가져오는 예시
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/hashtags/trends` ,{
      next: {
        tags: ['trends'],
      },
      credentials: 'include',
      cache: 'no-store',
    });
    const data = await response.json();

    // 데이터가 있는 경우 성공적인 응답을 반환
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    // 오류가 발생한 경우 서버 오류 응답을 반환
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

