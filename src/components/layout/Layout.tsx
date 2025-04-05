
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';
import { useCart } from '@/contexts/CartContext';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent
} from '@/components/ui/sidebar';
import { Home, ShoppingBag, Search, User, SquareStack, ShieldCheck, Heart, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { isCartOpen, closeCart } = useCart();
  const { user, isAdmin } = useAuth();
  
  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const menuItems = [
    { title: 'Home', icon: Home, url: '/' },
    { title: 'Products', icon: ShoppingBag, url: '/products' },
    { title: 'Favorites', icon: Heart, url: '/favorites' },
    { title: 'Support', icon: HelpCircle, url: '/support' },
  ];

  const accountItems = [
    { title: 'My Account', icon: User, url: '/profile' },
    { title: 'My Orders', icon: SquareStack, url: '/orders' },
  ];

  // Add admin items if user is admin
  const adminItems = isAdmin ? [
    { title: 'Admin Dashboard', icon: ShieldCheck, url: '/admin' },
  ] : [];

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex flex-col min-h-screen w-full">
        <Header />
        <div className="flex flex-1">
          <Sidebar variant="inset" collapsible="offcanvas">
            <SidebarHeader className="py-6">
              <div className="flex items-center justify-center">
                <span className="text-2xl font-bold">Izzy</span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {menuItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          tooltip={item.title}
                          isActive={location.pathname === item.url}
                        >
                          <a href={item.url} className="flex items-center gap-3">
                            <item.icon className="h-5 w-5" />
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              
              {user && (
                <SidebarGroup className="mt-6">
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {accountItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton 
                            asChild 
                            tooltip={item.title}
                            isActive={location.pathname === item.url}
                          >
                            <a href={item.url} className="flex items-center gap-3">
                              <item.icon className="h-5 w-5" />
                              <span>{item.title}</span>
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                      
                      {adminItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton 
                            asChild 
                            tooltip={item.title}
                            isActive={location.pathname === item.url}
                          >
                            <a href={item.url} className="flex items-center gap-3">
                              <item.icon className="h-5 w-5" />
                              <span>{item.title}</span>
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              )}
            </SidebarContent>
            <SidebarFooter className="p-4">
              {user ? (
                <div className="text-sm text-muted-foreground">
                  Logged in as {user.email}
                </div>
              ) : (
                <Button asChild variant="outline" className="w-full">
                  <a href="/login">Sign In</a>
                </Button>
              )}
            </SidebarFooter>
          </Sidebar>
          
          <main className="flex-grow pt-20">
            {children}
          </main>
        </div>
        <Footer />
        <CartDrawer open={isCartOpen} onClose={closeCart} />
      </div>
    </SidebarProvider>
  );
};

export default Layout;
