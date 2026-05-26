import { AuthenticateWithRedirectCallback, SignIn } from "@clerk/nextjs";

export default async function SignInPage({
  params,
}: {
  params: Promise<{ "sign-in"?: string[] }>;
}) {
  const routeParams = await params;
  const isSsoCallback = routeParams["sign-in"]?.[0] === "sso-callback";

  return (
    <main style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', gap: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#09090b' }}>
      <div id="clerk-captcha" />
      {isSsoCallback ? (
        <AuthenticateWithRedirectCallback
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
          signInForceRedirectUrl="/sync-user"
          signInFallbackRedirectUrl="/sync-user"
          signUpForceRedirectUrl="/sync-user"
          signUpFallbackRedirectUrl="/sync-user"
        />
      ) : (
        <SignIn
          forceRedirectUrl="/sync-user"
          fallbackRedirectUrl="/sync-user"
          oauthFlow="redirect"
        />
      )}
    </main>
  );
}
