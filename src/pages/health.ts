export const prerender = false;

export const GET = () =>
  new Response('ok', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
