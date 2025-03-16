import { Form } from 'react-router'
import type { Event } from '~/graphql/__generated__/graphql'

interface FeedbackFormProps {
  events: Event[]
  selectedEvent: string
}

const FeedbackForm = ({ events, selectedEvent }: FeedbackFormProps) => (
  <Form id="feedback-form" method="post" autoComplete="off">
    <div className="space-y-12">
      <div>
        <h2 className="text-base/7 font-semibold text-gray-900">
          Add a feedback
        </h2>
        <p className="mt-1 text-sm/6 text-gray-600">
          Join the stream in the Hub!
        </p>

        <div className="mt-5 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-6">
          <div className="col-span-full">
            <label
              htmlFor="event_id"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Event
            </label>
            <div className="mt-2 grid grid-cols-1">
              <select
                id="event_id"
                name="event_id"
                className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              >
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

          <div className="sm:col-span-6">
            <div className="mt-2">
              <input
                type="text"
                name="event_filter"
                id="event_filter"
                value={selectedEvent}
                readOnly
                className="hidden block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="firstname"
              className="block text-sm/6 font-medium text-gray-900"
            >
              First name
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="firstname"
                id="firstname"
                required
                autoComplete="given-name"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="lastname"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Last name
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="lastname"
                id="lastname"
                required
                autoComplete="family-name"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>
          <div className="col-span-full">
            <label
              htmlFor="country"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Rating
            </label>
            <div className="flex flex-row-reverse justify-end items-center">
              <input
                id="rating-5"
                type="radio"
                className="peer star-spacing size-8 bg-transparent border-0 text-transparent cursor-pointer appearance-none checked:bg-none focus:bg-none focus:ring-0 focus:ring-offset-0"
                name="rating"
                value="5"
              />
              <label
                htmlFor="rating-5"
                className="peer-checked:text-yellow-500 text-gray-300 pointer-events-none"
              >
                <svg
                  className="shrink-0 size-8"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                </svg>
              </label>
              <input
                id="rating-4"
                type="radio"
                className="peer star-spacing size-8 bg-transparent border-0 text-transparent cursor-pointer appearance-none checked:bg-none focus:bg-none focus:ring-0 focus:ring-offset-0"
                name="rating"
                value="4"
              />
              <label
                htmlFor="rating-4"
                className="peer-checked:text-yellow-500 text-gray-300 pointer-events-none"
              >
                <svg
                  className="shrink-0 size-8"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                </svg>
              </label>
              <input
                id="rating-3"
                type="radio"
                className="peer star-spacing size-8 bg-transparent border-0 text-transparent cursor-pointer appearance-none checked:bg-none focus:bg-none focus:ring-0 focus:ring-offset-0"
                name="rating"
                value="3"
                defaultChecked
              />
              <label
                htmlFor="rating-3"
                className="peer-checked:text-yellow-500 text-gray-300 pointer-events-none"
              >
                <svg
                  className="shrink-0 size-8"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                </svg>
              </label>
              <input
                id="rating-2"
                type="radio"
                className="peer star-spacing size-8 bg-transparent border-0 text-transparent cursor-pointer appearance-none checked:bg-none focus:bg-none focus:ring-0 focus:ring-offset-0"
                name="rating"
                value="2"
              />
              <label
                htmlFor="rating-2"
                className="peer-checked:text-yellow-500 text-gray-300 pointer-events-none"
              >
                <svg
                  className="shrink-0 size-8"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                </svg>
              </label>
              <input
                id="rating-1"
                type="radio"
                className="peer star-spacing size-8 bg-transparent border-0 text-transparent cursor-pointer appearance-none checked:bg-none focus:bg-none focus:ring-0 focus:ring-offset-0"
                name="rating"
                value="1"
              />
              <label
                htmlFor="rating-1"
                className="peer-checked:text-yellow-500 text-gray-300 pointer-events-none"
              >
                <svg
                  className="shrink-0 size-8"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                </svg>
              </label>
            </div>
          </div>
          <div className="col-span-full">
            <label
              htmlFor="content"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Comment
            </label>
            <div className="mt-2">
              <textarea
                name="content"
                id="content"
                required
                rows={3}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              ></textarea>
            </div>
            <p className="mt-3 text-sm/6 text-gray-600">
              You'll be live in no time!
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="mt-6 flex items-center gap-x-6">
      <button
        type="submit"
        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Send
      </button>
    </div>
  </Form>
)

export default FeedbackForm
