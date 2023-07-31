export async function handleNotFound() {
  return {
    statusCode: 404,
    body: JSON.stringify({
      error: 'Not found.',
    }),
  };
}
