import { CircleDollarSign, Layers, Coins, Bot } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";
import $client from "@/service/client";

const items = [
  //TODO: top up your wallet
  {
    title: "AI Agent",
    url: "/",
    icon: Bot,
  },
  {
    title: "Tokens",
    url: "tokens",
    icon: Coins,
  },
  {
    title: "Vestings",
    url: "#",
    icon: CircleDollarSign,
  },
  {
    title: "Staking",
    url: "#",
    icon: Layers,
  },
];

export function AppSidebar() {
  const handleClick = () => {
    logout();
  };
  const { logout, authenticated } = usePrivy();
  useEffect(() => {
    if (authenticated) {
      $client.post("/auth");
    }
  }, [authenticated]);
  if (!authenticated) return <></>;
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button onClick={handleClick}>Logout</Button>
      </SidebarFooter>
    </Sidebar>
  );
}
