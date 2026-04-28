import AppProviders from "./app/providers";
import LkRouter from "./app/router";

export default function LkApp() {
  return (
    <AppProviders>
      <LkRouter konBalance={0} />
    </AppProviders>
  );
}
