import { AP } from 'activitypub-core-types';
import React from 'react';

export function NoteEntity({ note }: { note: AP.Note }) {
  return <>
    <div className="card">
      <h1>
        {note.summary ?? 'A post'}
      </h1>
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