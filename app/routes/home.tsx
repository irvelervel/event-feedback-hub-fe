import type { Route } from './+types/home'
import createApolloClient from '../utils/apollo-client'
import {
  ADD_FEEDBACK,
  GET_EVENT_FEEDBACKS,
  GET_ALL_EVENTS,
  FEEDBACK_SUBSCRIPTION,
} from '~/graphql/queries'
import type { Event, Feedback } from '../graphql/__generated__/graphql'
import { useEffect, useState } from 'react'
import { useQuery, useSubscription } from '@apollo/client/react/hooks'
import { Form } from 'react-router'
import Navbar from '~/components/Navbar'
import Footer from '~/components/Footer'
import Hero from '~/components/Hero'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Feedback Hub Application' },
    {
      name: 'description',
      content: 'This is an app written with the React Router V7 Framework',
    },
  ]
}

const client = createApolloClient()

export async function loader({ serverLoader, params }: Route.ClientLoaderArgs) {
  console.log('SSR LOADER')

  const [eventsData, feedbacksData] = await Promise.all([
    client.query({
      query: GET_ALL_EVENTS,
      fetchPolicy: 'no-cache',
    }),
    client.query({
      query: GET_EVENT_FEEDBACKS,
      fetchPolicy: 'no-cache',
      variables: {
        id: '',
      },
    }),
  ])

  const {
    data: { events },
  } = eventsData
  const {
    data: { feedbacksForEvent },
  } = feedbacksData

  // console.log('FEEDBACKS LENGTH', feedbacksForEvent.length)
  // console.log('DATA', events, feedbacksForEvent)
  return { events, feedbacksForEvent }
}

export async function clientLoader({
  serverLoader,
  params,
}: Route.ClientLoaderArgs) {
  console.log('CLIENT LOADER')

  const [eventsData, feedbacksData] = await Promise.all([
    client.query({
      query: GET_ALL_EVENTS,
      // caching here is available
    }),
    client.query({
      query: GET_EVENT_FEEDBACKS,
      // caching here is available
      variables: {
        // retrieves the event id saved by the action
        id: sessionStorage.getItem('event_filter') || '',
      },
    }),
  ])

  const {
    data: { events },
  } = eventsData
  const {
    data: { feedbacksForEvent },
  } = feedbacksData

  return { events, feedbacksForEvent }
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  let formData = await request.formData()
  const values = Object.fromEntries(formData) as Record<string, any>
  // console.log('VALUES', values)
  values.author = `${values.firstname} ${values.lastname}`
  values.rating = parseInt(values.rating as string)
  delete values.firstname
  delete values.lastname
  // SPIEGA
  sessionStorage.setItem('event_filter', values.event_filter)
  // console.log('SETTO SESSIONSTORAGE', values.event_filter)
  delete values.event_filter

  const client = createApolloClient()
  await client.mutate({
    mutation: ADD_FEEDBACK,
    variables: {
      feedback: values,
    },
  })
  // hack
  const form = document.getElementById('feedback-form') as HTMLFormElement
  form.reset()
  return
}

