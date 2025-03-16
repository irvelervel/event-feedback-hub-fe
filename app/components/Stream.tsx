import type { Feedback } from '~/graphql/__generated__/graphql'
import SingleFeedback from './SingleFeedback'
import LiveBadge from './LiveBadge'

const Stream = ({ feedbacks }: { feedbacks: Feedback[] }) => (
  <div className="relative">
    <LiveBadge />
    <ul
      aria-label="User feed"
      role="feed"
      className="relative flex flex-col gap-12 py-12 pl-8 pr-8 before:absolute before:top-0 before:left-8 before:h-full before:-translate-x-1/2 before:border before:border-dashed before:border-slate-200 after:absolute after:top-6 after:left-8 after:bottom-6 after:-translate-x-1/2 after:border after:border-slate-200 "
    >
      {/* reverts the stream order, ofc creating a copy of the data */}
      {feedbacks
        .slice()
        .reverse()
        .map((fb) => (
          <SingleFeedback key={fb.id} fb={fb} />
        ))}
    </ul>
  </div>
)

export default Stream
