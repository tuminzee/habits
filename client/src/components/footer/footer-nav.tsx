import { useLocation, useNavigate } from "react-router-dom";
import { User, Flower } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserButton } from "@clerk/clerk-react";

const FooterNav = () => {
  const navigate = useNavigate();
  const currentPath = useLocation();

  const handleTabChange = (path: string) => {
    navigate(path);
  };

  const tabs = [
    { label: "Contact", icon: <User />, path: "/contact" },
    // { label: "Chat", icon: <MessageCircle />, path: "/chat" },
    { label: "Streak", icon: <Flower />, path: "/streak" },
    // { label: "Settings", icon: <Settings />, path: "/settings" },
  ];

  return (
    <Tabs
      className="fixed bottom-0 left-0 w-full rounded-b-md"
      value={currentPath.pathname}
    >
      <TabsList className="flex justify-between">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.path}
            value={tab.path}
            onClick={() => handleTabChange(tab.path)}
            className={`${
              currentPath.pathname === tab.path
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            {tab.icon}
          </TabsTrigger>
        ))}
        <UserButton />
      </TabsList>
    </Tabs>
  );
};

export default FooterNav;
