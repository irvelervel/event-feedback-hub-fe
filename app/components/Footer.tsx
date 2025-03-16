const Footer = () => (
  <footer className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="py-6 border-t border-gray-200 dark:border-neutral-700">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div>
          <p className="text-xs text-gray-600 dark:text-neutral-400">
            © {new Date().getFullYear()} Stefano Casasola
          </p>
        </div>
        <ul className="flex flex-wrap items-center">
          <li className="inline-block relative pe-4 text-xs last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-1.5 before:-translate-y-1/2 before:size-[3px] before:rounded-full before:bg-gray-400 dark:text-neutral-500 dark:before:bg-neutral-600">
            <a
              className="text-xs text-gray-500 underline hover:text-gray-800 hover:decoration-2 focus:outline-hidden focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400"
              href="https://www.linkedin.com/in/stefanocasasola/"
            >
              Linkedin
            </a>
          </li>
          <li className="inline-block pe-4 text-xs">
            <a
              className="text-xs text-gray-500 underline hover:text-gray-800 hover:decoration-2 focus:outline-hidden focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400"
              href="https://github.com/irvelervel"
            >
              Github
            </a>
          </li>
          <li className="inline-block relative pe-4 text-xs last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-1.5 before:-translate-y-1/2 before:size-[3px] before:rounded-full before:bg-gray-400 dark:text-neutral-500 dark:before:bg-neutral-600">
            <a
              className="text-xs text-gray-500 underline hover:text-gray-800 hover:decoration-2 focus:outline-hidden focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400"
              href="mailto:ste.casasola@gmail.com"
            >
              Contact
            </a>
          </li>
        </ul>
      </div>
    </div>
  </footer>
)

export default Footer
