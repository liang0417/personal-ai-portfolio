import { NavLink } from "react-router";
import { navigation } from "~/data/site";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="返回首页">
        <span className="brand-mark">A</span>
        <span>YOUR.NAME</span>
      </a>
      <nav className="desktop-nav" aria-label="主要导航">
        {navigation.map((item) => (
          <NavLink key={item.href} to={item.href} end={item.href === "/"}>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="header-actions">
        <button className="command-trigger" type="button" data-command-open>
          <span>搜索</span>
          <kbd>⌘ K</kbd>
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
