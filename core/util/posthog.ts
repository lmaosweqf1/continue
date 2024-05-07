import os from "os";

export class Telemetry {
  // Set to undefined whenever telemetry is disabled
  static client: any = undefined;
  static uniqueId: string = "NOT_UNIQUE";
  static os: string | undefined = undefined;
  static extensionVersion: string | undefined = undefined;

  static async capture(event: string, properties: { [key: string]: any }) {
    // Telemetry.client?.capture({
    //   distinctId: Telemetry.uniqueId,
    //   event,
    //   properties: {
    //     ...properties,
    //     os: Telemetry.os,
    //     extensionVersion: Telemetry.extensionVersion,
    //   },
    // });
    Telemetry.client?.trackBulk([{
      action_name: event,
      _id: Telemetry.uniqueId,
      cvar: JSON.stringify(
        Object.keys(properties).reduce((prev, currKey) => {
          prev[currKey] = properties[currKey];
        }, { os: Telemetry.os, extensionVersion: Telemetry.extensionVersion } as any)
      )
    }], () => {})
  }

  static shutdownPosthogClient() {
    Telemetry.client?.shutdown();
  }

  static async setup(
    allow: boolean,
    uniqueId: string,
    extensionVersion: string,
  ) {
    Telemetry.uniqueId = uniqueId;
    Telemetry.os = os.platform();
    Telemetry.extensionVersion = extensionVersion;

    try {
      if (!Telemetry.client) {
        const { MatomoTracker } = await import("matomo-tracker");
        const SITE_ID = 0;
        const client = new MatomoTracker(SITE_ID, 'http://mywebsite.com/matomo.php');
        Telemetry.client = client;
        
      }
    } catch (e) {
      console.error(`Failed to setup telemetry: ${e}`);
    }
  }
}
