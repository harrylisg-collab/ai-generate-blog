import { getAllUsers } from "@/lib/auth";
import UsersClient from "@/components/UsersClient";

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const users = await getAllUsers();
  
  // Don't return passwords
  const safeUsers = users.map(({ password, ...user }) => user);

  return <UsersClient initialUsers={safeUsers} />;
}
