import { defaultFetcher, type Fetcher, type Request, setCookiesArrayToRequest } from "@literate.ink/utilities";
import { decodeSessionInformation } from "~/decoders/session-information";
import { encodeAccountKindToPath } from "~/encoders/account-kind";
import { BusyPageError, PageUnavailableError, SuspendedIPError, type AccountKind, type SessionInformation } from "~/models";

const VERSION_FROM_HTML_REGEX = />PRONOTE (?<version>\d+\.\d+\.\d+)/;

export const sessionInformation = async (options: {
  base: string
  kind: AccountKind,
  params: Record<string, any>,
  cookies: string[]
}, fetcher: Fetcher = defaultFetcher) => {
  const url = new URL(options.base + "/" + encodeAccountKindToPath(options.kind));
  for (const [key, value] of Object.entries(options.params)) {
    url.searchParams.set(key, value);
  }

  const request: Request = { url, redirect: "manual" };
  setCookiesArrayToRequest(request, options.cookies);

  const { content: html } = await fetcher(request);
  const version = html.match(VERSION_FROM_HTML_REGEX)?.groups?.version?.split(".").map(Number);
  if (!version) throw new PageUnavailableError();

  try {
    // Remove all spaces and line breaks.
    const body_cleaned = html.replace(/ /ug, "").replace(/\n/ug, "");

    // Find the relaxed JSON of the session.
    const from = "Start(";
    const to = ")}catch";

    const relaxed_data = body_cleaned.substring(
      body_cleaned.indexOf(from) + from.length,
      body_cleaned.indexOf(to)
    );

    // Convert the relaxed JSON to something we can parse.
    const session_data_string = relaxed_data
      .replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/gu, "\"$2\": ")
      .replace(/'/gu, "\"");

    return {
      information: decodeSessionInformation(JSON.parse(session_data_string), options.base, version),
      version
    };
  }
  catch (error) {
    if (html.includes("Votre adresse IP est provisoirement suspendue")) {
      throw new SuspendedIPError();
    }
    else if (html.includes("Le site n'est pas disponible")) {
      throw new PageUnavailableError();
    }
    else if (html.includes("Le site est momentanément indisponible")) {
      throw new BusyPageError();
    }

    throw new PageUnavailableError();
  }
};
