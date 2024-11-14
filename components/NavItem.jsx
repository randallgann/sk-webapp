import React from "react";

export default function NavItem({ item }) {
  const activeStyles =
    " text-white before:absolute before:top-0 lg:before:top-auto lg:before:left-0 before:w-6 before:h-1 lg:before:w-1 lg:before:h-6 before:bg-white before:rounded-full ";

  return (
    <li
      className={
        (item.showOnMobile === true ? " " : " hidden lg:block ") +
        (item.active === true ? activeStyles : " ")
      }
    >
      <a href="#" className="block" aria-label="To wonderful place">
        {item.child}
      </a>
    </li>
  );
}
