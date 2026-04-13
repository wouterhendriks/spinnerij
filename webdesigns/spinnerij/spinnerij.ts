import { SiteRequest, SiteResponse, SiteResponseSettings } from "@webhare/router";

export async function spinnerijDesign(request: SiteRequest, settings: SiteResponseSettings) {
  return new SiteResponse({}, request, settings);
}
