import { AuthRequired } from "@/components/auth-required";

export default function ChatGPTLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthRequired>{children}</AuthRequired>;
}
