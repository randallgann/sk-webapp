import { menuItems } from "../utils/data";
import NavItem from "./NavItem";

export default function PagesNav() {
  return (
    <ul className="flex lg:flex-col items-center justify-between lg:justify-start gap-6 text-white/50 w-2/3 lg:w-auto">
      {menuItems.map((item) => {
        return <NavItem key={item.id} item={item} />;
      })}
    </ul>
  );
}
