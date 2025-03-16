const LiveBadge = () => (
  <button
    type="button"
    disabled
    className="m-1 ms-0 relative py-1.5 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs focus:outline-hidden focus:bg-gray-50 absolute -translate-x-1/2 -translate-y-1/2 top-0 left-1/2"
  >
    Live Stream
    <span className="flex absolute top-0 end-0 -mt-2 -me-2">
      <span className="animate-ping absolute inline-flex size-full rounded-full bg-green-400 opacity-75 dark:bg-green-600"></span>
      <span className="relative inline-flex text-xs bg-green-500 text-white rounded-full py-2 px-2"></span>
    </span>
  </button>
)

export default LiveBadge
