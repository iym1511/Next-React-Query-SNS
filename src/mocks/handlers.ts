import {HttpResponse, http} from 'msw'

export const handlers = [
  http.post('/api/login', () => {
    console.log('로그인');
    // DB에서 데이터 가져오는것
    return HttpResponse.json(User[1], {
      headers: {
        'Set-Cookie': 'connect.sid=msw-cookie;HttpOnly;Path=/'
      }
    })
  }),
  http.post('/api/logout', () => {
    console.log('로그아웃');
    return new HttpResponse(null, {
      headers: {
        'Set-Cookie': 'connect.sid=;HttpOnly;Path=/;Max-Age=0'
      }
    })
  })
]