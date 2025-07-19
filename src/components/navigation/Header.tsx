import { ThemeSwitcher } from '../custom/theme-switcher'
import HeaderAuth from './header-auth'
import { Nav } from './nav'
import Logo from '../custom/logo'
import { Github } from 'lucide-react'

const Header = () => {
  return (
    <header className="relative flex flex-wrap items-center w-full bg-background/90 sm:justify-between justify-center py-10 px-8 sticky top-0 z-50 gap-5"
    >
      <span className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-green to-primary"></span>
      <Logo />
      <Nav />
      <div className="flex items-center space-x-4 leading-5 sm:-mr-6 sm:space-x-6">
        <HeaderAuth />
        <ThemeSwitcher />
        <a href="https://github.com/MAY55A/SciBitHub" target="_blank" rel="noreferrer" className='border p-2 rounded-full text-muted-foreground hover:bg-muted' title='GitHub Repository'><Github className="w-4 h-4" /></a>
      </div>
    </header>
  )
}

export default Header
