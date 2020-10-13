export class ContentTabLink {
  name: string;
  url: string;
  children: ContentTabLink[];

  constructor(name: string, url: string, children?: any[]) {
    this.name = name;
    this.url = url;
    this.children = children;
  }

  get isActive(): boolean {
    if (this.children) {
      return location.pathname.indexOf(this.url) >= 0;
    }
    return location.pathname === this.url;
  }
}
