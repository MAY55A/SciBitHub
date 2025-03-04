import { ThemeSwitcher } from '../theme-switcher'
import Link from '../custom/Link'
import HeaderAuth from './header-auth'
import { Nav } from './nav'
import siteMetadata from '@/src/data/siteMetadata'

const Header = () => {
  return (
    <header className="flex flex-wrap items-center w-full bg-white dark:bg-gray-950 sm:justify-between justify-center py-10 px-8 sticky top-0 z-50 gap-5"
    >
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="h-6 text-2xl font-semibold sm:block">
          {siteMetadata.headerTitle}
        </div>
      </Link>
      <Nav />

      <div className="flex items-center space-x-4 leading-5 sm:-mr-6 sm:space-x-6">
        <HeaderAuth />
        <ThemeSwitcher />
      </div>
    </header>
  )
}

export default Header
