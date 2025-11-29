'use client';

import { Menu, MenuButton, MenuItem, MenuItems, MenuSeparator } from "@headlessui/react";

import { FlagDE,FlagES, FlagFR, FlagGB, FlagIT, FlagNL, FlagRO } from "../icons";


export default function LanguageSelector2() {
  return (

    <Menu>
      <MenuButton>My account</MenuButton>
      <MenuItems anchor="bottom">
        <MenuItem>
          <a className="block data-focus:bg-blue-100" href="/settings">
            Settings
          </a>
        </MenuItem>
        <MenuItem>
          <a className="block data-focus:bg-blue-100" href="/support">
            Support
          </a>
        </MenuItem>
        <MenuSeparator className="my-1 h-px bg-black" />
        <Menu>
          <MenuButton>Language</MenuButton>
          <MenuItems anchor="bottom">
              <MenuItem>
                <a className="block data-focus:bg-blue-100" href="/license">
                  <FlagDE /> Deutsch
                </a>
              </MenuItem>
              <MenuItem>
                <a className="block data-focus:bg-blue-100" href="/license">
                  <FlagNL /> Nederlands
                </a>
              </MenuItem>
          </MenuItems>
        </Menu>
      </MenuItems>
    </Menu>
  )
}