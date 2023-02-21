import {FC} from "react"
import {Props} from "../Common/styles"
import {slide as SlideMenu} from 'react-burger-menu'
import './menu.css'

export interface NavigationLink {
    name: string,
    path: string,
}

export interface MenuProps extends Props {
    navlinks: NavigationLink[]
}

export const MainMenu:FC<MenuProps> = ({style, navlinks}) => {

  return (
    <div
      style={{
        ...style,
      }}
    >
        <SlideMenu>
          {navlinks.map(({name, path}) => (
            <a href={path} style={{
              backgroundColor: '#22272e',
              color: '#b8b7ad'
            }}> {name} </a>
          ))}
        </SlideMenu>
    </div>
  );
}