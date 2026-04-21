/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_BUTTONDOWN_USERNAME?: string;
  readonly PUBLIC_CF_ANALYTICS_TOKEN?: string;
  readonly PUBLIC_IS_PRODUCTION?: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
