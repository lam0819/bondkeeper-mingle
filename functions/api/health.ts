
export async function onRequest(context) {
  return new Response(
    JSON.stringify({
      status: "ok",
      environment: context.env.ENVIRONMENT || "development",
      timestamp: new Date().toISOString(),
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
