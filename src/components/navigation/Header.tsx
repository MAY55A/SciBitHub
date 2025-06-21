import { ThemeSwitcher } from '../custom/theme-switcher'
import HeaderAuth from './header-auth'
import { Nav } from './nav'
import Logo from '../custom/logo'

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
      </div>
    </header>
  )
}

export default Header
