import { EntityGetEndpoint } from '.';
export declare function respond(this: EntityGetEndpoint, render: (...args: unknown[]) => Promise<string>): Promise<void | {
    props: {};
}>;
