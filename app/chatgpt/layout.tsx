import { AuthRequired } from "@/components/auth-required";
import { SupabaseProviderWrapper } from "@/components/supabase-provider-wrapper";

export default function ChatGPTLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthRequired>
      <SupabaseProviderWrapper>{children}</SupabaseProviderWrapper>
    </AuthRequired>
  );
}
