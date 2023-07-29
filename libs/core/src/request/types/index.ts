interface Details {
  name?: string;
  version?: string;
}

interface OSDetails extends Details {
  versionName?: string;
}

interface PlatformDetails {
  type?: string;
  vendor?: string;
  model?: string;
}

export type RequestMetadata = {
  ipAddress: string;
  ua: string;

  browser: Details;
  os: OSDetails;
  platform: PlatformDetails;
  engine: Details;
};
