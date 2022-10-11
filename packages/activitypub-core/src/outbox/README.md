`Actor` object's `outbox`
   [x] Accepts Activity Objects (`outbox:accepts-activities`) *MUST*
	  [x] Accepts non-Activity Objects, and converts to Create Activities per
       7.1.1 (`outbox:accepts-non-activity-objects`) *MUST*
   [x] Removes the `bto` and `bcc` properties from Objects before storage
     (`outbox:removes-bto-and-bcc`) *MUST*
   [x] Ignores `id` on submitted objects, and generates a new id instead
     (`outbox:ignores-id`) *MUST*
   [x] Responds with status code 201 Created (`outbox:responds-201-created`)
     *MUST*
   [x] Response includes Location header whose value is id of new object,
     unless the Activity is transient (outbox:location-header)
   [ ] Accepts Uploaded Media in submissions (outbox:upload-media) MUST
   [ ] Server does not trust client submitted content
     (outbox:not-trust-submitted) SHOULD
   [ ] Validate the content they receive to avoid content spoofing attacks
      (outbox:validate-content) SHOULD
 Update
   [x] Server takes care to be sure that the Update is authorized to modify
     its object before modifying the server’s stored copy
     (outbox:update:check-authorized) MUST
   [ ] Supports partial updates in client-to-server protocol
     (but not server-to-server) (outbox:update:partial) NON-NORMATIVE
Add
   [x] Adds object to the target Collection, unless not allowed due to
   requirements in 7.5 (outbox:add:adds-object-to-target) SHOULD
Remove
   [x] Remove object from the target Collection, unless not allowed due to
     requirements in 7.5 (outbox:remove:removes-from-target) SHOULD
Like
   [x] Adds the object to the actor’s Liked Collection
     (outbox:like:adds-object-to-liked) SHOULD
Block
   [ ] Prevent the blocked object from interacting with any object posted by the
     actor (outbox:block:prevent-interaction-with-actor) SHOULD
Undo
  [x] Supports the Undo activity in the client-to-server protocol (outbox:undo)
    NON-NORMATIVE
  [x] Ensures that the actor in the activity actor is the same in activity being
    undone (outbox:undo:ensures-activity-and-actor-are-same) MUST