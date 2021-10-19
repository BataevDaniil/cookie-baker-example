import {GetServerSidePropsContext} from "next";
import React from "react";

import { CookieController, RealTimeCookie } from "@cookie-baker/core";
import { Cookie as CookieClient, isBrowser, createRealTimeCookie } from "@cookie-baker/browser";
import { createUseCookie, useCookie as useCookieType } from "@cookie-baker/react";
import { Cookie as CookieServer } from "@cookie-baker/node";

type CookieModel = {
    ga?: string
    adc?: string
}
let cookie: CookieController<CookieModel>
let realTimeCookie: RealTimeCookie<CookieModel>
let useCookie: useCookieType<CookieModel>

const createCookie = (_cookie: typeof cookie) => {
    cookie = _cookie
    realTimeCookie = createRealTimeCookie(_cookie)
    useCookie = createUseCookie(_cookie, realTimeCookie)
}
if (isBrowser()) {
    createCookie(new CookieClient<CookieModel>())
}

const Component = () => {
    const ga = useCookie(({ ga }) => ga)
    React.useEffect(() => {
        console.log("update ga", ga)
    }, [ga])

    const cookieData = useCookie()
    React.useEffect(() => {
        cookie.set("ga", "ga-browser-value")
        console.log(cookie.get())
        console.log("update cookie", cookieData)
    }, [cookieData])
    return null
}

export const getServerSideProps = ({ req, res }: GetServerSidePropsContext) => {
    createCookie(new CookieServer<CookieModel>({ req, res }))
    cookie.set("ga", "ga-server-value")
    cookie.set("adc", "adc-value", { httpOnly: true })
    console.log(cookie.get())
    return {props: {}}
}

export default Component
