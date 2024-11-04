import { ThemeSwitcher } from "./ThemeSwitcher";

export function ThemeControls() {
  return (
    <div className="fixed z-50 top-4 right-4">
      <ThemeSwitcher />
    </div>
  );
}
