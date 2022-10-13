import { AP } from 'activitypub-core-types';
import React from 'react';

export function NoteEntity({ note, headingLevel }: { note: AP.Note; headingLevel: number; }) {
  return <>
    <div className="card">
      <span role="heading" aria-level={headingLevel}>
        {note.summary ?? 'A post'}
      </span>
      <blockquote>
        {note.content}
      </blockquote>
      <dl>
        <>
          <dt>By</dt>
          <dd>
            {note.attributedTo && !(note.attributedTo instanceof URL) && !Array.isArray(note.attributedTo) ? note.attributedTo.name : null}
          </dd>

          <dt>Published</dt>
          <dd>
            {note.published ? note.published.toDateString() : ''}
          </dd>

          <dt>
            Updated
          </dt>
          <dd>
            {note.updated ? note.updated.toDateString() : ''}
          </dd>

          <dt>Location</dt>
          <dd>
            <>{note.location ? JSON.stringify(note.location) : ''}</>
          </dd>
          {/* Like & Share if logged in */}
        </>
      </dl>
    </div>
  </>
}