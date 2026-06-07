'use client';
import React, { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from "@heroui/react";
import { NavbarLogoBrand, ThemeToggle, NavbarUserMenu } from "atlas-shared-web/components";
import { useAuth } from "atlas-shared-web";

export default function AppNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const navItems = [
    { href: "/scheme", label: "Scheme" },
    { href: "/calculation", label: "Calculation" },
    { href: "/report", label: "Report" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return router.pathname === "/";
    }
    return router.pathname.startsWith(href);
  };

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} maxWidth="full" isBordered={true} shouldHideOnScroll={true} classNames={{ wrapper: "px-4" }}>
      <NavbarContent>
        {user && (
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
        )}
        <NavbarBrand>
          <NavbarLogoBrand />
        </NavbarBrand>
      </NavbarContent>

      {(user || true) && (
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {navItems.map((item) => (
            <NavbarItem key={item.href} isActive={isActive(item.href)}>
              <Button
                variant="light"
                className={`p-0 px-2 min-w-fit bg-transparent data-[hover=true]:bg-transparent data-[hover=true]:text-primary text-base transition-colors ${isActive(item.href) ? "text-primary font-semibold" : ""}`}
                onPress={() => router.push(item.href)}
              >
                {item.label}
              </Button>
            </NavbarItem>
          ))}
        </NavbarContent>
      )}

      <NavbarContent justify="end" className="gap-2">
        <NavbarItem>
          <ThemeToggle />
        </NavbarItem>
        <NavbarItem>
          <NavbarUserMenu user={user} />
        </NavbarItem>
      </NavbarContent>

      {(user || true) && (
        <NavbarMenu>
          {navItems.map((item) => (
            <NavbarMenuItem key={item.href} isActive={isActive(item.href)}>
              <Link
                as={NextLink}
                color={isActive(item.href) ? "primary" : "foreground"}
                className={`w-full ${isActive(item.href) ? "font-semibold" : ""}`}
                href={item.href}
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      )}
    </Navbar>
  );
}
