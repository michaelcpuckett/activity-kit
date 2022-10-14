import { AP } from 'activitypub-core-types';
import { getId } from 'activitypub-core-utilities';
import React from 'react';

export function Sidebar({ actor }: { actor?: AP.Actor }) {
  return (
    <nav>
      <ul>
        <li>
          <a href={'/home'}>
            New Post
          </a>
        </li>
        {actor ? (
          <>
            <li>
              <a href={getId(actor.inbox)?.toString()}>
                Inbox
              </a>
            </li>
            <li>
              <a href={getId(actor.outbox)?.toString()}>
                Outbox
              </a>
            </li>
            <li>
              <a href={getId(actor.following)?.toString() ?? '#'}>
                Following
              </a>
            </li>
            <li>
              <a href={getId(actor.followers)?.toString() ?? '#'}>
                Followers
              </a>
            </li>
            <li>
              <a href={getId(actor.liked)?.toString() ?? '#'}>
                Liked
              </a>
            </li>
            {Array.isArray(actor.streams) ? actor.streams.map(stream => {
              if (stream instanceof URL) {
                return <></>;
              }

              return (
                <li key={getId(stream).toString()}>
                  <a href={getId(stream).toString() ?? '#'}>
                    {stream.name}
                  </a>
                </li>
              )
            }) : null}
          </>
        ) : null}
      </ul>
    </nav>
  )
}