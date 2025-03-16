import type { Feedback } from '~/graphql/__generated__/graphql'
import { formatDistance } from 'date-fns'
import Star from './Star'

const SingleFeedback = ({ fb }: { fb: Feedback }) => {
  const timeString = formatDistance(new Date(), new Date(fb.timestamp * 1000))

  return (
    <li key={fb.id} role="article" className="relative pl-8 ">
      <div className="flex flex-col flex-1 gap-2">
        <div className="absolute z-10 inline-flex items-center justify-center w-8 h-8 text-white rounded-full -left-4 ring-2 ring-white">
          <img
            src={`https://i.pravatar.cc/48?img=${fb.id}`}
            alt="user name"
            title="user name"
            width="48"
            height="48"
            className="max-w-full rounded-full"
          />
        </div>
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
            {timeString === 'less than a minute'
              ? 'just now'
              : timeString + ' ago'}
          </span>
        </h4>
        <div className="flex">
          <div className="flex items-center me-3">
            {Array(fb.rating)
              .fill('')
              .map((_, i) => (
                <Star key={i} filled />
              ))}
            {Array(5 - fb.rating)
              .fill('')
              .map((_, i) => (
                <Star key={i} />
              ))}
          </div>
          <p className="text-slate-500 italic">"{fb.content}"</p>
        </div>
      </div>
    </li>
  )
}

export default SingleFeedback
