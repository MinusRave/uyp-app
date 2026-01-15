interface NavigationItem {
  name: string;
  href: string;
}

export default function Footer({
  footerNavigation,
}: {
  footerNavigation: {
    app: NavigationItem[];
    company: NavigationItem[];
  };
}) {
  return (
    <div className="bg-secondary/10">
      <footer
        aria-labelledby="footer-heading"
        className="mx-auto max-w-7xl px-6 py-12 lg:px-8"
      >
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>

        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between gap-8 pb-8 border-b border-border">
          {/* Brand */}
          <div className="max-w-sm">
            <h3 className="text-lg font-bold text-foreground mb-2">
              UnderstandYourPartner
            </h3>
            <p className="text-sm text-muted-foreground">
              Scientific relationship insights to help you break the pattern and build deeper connection.
            </p>
          </div>

          {/* Navigation Columns */}
          <div className="flex gap-16">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">
                App
              </h3>
              <ul role="list" className="space-y-3">
                {footerNavigation.app.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Company
              </h3>
              <ul role="list" className="space-y-3">
                {footerNavigation.company.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} UnderstandYourPartner. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="/privacy" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-foreground transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
