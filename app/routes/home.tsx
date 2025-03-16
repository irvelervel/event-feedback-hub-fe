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
import Navbar from '~/components/Navbar'
import Footer from '~/components/Footer'
import Hero from '~/components/Hero'
import Stream from '~/components/Stream'
import FeedbackForm from '~/components/FeedbackForm'
import Filters from '~/components/Filters'

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
          <Filters
            events={events}
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
          />
          <Stream feedbacks={feedbacks} />
        </main>
        <aside className="w-full md:w-128 p-4 bg-gray-200 order-1 md:order-2 md:sticky md:top-[64px] md:h-[590px]">
          <FeedbackForm events={events} selectedEvent={selectedEvent} />
        </aside>
      </div>
      <Footer />
    </div>
  )
}
