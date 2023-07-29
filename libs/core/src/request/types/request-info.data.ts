type Details = {
  name?: string;
  version?: string;
};

export type RequestInfoData = {
  ipAddress: string;
  ua: string;

  browser: Details;
  os: Details & { versionName?: string };
  platform: {
    type?: string;
    vendor?: string;
    model?: string;
  };
  engine: Details;
};
