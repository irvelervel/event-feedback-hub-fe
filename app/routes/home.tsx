import type { Route } from './+types/home'
import createApolloClient from '../utils/apollo-client'
import {
  ADD_FEEDBACK,
  GET_EVENT_FEEDBACKS,
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
import performQueries from '~/utils/data-fetching'

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
  // initial load, when the page firstly loads. Here I fetch (on the server) all the events and all the feedbacks, to create the first view.
  // when both queries are resolved, I return data to the client.

  const { events, feedbacksForEvent } = await performQueries(
    client, // Apollo Client instance
    false, // these initial queries have to be performed fully
    {
      id: '', // empty string as id so all feedbacks will be retrieved
    }
  )

  return { events, feedbacksForEvent }
}

export async function clientLoader({
  serverLoader,
  params,
}: Route.ClientLoaderArgs) {
  // the clientLoader function gets triggered after the completion of clientAction

  const { events, feedbacksForEvent } = await performQueries(
    client, // Apollo Client instance
    true, // caching here is allowed
    {
      // retrieves the event id saved by the action
      id: sessionStorage.getItem('event_filter') || '',
    }
  )

  return { events, feedbacksForEvent }
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  // the clientAction function gets triggered when the FeedbackForm component gets submitted (a new feedback is sent to the mutation)
  // let's retrieve the form data from the request, and shape the right object for the mutation
  let formData = await request.formData()
  const values = Object.fromEntries(formData) as Record<string, any>

  values.author = `${values.firstname} ${values.lastname}`
  values.rating = parseInt(values.rating as string)
  delete values.firstname
  delete values.lastname

  // since the clientLoader function will be automatically triggered after this action (for data refetching)
  // I need to store somewhere the current event_filter value, so the fresh feedbacks retrieval can be
  // light, fast and relevant to what the user is currently seeing
  // I could use the address bar, but since we currently have a single route in the app I will use sessionStorage
  // (so it will vanish after tab closing and it's accessible to clientLoader since it runs on the client)
  sessionStorage.setItem('event_filter', values.event_filter)
  // this event_filter value came from a hidden input field in the FeedbackForm, after setting it in sessionStorage
  // I delete it since I don't want it to be part of the variable I'll pass to the mutation
  delete values.event_filter

  const mutationResult = await client.mutate({
    mutation: ADD_FEEDBACK,
    variables: {
      feedback: values,
    },
  })

  // checking if the mutation performed ok
  if (
    mutationResult &&
    mutationResult.data &&
    mutationResult.data.addFeedback
  ) {
    // in order to reset the form after correct submission, I'm selecting it from the DOM
    const form = document.getElementById('feedback-form') as HTMLFormElement
    form.reset()
  }

  return
  // data will now be validated again by an automatic execution of the clientLoader function
}

export default function Home({ loaderData }: Route.ComponentProps) {
  // no need for a useState here, events will be loaded at launch (loader) and updated at every feedback submission (clientLoader)
  const events: Event[] = loaderData.events

  // saving in the component's state the event filter value
  const [selectedEvent, setSelectedEvent] = useState('')
  const [ratingFilter, setRatingFilter] = useState(1)
  // feedbacks have to be stored locally to handle the filtering but most importantly the subscription
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(
    loaderData.feedbacksForEvent
  )

  // preparing an Apollo useQuery hook to grab updated feedbacks on UI interactions and subscription triggers
  // we're refetching just the dataset the user is currently seeing
  const { data, refetch } = useQuery(GET_EVENT_FEEDBACKS, {
    variables: { rating: ratingFilter, id: selectedEvent },
  })

  // preparing an Apollo useSubscription hook to be able to receive new feedback events from Apollo Server on the BE
  const subscribed = useSubscription<{ feedbackPosted: Feedback }>(
    FEEDBACK_SUBSCRIPTION
  )

  // this useEffects puts the feedbacks from the loader functions (at initial load or after a submission) in the local state.
  // I'd loved to avoid having to rely on a local state for storing feedbacks (and following an approach like the events one)
  // but since they change on filtering and even from the outside (subscription) I cannot just follow the traditional action/loader
  // pattern of RR.
  useEffect(() => {
    // loader or clientLoader fetched fresh data
    setFeedbacks(loaderData.feedbacksForEvent)
  }, [loaderData.feedbacksForEvent])

  // since we have just one route, changing the event filter doesn't change the URL. Therefore, I'm relying on a local useEffect to
  // grab fresh feedbacks on event filter change
  useEffect(() => {
    // event filter change
    refetch()
  }, [selectedEvent, ratingFilter])

  // if Apollo Server stores a new feedback, a notification hits the Client. We're listening to these notifications in the data
  // useSubscription returns
  useEffect(() => {
    // subscription notification received!
    if (
      subscribed.data &&
      subscribed.data.feedbackPosted &&
      // prevents unnecessary traffic, refetches feedbacks just if the new feedback belongs to the selected filter or if there isn't
      // any filter selected
      (subscribed.data.feedbackPosted.event.id === selectedEvent ||
        selectedEvent === '')
    ) {
      refetch()
    }
  }, [subscribed])

  // whenever fresh data comes from the refetch function, set it as the new feedbacks
  useEffect(() => {
    // refetch function has been executed and fresh data arrived
    if (data && data.feedbacksForEvent) {
      setFeedbacks(data.feedbacksForEvent)
    }
  }, [data])

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
            ratingFilter={ratingFilter}
            setRatingFilter={setRatingFilter}
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
