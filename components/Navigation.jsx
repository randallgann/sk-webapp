import PagesNav from "./PagesNav";
import SettingsNav from "./SettingsNav";
import { GIRL_3_IMAGE } from "../utils/images";

export default function Navigation() {
  return (
    <nav className="relative flex lg:flex-col items-center justify-between p-3 lg:p-6 lg:py-12 bg-nav lg:order-first h-full lg:h-screen">
      <a
        className="w-8 h-8 text-white hidden lg:block"
        href="#"
        aria-label="To homepage"
      >
        <img
          width="42"
          height="42"
          className="w-full h-full object-cover object-center"
          src="logo.png"
          alt="Logo"
        />
      </a>
      <div className="flex grow lg:justify-between lg:flex-col lg:my-12 lg:px-3 lg:pb-12 lg:border-b-2 lg:border-white lg:border-opacity-10">
        <PagesNav />
        <SettingsNav />
      </div>
      <a
        className="w-10 h-10 rounded-lg overflow-hidden text-white hidden lg:block"
        href="#"
        aria-label="To user profile"
      >
        <img
          width="32"
          height="32"
          className="w-full h-full object-cover object-center"
          src={GIRL_3_IMAGE}
          alt="User"
        />
      </a>
    </nav>
  );
}
