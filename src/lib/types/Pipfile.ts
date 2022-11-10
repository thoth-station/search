export type PipfileRequirementsLocked = {
  default: {
    [key: string]: {
      version: string;
      markers?: string;
      hashes: string[];
      index: string;
    };
  };
  _meta: {
    sources: {
      name: string;
      url: string;
      verify_ssl: boolean;
    }[];
    requires: {
      python_version: string;
    };
  };
};

export type PipfileRequirements = {
  "dev-packages": { [key: string]: string };
  packages: { [key: string]: string };
  requires: {
    python_version: string;
  };
  source: {
    name: string;
    url: string;
    verify_ssl: boolean;
  }[];
};
