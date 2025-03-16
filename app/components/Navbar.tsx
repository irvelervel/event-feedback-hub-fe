const Navbar = () => (
  <nav className="bg-white border-gray-200 dark:bg-gray-900">
    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
        <img src="logo.png" className="h-8" alt="Feedback Hug Logo" />
        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
          Feedback Hub
        </span>
      </a>
      <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
        <button
          type="button"
          className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
          id="user-menu-button"
          aria-expanded="false"
          data-dropdown-toggle="user-dropdown"
          data-dropdown-placement="bottom"
        >
          <img
            className="w-8 h-8 rounded-full"
            src="https://i.pravatar.cc/48?img=8"
            alt="user photo"
          />
        </button>
      </div>
    </div>
  </nav>
)
export default Navbar
