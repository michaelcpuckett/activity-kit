import { IncomingMessage } from 'http';
import { AP } from '../../types';
import { DatabaseService } from '../../DatabaseService';
import { ServiceAccount } from 'firebase-admin';
import type { ServerResponse } from 'http';
export declare const getServerSideProps: ({ req, res, }: {
    req: IncomingMessage;
    res: ServerResponse;
}, serviceAccount: ServiceAccount, setup?: (props: {
    actor: AP.Actor;
}, databaseService: DatabaseService) => Promise<{
    actor: AP.Actor;
}>, providedDatabaseService?: DatabaseService) => Promise<{
    redirect: {
        permanent: boolean;
        destination: string;
    };
    props?: undefined;
} | {
    props: {
        actor: import("../../types/activitypub/Core/Link").BaseLink | AP.Article | AP.Event | AP.Note | AP.Page | AP.Place | AP.Relationship | AP.Tombstone | AP.Profile | AP.Document | AP.Application | AP.Service | AP.Group | AP.Organization | AP.Person | AP.Accept | AP.Follow | AP.Delete | AP.Create | AP.Arrive | AP.Add | AP.Offer | AP.Like | AP.Leave | AP.Ignore | AP.Join | AP.Reject | AP.View | AP.Update | AP.Undo | AP.Remove | AP.Read | AP.Listen | AP.Move | AP.Travel | AP.Announce | AP.Flag | AP.Dislike | AP.Question | AP.Collection | AP.OrderedCollection | AP.CollectionPage | AP.OrderedCollectionPage | import("../../types/activitypub/Core").Mention;
    };
    redirect?: undefined;
}>;
