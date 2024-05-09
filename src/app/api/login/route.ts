import { LOGIN } from "@/lib/const"

export async function POST(request: Request): Promise<Response> {
  try {
    const requestBody = await request.json();
    console.log("Login", requestBody)

    if (
      requestBody.username === LOGIN.username &&
      requestBody.password === LOGIN.password
    ) {
      return new Response(JSON.stringify({ response: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      return new Response(JSON.stringify({ response: 'Wrong credentials' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (error) {
    console.error('Error processing login data:', error);
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
