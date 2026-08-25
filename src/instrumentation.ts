import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('../sentry.edge.config');
  }
}

export const onRequestError: typeof Sentry.captureRequestError = (
  err,
  request,
  context,
) => {
  const message = err instanceof Error ? err.message : String(err);
  if (message.includes("Failed to find Server Action")) {
    return;
  }
  return Sentry.captureRequestError(err, request, context);
};

