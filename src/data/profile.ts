import type { BrandIcon } from "@/lib/brand-icons";

export const profile = {
  name: "Kawã Crispim de Oliveira",
  username: "kblankk",
  avatar: `${import.meta.env.BASE_URL}avatar.jpg`,
  roles: [
    "Desenvolvedor",
    "Analista de E-commerce",
    "Estudante de Computação",
    "Sempre aprendendo algo novo",
  ],
  location: "Brasil",
  timeZone: "America/Sao_Paulo",
  education: "Ciências da Computação",
  email: "kawabrein@gmail.com",
  discord: "_kblank",
  siteUrl: "https://kblankk.github.io/links/",
} as const;

type Icon = { kind: "brand"; name: BrandIcon } | { kind: "lucide"; name: "globe" | "mail" };

type Base = {
  id: string;
  title: string;
  subtitle: string;
  icon: Icon;
  /** Glow/spotlight tint. */
  brand: string;
  /** Icon tile background on hover (colour or gradient). */
  tile: string;
};

export type LinkItem =
  | (Base & { type: "link"; href: string })
  | (Base & { type: "mail"; href: string; copy: string; copiedLabel: string })
  | (Base & { type: "copy"; copy: string; copiedLabel: string });

export const links: LinkItem[] = [
  {
    id: "github",
    type: "link",
    title: "GitHub",
    subtitle: "@kblankk",
    href: "https://github.com/kblankk",
    icon: { kind: "brand", name: "github" },
    brand: "#9ba7b8",
    tile: "linear-gradient(135deg, #3d4653 0%, #161b22 100%)",
  },
  {
    id: "linkedin",
    type: "link",
    title: "LinkedIn",
    subtitle: "Kawã Oliveira",
    href: "https://www.linkedin.com/in/kaw%C3%A3-oliveira-80303a368/",
    icon: { kind: "brand", name: "linkedin" },
    brand: "#0a66c2",
    tile: "linear-gradient(135deg, #1d8cf0 0%, #0a66c2 100%)",
  },
  {
    id: "instagram",
    type: "link",
    title: "Instagram",
    subtitle: "@olvkawa",
    href: "https://www.instagram.com/olvkawa/",
    icon: { kind: "brand", name: "instagram" },
    brand: "#e1306c",
    tile: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%)",
  },
  {
    id: "portfolio",
    type: "link",
    title: "Portfólio",
    subtitle: "kblankk.github.io",
    href: "https://kblankk.github.io/",
    icon: { kind: "lucide", name: "globe" },
    brand: "#0096ff",
    tile: "linear-gradient(135deg, #00d4ff 0%, #0096ff 100%)",
  },
  {
    id: "email",
    type: "mail",
    title: "E-mail",
    subtitle: profile.email,
    href: `mailto:${profile.email}`,
    copy: profile.email,
    copiedLabel: "E-mail copiado",
    icon: { kind: "lucide", name: "mail" },
    brand: "#ea4335",
    tile: "linear-gradient(135deg, #ff6b5b 0%, #d93025 100%)",
  },
  {
    id: "discord",
    type: "copy",
    title: "Discord",
    subtitle: profile.discord,
    copy: profile.discord,
    copiedLabel: "Usuário do Discord copiado",
    icon: { kind: "brand", name: "discord" },
    brand: "#5865f2",
    tile: "linear-gradient(135deg, #7983f5 0%, #4752c4 100%)",
  },
];

export const stack: { label: string; icon: BrandIcon }[] = [
  { label: "Python", icon: "python" },
  { label: "TypeScript", icon: "typescript" },
  { label: "C#", icon: "csharp" },
  { label: ".NET", icon: "dotnet" },
  { label: "React", icon: "react" },
  { label: "Next.js", icon: "nextdotjs" },
  { label: "Tailwind", icon: "tailwindcss" },
  { label: "Node.js", icon: "nodedotjs" },
  { label: "Flask", icon: "flask" },
  { label: "Docker", icon: "docker" },
  { label: "Git", icon: "git" },
  { label: "GitHub Actions", icon: "githubactions" },
];