export default function Home({ loaderData }: Route.ComponentProps) {
  // no need for a useState here, events will be loaded at launch (loader) and updated at every feedback submission (clientLoader)
  const events: Event[] = loaderData.events

  // saving in the component's state the event filter value
  const [selectedEvent, setSelectedEvent] = useState('')
  // feedbacks have to be stored locally to handle the filtering but most importantly the subscription
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(
    loaderData.feedbacksForEvent
  )

  // preparing an Apollo useQuery hook to grab updated feedbacks on UI interactions and subscription triggers
  const { data, refetch } = useQuery(GET_EVENT_FEEDBACKS, {
    variables: { id: selectedEvent },
  })

  // preparing an Apollo useSubscription hook to be able to receive new feedback events from Apollo Server on the BE
  const newData = useSubscription<{ feedbackPosted: Feedback }>(
    FEEDBACK_SUBSCRIPTION
  )

  // this useEffects puts the feedbacks from the loader functions (at initial load or after a submission) in the local state.
  // I'd loved to avoid having to rely on a local state for storing feedbacks (and following an approach like the events one)
  // but since they change on filtering and even from the outside (subscription) I cannot just follow the traditional action/loader
  // pattern of RR.
  useEffect(() => {
    console.log('ARRIVATI FBS DA LOADER', loaderData.feedbacksForEvent)
    setFeedbacks(loaderData.feedbacksForEvent)
  }, [loaderData.feedbacksForEvent])

  // since we have just one route, changing the event filter doesn't change the URL. Therefore, I'm relying on a local useEffect to
  // grab fresh feedbacks on event filter change
  useEffect(() => {
    // console.log('cambiato filtro evento')
    refetch()
  }, [selectedEvent])

  // whenever fresh data comes from a filter change or a subscription trigger, use this data as the new array of feedbacks
  useEffect(() => {
    // console.log('cambiato data', data)
    if (data && data.feedbacksForEvent) {
      setFeedbacks(data.feedbacksForEvent)
    }
  }, [data])

  useEffect(() => {
    if (
      newData.data &&
      newData.data.feedbackPosted
      // prevents unnecessary traffic, refetches just if the new feedback belongs to the selected filter
      // && newData.data.feedbackPosted.event.id === selectedEvent
    ) {
      console.log('FETCHO')
      refetch()
    }
  }, [newData])

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-100">
        <Navbar />
      </header>
      <Hero />
      <hr className="text-gray-300" />
      <div className="flex flex-col md:flex-row flex-grow">
        <main className="flex-grow p-4 order-2 md:order-1">
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
          <div className="relative">
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
            <ul
              aria-label="User feed"
              role="feed"
              className="relative flex flex-col gap-12 py-12 pl-8 before:absolute before:top-0 before:left-8 before:h-full before:-translate-x-1/2 before:border before:border-dashed before:border-slate-200 after:absolute after:top-6 after:left-8 after:bottom-6 after:-translate-x-1/2 after:border after:border-slate-200 "
            >
              {feedbacks
                .slice()
                .reverse()
                .map((fb) => (
                  <li key={fb.id} role="article" className="relative pl-8 ">
                    <div className="flex flex-col flex-1 gap-4">
                      <a
                        href="#"
                        className="absolute z-10 inline-flex items-center justify-center w-8 h-8 text-white rounded-full -left-4 ring-2 ring-white"
                      >
                        <img
                          src={`https://i.pravatar.cc/48?img=${fb.id}`}
                          alt="user name"
                          title="user name"
                          width="48"
                          height="48"
                          className="max-w-full rounded-full"
                        />
                      </a>
                      <h4 className="flex flex-col items-start text-lg font-medium leading-8 text-slate-700 md:flex-row lg:items-center">
                        <span className="flex-1">
                          {fb.author}
                          <span className="text-base font-normal text-slate-500">
                            {' '}
                            added a feedback on{' '}
                            <span className="font-bold">{fb.event.name}</span>
                          </span>
                        </span>
                        <span className="text-sm font-normal text-slate-400">
                          {' '}
                          3 hours ago
                        </span>
                      </h4>
                      <div className="flex">
                        <div className="flex items-center me-3">
                          {Array(fb.rating)
                            .fill('')
                            .map((_, i) => (
                              <button
                                type="button"
                                key={i}
                                className="size-5 inline-flex justify-center items-center text-2xl rounded-full text-yellow-400 disabled:opacity-50 disabled:pointer-events-none dark:text-yellow-500"
                              >
                                <svg
                                  className="shrink-0 size-5"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                                </svg>
                              </button>
                            ))}
                          {Array(5 - fb.rating)
                            .fill('')
                            .map((_, i) => (
                              <button
                                type="button"
                                key={i}
                                className="size-5 inline-flex justify-center items-center text-2xl rounded-full text-gray-300 disabled:opacity-50 disabled:pointer-events-none"
                              >
                                <svg
                                  className="shrink-0 size-5"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                                </svg>
                              </button>
                            ))}
                        </div>
                        <p className=" text-slate-500">{fb.content}</p>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </main>
        <aside className="w-full md:w-128 p-4 bg-gray-200 order-1 md:order-2 md:sticky md:top-[64px] md:h-[44vh]">
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
                Save
              </button>
            </div>
          </Form>
        </aside>
      </div>
      <Footer />
    </div>
  )
}
