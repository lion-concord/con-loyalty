import { Providers } from "./app/providers";
import LkRouter from "./app/LkRouter";

export default function LkApp() {
  return (
    <Providers>
      <LkRouter />
    </Providers>
  );
}
