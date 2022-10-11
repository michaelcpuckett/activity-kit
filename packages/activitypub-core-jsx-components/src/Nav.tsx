import React, { ReactElement } from 'react';
import { AP } from 'activitypub-core-types';

function BoxLink({ collection, children }: { collection?: URL | AP.EitherCollection, children: string | ReactElement }) {
  if (!collection) {
    return <></>
  };

  return collection instanceof URL ? (
    <li>
      <a href={collection.toString()}>
        {children}
      </a>
    </li>
  ) : collection.id instanceof URL ? (
    <li>
      <a href={collection.id.toString()}>
        {children}
      </a>
    </li>
  ) : <>Test</>;
}

export function Nav({ actor }: { actor: AP.Actor }) {
  return (
    <nav>
      <ul>
        {actor.url instanceof URL ? (
          <li>
            <a href={actor.url.toString()}>
              You
            </a>
          </li>
        ) : null}
        <BoxLink collection={actor.inbox}>
          Inbox
        </BoxLink>
        <BoxLink collection={actor.outbox}>
          Outbox
        </BoxLink>
        <BoxLink collection={actor.following}>
          Following
        </BoxLink>
        <BoxLink collection={actor.followers}>
          Followers
        </BoxLink>
        <BoxLink collection={actor.liked}>
          Liked
        </BoxLink>
        {actor.streams ? actor.streams.map(stream => (typeof stream !== 'string' && 'id' in stream && stream.id && 'name' in stream && stream.name && !Array.isArray(stream.name)) ?
          <BoxLink collection={stream.id}>
            {stream.name}
          </BoxLink> : <></>) : <></>}
      </ul>
    </nav>
  );
};