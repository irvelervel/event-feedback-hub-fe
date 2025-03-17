# Feedback Hub - Frontend

This application is designed to allow users to share their feedback on several events and to show a real-time feed of contributions.

## Features

- Built using the `react-router` Framework
- `GraphQL` queries via `@apollo/client`
- Filters for events and ratings
- Live Stream of feedbacks with `GraphQL` subscriptions (open it on several devices to test it out!)
- `tailwind` Styling

## Operation

The application operates on a single route on which a component called Home is mounted.

Home initially performs a server-side retrieval through GraphQL of all the events and the feedbacks available (leveraging the `loader` system in `react-router`), preparing the initial view for a fast first load in the browser.

Another server-side query is performed after every new feedback submission, leveraging the `action` and the automatic data validation of `react-router`.

Other UI operations, like setting filters, fetch corresponding results on-demand using the `useQuery` hook of `@apollo/query`.

Lastly, the `useSubscription` hook keeps a websocket connection alive to the backend in order to listen for new feedbacks from other clients connected; when a notification is received, feedbacks are fetched again accordingly to the selected filters.

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Environment Variables

You need a couple of env vars to get this started:

```bash
VITE_BE_HTTP_URL
VITE_BE_WS_URL
```

They can point to the same URL with different protocols: `http` for the former and `ws` for the latter.
A `.env.example` file can be found in the repository.

### Development

Start the development server with HMR:

```bash
npm run dev
```

The project will be available at `http://localhost:5173`.
