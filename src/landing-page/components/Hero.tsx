import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { Button } from "../../client/components/ui/button";
import heroImage from "../../client/static/hero-couple-silence.png";

export default function Hero() {
  return (
    <div className="relative w-full overflow-hidden bg-slate-50 pt-16 pb-20 lg:pb-32 lg:pt-32 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2 lg:items-center">
          <div className="max-w-xl lg:max-w-lg">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Why do we keep having the same fight over and over?
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              It's not what you're saying—it's how you're both hearing it differently.
              <br />
              Take the test to see what's really happening.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Button size="lg" className="font-bold text-lg px-8 py-6 rounded-xl shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] transition-all hover:scale-105" asChild>
                <WaspRouterLink to={routes.TestRoute.to}>
                  See What's Really Happening <span aria-hidden="true" className="ml-2">→</span>
                </WaspRouterLink>
              </Button>
            </div>
            <div className="mt-6 flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1"><span className="text-green-500">✔</span> Takes 10 min</span>
              <span className="flex items-center gap-1"><span className="text-green-500">✔</span> No Sign Up Required</span>
            </div>
          </div>
          <div className="relative">
            <img
              src={heroImage}
              alt="Couple sitting apart in exhausted silence, representing unspoken relationship distance"
              width={1000}
              height={1000}
              loading="lazy"
              className="relative rounded-xl shadow-2xl ring-1 ring-slate-900/10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function TopGradient() {
  return (
    <div
      className="absolute right-0 top-0 -z-10 w-full transform-gpu overflow-hidden blur-3xl sm:top-0"
      aria-hidden="true"
    >
      <div
        className="aspect-[1020/880] w-[70rem] flex-none bg-gradient-to-tr from-amber-400 to-purple-300 opacity-10 sm:right-1/4 sm:translate-x-1/2 dark:hidden"
        style={{
          clipPath:
            "polygon(80% 20%, 90% 55%, 50% 100%, 70% 30%, 20% 50%, 50% 0)",
        }}
      />
    </div>
  );
}

function BottomGradient() {
  return (
    <div
      className="absolute inset-x-0 top-[calc(100%-40rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-65rem)]"
      aria-hidden="true"
    >
      <div
        className="relative aspect-[1020/880] w-[90rem] bg-gradient-to-br from-amber-400 to-purple-300 opacity-10 sm:-left-3/4 sm:translate-x-1/4 dark:hidden"
        style={{
          clipPath: "ellipse(80% 30% at 80% 50%)",
        }}
      />
    </div>
  );
}
