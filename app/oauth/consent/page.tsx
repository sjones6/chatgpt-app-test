import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DecisionButtons } from "./decision-buttons";

export default async function ConsentPage({
  searchParams,
}: {
  searchParams: { authorization_id?: string };
}) {
  const authorizationId = searchParams.authorization_id;

  if (!authorizationId) {
    return <div>Error: Missing authorization_id</div>;
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/auth/login?redirect=/oauth/consent?authorization_id=${authorizationId}`
    );
  }

  const { data: authDetails, error } =
    await supabase.auth.oauth.getAuthorizationDetails(authorizationId);

  if (error || !authDetails) {
    return <div>Error: {error?.message || "Invalid authorization request"}</div>;
  }

  const scopes = authDetails.scope?.split(" ");

  return (
    <div className="font-sans p-8 sm:p-20 max-w-2xl mx-auto">
      <main className="flex flex-col gap-8">
        <h1 className="text-4xl font-black tracking-tight">
          Authorize {authDetails.client.name}
        </h1>
        <p className="text-lg">
          This application wants to access your account.
        </p>
        <div className="flex flex-col gap-4 p-6 border border-solid rounded-lg">
          <div>
            <p className="font-semibold">Client:</p>
            <p>{authDetails.client.name}</p>
          </div>
          <div>
            <p className="font-semibold">Redirect URI:</p>
            <p className="font-mono text-sm break-all">
              {authDetails.redirect_url}
            </p>
          </div>
          {scopes.length > 0 && (
            <div>
              <p className="font-semibold mb-2">Requested permissions:</p>
              <ul className="list-disc list-inside space-y-1">
                {scopes.map((scope) => (
                  <li key={scope} className="font-mono text-sm">
                    {scope}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <DecisionButtons authorizationId={authorizationId} />
      </main>
    </div>
  );
}

