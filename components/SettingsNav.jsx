import { settingMenuItems } from "../utils/data";
import NavItem from "./NavItem";

export default function SettingsNav() {
  return (
    <ul className="flex lg:flex-col items-center justify-end gap-6 text-white/50 w-1/3 lg:w-auto">
      {settingMenuItems.map((item) => {
        return <NavItem key={item.id} item={item} />;
      })}
    </ul>
  );
}
