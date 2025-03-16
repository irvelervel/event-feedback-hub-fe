import type { Dispatch, SetStateAction } from 'react'
import type { Event } from '~/graphql/__generated__/graphql'

interface FilterProps {
  events: Event[]
  selectedEvent: string
  setSelectedEvent: Dispatch<SetStateAction<string>>
}

const Filters = ({ events, selectedEvent, setSelectedEvent }: FilterProps) => (
  <form>
    <div className="space-y-12">
      <div className="border-b border-gray-900/10 pb-6">
        <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 mb-10">
          <div className="sm:col-span-3">
            <label
              htmlFor="event"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Filter by Event
            </label>
            <div className="mt-2 grid grid-cols-1">
              <select
                id="event"
                name="event"
                autoComplete="event-name"
                className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                onChange={(e) => setSelectedEvent(e.target.value)}
                value={selectedEvent}
              >
                <option value="">All</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.name}
                  </option>
                ))}
              </select>
              <svg
                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                viewBox="0 0 16 16"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  fillRule="evenodd"
                  d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
)

export default Filters
