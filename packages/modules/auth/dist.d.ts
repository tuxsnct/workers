declare module "cookie" {
    import { CookieSerializeOptions } from 'cookie';
    import { ServerResponse } from 'worktop/response';
    export type Cookie = {
        name: string;
        value: string;
    };
    export type CookieToken = {
        token: string;
    };
    export const setCookie: (response: ServerResponse, cookie: Cookie, serializeOptions?: CookieSerializeOptions | undefined) => void;
    export const checkCookieTokenExistence: (cookie: string) => boolean;
    export { parse as parseCookie } from 'cookie';
}
declare module "user" {
    export type Credential = {
        email: string;
        password?: string;
    };
    export type User = Credential & {
        admin: boolean;
        name: string;
        id: string;
    };
}
declare module "validate" {
    export const validateAuthHeader: (auth: string) => boolean;
}
declare module "jwt" {
    import { User } from "user";
    export type JwtPayload = Omit<User, 'password'> & {
        exp?: number;
    };
    export const getRefreshedJwt: (jwtPayload: JwtPayload) => JwtPayload;
    export const getAuthHeaderToken: (auth: string) => string | null;
    export const getJwtPayload: (auth: string) => Promise<JwtPayload | null>;
    export const getJwtTokens: (jwtPayload: JwtPayload) => Promise<{
        cookieToken: string;
        csrfToken: string;
    } | null>;
}
declare module "index" {
    export * from "cookie";
    export * from "jwt";
    export * from "user";
    export * from "validate";
}
