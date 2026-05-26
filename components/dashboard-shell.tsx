"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Bot,
  CalendarDays,
  ChevronRight,
  FileText,
  LayoutDashboard,
  Layers3,
  ListTodo,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Settings,
  Sparkles,
  StickyNote,
  WandSparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";

type PageKey =
  | "dashboard"
  | "ai-assistant"
  | "calendar"
  | "tasks"
  | "notes"
  | "whiteboard"
  | "spaces"
  | "template-builder"
  | "settings";

const menuGroups = [
  {
    label: "Workspace",
    items: [
      {
        label: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
        color: "text-sky-500",
      },
      {
        label: "Pages / Spaces",
        href: "/spaces",
        icon: Layers3,
        color: "text-violet-500",
      },
      { label: "Notes", href: "/notes", icon: StickyNote, color: "text-amber-500" },
    ],
  },
  {
    label: "Creation",
    items: [
      {
        label: "Whiteboard",
        href: "/whiteboard",
        icon: Palette,
        color: "text-emerald-500",
      },
      {
        label: "Task / Kanban",
        href: "/tasks",
        icon: ListTodo,
        color: "text-coral-500",
      },
      {
        label: "AI Template Builder",
        href: "/template-builder",
        icon: WandSparkles,
        color: "text-fuchsia-500",
      },
    ],
  },
  {
    label: "Planning",
    items: [
      {
        label: "Calendar",
        href: "/calendar",
        icon: CalendarDays,
        color: "text-cyan-500",
      },
      {
        label: "AI Assistant",
        href: "/ai-assistant",
        icon: Bot,
        color: "text-indigo-500",
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        label: "Settings",
        href: "/settings",
        icon: Settings,
        color: "text-slate-500",
      },
    ],
  },
];

const pages: Record<
  PageKey,
  {
    eyebrow: string;
    title: string;
    description: string;
    icon: typeof LayoutDashboard;
    iconColor: string;
    accent: string;
    panels: string[];
  }
> = {
  dashboard: {
    eyebrow: "Dashboard",
    title: "Your fresh command center",
    description:
      "Bring tasks, notes, boards, pages, and AI templates into one tidy workspace.",
    icon: LayoutDashboard,
    iconColor: "text-sky-500",
    accent: "from-sky-100 via-white to-mint-50",
    panels: ["Open tasks", "Recent notes", "Active boards", "Upcoming events"],
  },
  "ai-assistant": {
    eyebrow: "AI Assistant",
    title: "Draft, summarize, and plan faster",
    description:
      "Ask the assistant to turn rough thinking into useful next steps across your workspace.",
    icon: Bot,
    iconColor: "text-indigo-500",
    accent: "from-indigo-100 via-white to-sky-50",
    panels: ["Prompt inbox", "Meeting summary", "Action extraction", "Smart rewrite"],
  },
  calendar: {
    eyebrow: "Calendar",
    title: "A cleaner view of your week",
    description:
      "Plan focus blocks, meetings, deadlines, and personal rituals without leaving the app.",
    icon: CalendarDays,
    iconColor: "text-cyan-500",
    accent: "from-cyan-100 via-white to-emerald-50",
    panels: ["Today", "Focus blocks", "Deadlines", "Shared rituals"],
  },
  tasks: {
    eyebrow: "Task / Kanban",
    title: "Move work from idea to done",
    description:
      "Keep projects flowing with small, visual boards that connect back to pages and notes.",
    icon: ListTodo,
    iconColor: "text-coral-500",
    accent: "from-rose-100 via-white to-amber-50",
    panels: ["Backlog", "In progress", "Review", "Done"],
  },
  notes: {
    eyebrow: "Notes",
    title: "Capture ideas before they vanish",
    description:
      "A calm writing space for meeting notes, research, personal thoughts, and project logs.",
    icon: StickyNote,
    iconColor: "text-amber-500",
    accent: "from-amber-100 via-white to-mint-50",
    panels: ["Daily notes", "Research clips", "Meeting notes", "Drafts"],
  },
  whiteboard: {
    eyebrow: "Whiteboard",
    title: "Map messy ideas visually",
    description:
      "Use a flexible canvas for product maps, brainstorms, diagrams, and team workshops.",
    icon: Palette,
    iconColor: "text-emerald-500",
    accent: "from-emerald-100 via-white to-violet-50",
    panels: ["Idea cluster", "Journey map", "Decision tree", "Workshop board"],
  },
  spaces: {
    eyebrow: "Pages / Spaces",
    title: "Organize everything by space",
    description:
      "Collect related pages, boards, tasks, and templates into focused workspaces.",
    icon: Layers3,
    iconColor: "text-violet-500",
    accent: "from-violet-100 via-white to-sky-50",
    panels: ["Product", "Marketing", "Personal", "Team wiki"],
  },
  "template-builder": {
    eyebrow: "AI Template Builder",
    title: "Turn repeat work into reusable flows",
    description:
      "Design smart templates for briefs, project boards, rituals, and note structures.",
    icon: WandSparkles,
    iconColor: "text-fuchsia-500",
    accent: "from-fuchsia-100 via-white to-rose-50",
    panels: ["Brief template", "Sprint ritual", "Research flow", "Prompt library"],
  },
  settings: {
    eyebrow: "Settings",
    title: "Tune the workspace to your rhythm",
    description:
      "Manage workspace preferences, collaboration defaults, theme choices, and account details.",
    icon: Settings,
    iconColor: "text-slate-500",
    accent: "from-slate-100 via-white to-mint-50",
    panels: ["Profile", "Workspace", "Theme", "Notifications"],
  },
};

