// src/components/layout/Footer.tsx

'use client'

import { usePathname } from 'next/navigation'
import {
  FaLinkedin as LinkedInIcon,
  FaGithub as GithubIcon,
  FaGlobe as WebsiteIcon,
} from 'react-icons/fa'
import { MdMail as EmailIcon } from 'react-icons/md'
import IconButton from '@/components/shared/IconButton'
import { socials } from '@/constants/social'

const Footer = () => {
  const pathname = usePathname()
  const isLandingPage = pathname === '/'

  return (
    <footer
      className={`flex flex-row items-center w-screen h-16 ${isLandingPage ? 'bg-transparent' : 'bg-base-200'} p-4`}
    >
      <p className="hidden sm:flex">&copy; 2025 Alfie Atkinson. All rights reserved.</p>
      <p className="flex sm:hidden">&copy; 2025 Alfie Atkinson.</p>
      <div className="flex-grow" />
      <div className="flex flex-row justify-end">
        <IconButton href={socials.email}>
          <EmailIcon size={24} />
        </IconButton>
        <IconButton href={socials.linkedin}>
          <LinkedInIcon size={24} />
        </IconButton>
        <IconButton href={socials.github}>
          <GithubIcon size={24} />
        </IconButton>
        <IconButton href={socials.website}>
          <WebsiteIcon size={24} />
        </IconButton>
      </div>
    </footer>
  )
}

export default Footer
