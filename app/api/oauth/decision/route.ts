import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const decision = body.decision;
  const authorizationId = body.authorization_id as string;

  if (!authorizationId) {
    return NextResponse.json(
      { error: "Missing authorization_id" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  // Approved authorization
  if (decision === "approve") {
    const { data, error } =
      await supabase.auth.oauth.approveAuthorization(authorizationId);
    if (error || !data) {
      return NextResponse.json({ error: error?.message || "Failed to approve authorization" }, { status: 400 });
    }
    return NextResponse.json({ redirect_url: data.redirect_url });
  }

  // Denied authorization
  const { data, error } =
  await supabase.auth.oauth.denyAuthorization(authorizationId);
  if (error || !data) {
    return NextResponse.json({ error: error?.message || "Failed to deny authorization" }, { status: 400 });
  }
  return NextResponse.json({ redirect_url: data.redirect_url });
}

