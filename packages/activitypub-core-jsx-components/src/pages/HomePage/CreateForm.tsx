import { AP } from 'activitypub-core-types';
import React from 'react';

export function CreateForm({ actor, headingLevel }: { actor: AP.Actor; headingLevel: number; }) {
  return <>
    <span role="heading" aria-level={headingLevel}>
      Create
    </span>
    <form
      id="createForm"
      action={actor.outbox instanceof URL ? actor.outbox.toString() : actor.outbox?.id?.toString()}
      noValidate>
      <label>
        <span>
          Type
        </span>
        <select name="type" defaultValue={'Note'}>
          {Object.values(AP.ExtendedObjectTypes).map(type =>
            <option key={type}>{type}</option>
          )}
        </select>
      </label>
      <label>
        <span>Summary</span>
        <textarea name="summary"></textarea>
      </label>
      <label>
        <span>Content</span>
        <textarea required name="content"></textarea>
      </label>
      <label>
        <span>Location</span>
        <input type="text" name="location" />
      </label>
      <fieldset name="to">
        <label>
          <span>
            Public
          </span>
        </label>
        <label>
          <span>
            Followers
          </span>
          <input defaultChecked={true} type="checkbox" name="to" value={actor.followers ? actor.followers instanceof URL ? actor.followers.toString() : actor.followers.id?.toString() ?? '' : ''} />
        </label>
        {actor.followers && !(actor.followers instanceof URL) && Array.isArray(actor.followers?.items) ? actor.followers.items.map((follower) => {
          return (
            <label key={follower instanceof URL ? follower.toString() : follower.id?.toString() ?? ''}>
              <span>
                @{follower instanceof URL ? follower.toString() : 'preferredUsername' in follower ? follower.preferredUsername : follower.id?.toString()}
              </span>
              <input type="checkbox" name="to" value={follower instanceof URL ? follower.toString() : follower.id?.toString() ?? ''} />
            </label>
          )
        })
          : null}
      </fieldset>
      <button type="submit">
        Submit
      </button>
    </form>
    <script src="createForm.js"></script>
  </>;
};