const stats = [
  ["Open tasks", "24", "6 due today", ListTodo, "text-rose-500", "bg-rose-50"],
  ["Notes", "128", "12 this week", StickyNote, "text-amber-500", "bg-amber-50"],
  ["Boards", "7", "3 shared", Palette, "text-emerald-500", "bg-emerald-50"],
  ["Events", "9", "next: sync", CalendarDays, "text-sky-500", "bg-sky-50"],
] as const;

const kanbanColumns = [
  ["Today", "bg-coral-400", ["Shape dashboard shell", "Review AI presets"]],
  ["In progress", "bg-sky-400", ["Map whiteboard toolbar", "Draft team space"]],
  ["Done", "bg-emerald-400", ["Collect inspiration", "Set workspace colors"]],
] as const;

export function DashboardShell({ page = "dashboard" }: { page?: PageKey }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const current = pages[page];
  const CurrentIcon = current.icon;

  return (
    <main className="min-h-screen bg-[#f2fbf6] text-slate-900">
      <div className="flex min-h-screen">
        <aside
          className={cn(
            "sticky top-0 flex h-screen shrink-0 flex-col border-r border-slate-200/80 bg-white/88 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur transition-[width] duration-300 ease-out",
            collapsed ? "w-[76px]" : "w-[248px]",
          )}
          aria-label="Primary navigation"
        >
          <div
            className={cn(
              "flex items-center border-b border-slate-100",
              collapsed ? "h-20 flex-col justify-center gap-1.5 px-2" : "h-15 gap-2.5 px-3",
            )}
          >
            <div
              className={cn(
                "grid shrink-0 place-items-center rounded-lg bg-gradient-to-br from-emerald-400 via-sky-400 to-violet-400 text-white shadow-sm",
                collapsed ? "h-8 w-8" : "h-9 w-9",
              )}
            >
              <Sparkles className="h-4.5 w-4.5" aria-hidden="true" />
            </div>

            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-950">Flowbase</p>
                <p className="truncate text-[0.7rem] text-slate-500">Think, plan, create</p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setCollapsed((value) => !value)}
              className={cn(
                "grid shrink-0 place-items-center rounded-md border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900",
                collapsed ? "h-7 w-7" : "h-8 w-8",
              )}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
              ) : (
                <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>

          <nav className="flex-1 space-y-3 overflow-y-auto px-2.5 py-3">
            {menuGroups.map((group) => (
              <div key={group.label}>
                {!collapsed && (
                  <p className="mb-1 px-2 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-slate-400">
                    {group.label}
                  </p>
                )}

                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        title={item.label}
                        aria-label={item.label}
                        className={cn(
                          "group flex h-8 items-center rounded-md text-[0.82rem] font-medium transition",
                          collapsed ? "justify-center px-0" : "gap-2 px-2",
                          isActive
                            ? "bg-slate-950 text-white shadow-sm"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0",
                            isActive ? "text-sky-300" : item.color,
                          )}
                          aria-hidden="true"
                        />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="border-t border-slate-100 p-2.5">
            <div
              className={cn(
                "flex items-center rounded-lg bg-gradient-to-br from-mint-50 to-sky-50 ring-1 ring-slate-200/70",
                collapsed ? "justify-center p-2" : "gap-2.5 p-2.5",
              )}
            >
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-white text-emerald-500 shadow-sm">
                <FileText className="h-4 w-4" aria-hidden="true" />
              </div>

              {!collapsed && (
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-slate-800">
                    Studio workspace
                  </p>
                  <p className="truncate text-[0.68rem] text-slate-500">
                    Synced 2 minutes ago
                  </p>
                </div>
              )}
            </div>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="flex flex-col gap-4 border-b border-slate-200/80 bg-white/65 px-5 py-4 backdrop-blur lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-600">
                {current.eyebrow}
              </p>
              <h1 className="mt-1 text-2xl font-semibold text-slate-950">
                {current.title}
              </h1>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
                {current.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <Search className="h-4 w-4 text-sky-500" aria-hidden="true" />
                Search
              </button>
              <button
                type="button"
                className="inline-flex h-9 items-center gap-2 rounded-md bg-slate-950 px-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
              >
                <Plus className="h-4 w-4 text-mint-300" aria-hidden="true" />
                New space
              </button>
            </div>
          </header>

          <div className="space-y-6 px-5 py-6 lg:px-8">
            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map(([label, value, detail, Icon, color, bg]) => (
                <article
                  key={label}
                  className="rounded-lg border border-slate-200/80 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-slate-500">{label}</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
                    </div>
                    <div className={cn("grid h-9 w-9 place-items-center rounded-md", bg)}>
                      <Icon className={cn("h-4 w-4", color)} aria-hidden="true" />
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-slate-500">{detail}</p>
                </article>
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <article className="rounded-lg border border-slate-200/80 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-950">
                      {current.eyebrow} workspace
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      A practical preview for this area of the product.
                    </p>
                  </div>
                  <CurrentIcon className={cn("h-5 w-5", current.iconColor)} />
                </div>

                <div className={cn("mt-4 rounded-lg bg-gradient-to-br p-4 ring-1 ring-slate-200/70", current.accent)}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {current.panels.map((panel) => (
                      <div
                        key={panel}
                        className="rounded-md border border-white/80 bg-white/85 p-3 text-sm font-semibold text-slate-700 shadow-sm"
                      >
                        {panel}
                        <p className="mt-2 text-xs font-normal leading-5 text-slate-500">
                          Fresh, focused, and ready for real product data.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </article>

              <article className="rounded-lg border border-slate-200/80 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-950">
                      Task / Kanban
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      A small view of work moving through your day.
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-300" aria-hidden="true" />
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-3 xl:grid-cols-1">
                  {kanbanColumns.map(([title, accent, tasks]) => (
                    <div
                      key={title}
                      className="rounded-lg border border-slate-200 bg-slate-50/80 p-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className={cn("h-2 w-2 rounded-full", accent)} />
                        <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                          {title}
                        </h3>
                      </div>
                      <div className="mt-3 space-y-2">
                        {tasks.map((task) => (
                          <div
                            key={task}
                            className="rounded-md border border-slate-200 bg-white p-2.5 text-sm font-medium text-slate-700 shadow-sm"
                          >
                            {task}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
