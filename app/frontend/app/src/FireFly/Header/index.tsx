import {FC} from 'react';
import {Props, gridstyle, elementStyle} from '../Common/styles';
import {MainMenu, NavigationLink} from './Menu';

const area = {
    menu: 'menu',
    title: 'title',
    logo: 'logo',
}

const headerStyle:React.CSSProperties = {
    ...gridstyle,
    position: 'relative',
    height: '100%',
    borderBottom: '2.5px solid black',
    gridTemplate: `
    " ${area.menu} ${area.title} ${area.logo}" auto
    / 0.10fr       1fr           0.10fr`
}

export const Header: FC<Props> = ({style}) => {
    const navLinks:NavigationLink[] = [
        {name: 'Home', path: 'http://localhost:3000/'},
        {name: 'About', path: 'http://localhost:3000/about'}
    ]
    return (
        <div style={{
            ...headerStyle,
            ...style
        }}>
            <MainMenu style={{gridArea:area.menu}} navlinks={navLinks}></MainMenu>
            <h1 style={{
                ...elementStyle,
                gridArea: area.title}}
            >
                FireFly
            </h1>
            <div
                style={{
                    ...elementStyle
                }}
            >
                <img style={{
                    width: '60%',
                    height: '75%',
                    gridArea:area.logo
                    }} src={'firefly-logo.jpg'} alt=''/>
            </div>
        </div>
    )
}