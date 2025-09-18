'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Home, BarChart2, Book, Github, LifeBuoy } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';

const navItems = [
  { href: '/', icon: Home, label: 'Dashboard' },
  { href: '/c/MES', icon: BarChart2, label: 'Charts' },
  { href: '/j', icon: Book, label: 'Journals' },
];

const instrumentLinks = [
    { href: '/c/MES?tf=1m', label: 'MES / 1m' },
    { href: '/c/MES?tf=5m', label: 'MES / 5m' },
    { href: '/c/MGC?tf=1m', label: 'MGC / 1m' },
    { href: '/c/MGC?tf=5m', label: 'MGC / 5m' },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="flex items-center justify-between p-4">
          <Link href="/" className="font-headline font-bold text-xl tracking-tighter">
            MarketViz
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild variant="default" size="default" isActive={isActive(item.href)}>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>

          <SidebarMenu className="mt-4">
            <SidebarMenuButton size="sm" className="pointer-events-none mb-1 h-auto px-2 py-1 text-xs text-muted-foreground">Instruments</SidebarMenuButton>
            {instrumentLinks.map((link) => (
                 <SidebarMenuItem key={link.href}>
                    <SidebarMenuButton asChild variant="default" size="sm" isActive={pathname === link.href.split('?')[0] && new URLSearchParams(pathname.split('?')[1]).get('tf') === new URLSearchParams(link.href.split('?')[1]).get('tf')}>
                        <Link href={link.href}>
                            {link.label}
                        </Link>
                    </SidebarMenuButton>
                 </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                    <a href="https://github.com/firebase/studio-marketviz" target="_blank" rel="noopener noreferrer"><Github/></a>
                </Button>
                 <Button variant="ghost" size="icon" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer"><LifeBuoy/></a>
                </Button>
            </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:pt-4">
          <SidebarTrigger className="sm:hidden" />
          <div className="ml-auto">
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
                  <Avatar>
                    <AvatarImage src="https://picsum.photos/seed/user/40/40" alt="User Avatar" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-4 sm:px-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
