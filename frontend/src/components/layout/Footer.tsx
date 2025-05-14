// src/components/layout/Footer.tsx

const Footer = ({ isScrollable }: { isScrollable: boolean }) => {
  return (
    <footer
      className={`w-screen ${
        !isScrollable ? 'bg-transparent' : 'bg-base-200'
      } text-white text-center py-4`}
    >
      <p>&copy; 2025 Alfie Atkinson. All rights reserved.</p>
      <p>
        Contact: <a href="mailto:contact@alfieatkinson.dev">contact@alfieatkinson.dev</a>
      </p>
    </footer>
  )
}

export default Footer
