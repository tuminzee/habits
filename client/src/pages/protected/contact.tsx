import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMe } from "@/hooks/use-me";
import { useUsers } from "@/hooks/use-users";

export default function Contact() {
  const { data: me, isLoading: meLoading } = useMe();
  const { data: users, isLoading: usersLoading } = useUsers();

  if (meLoading || usersLoading) {
    return (
      <div className="w-full h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!me) return null;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-8 p-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>
            <span className="text-muted-foreground">Welcome,</span>
            <br />
            <p className="font-bold mt-2">{me.username} 👋</p>
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Users ({users?.total})</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="flex flex-col gap-2">
              {users?.users.map((user) => (
                <div
                  key={user.username}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted"
                >
                  <Avatar>
                    <AvatarFallback>
                      {user.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{user.username}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
