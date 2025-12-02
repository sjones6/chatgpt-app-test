import { AuthRequired } from "@/components/auth-required";
import { SupabaseProviderWrapper } from "@/components/supabase-provider-wrapper";

export default function ChatGPTLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SupabaseProviderWrapper>
      <AuthRequired>
        {children}
      </AuthRequired>
    </SupabaseProviderWrapper>
  );
}
