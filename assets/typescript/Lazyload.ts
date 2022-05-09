type LazyloadOptions = {
  src: string;
  srcset: string;
  selector: string;
  root: null;
  rootMargin: string;
  threshold: number;
};

export class Lazyload {
  private settings: LazyloadOptions = {
    src: "data-src",
    srcset: "data-srcset",
    selector: ".lazy",
    root: null,
    rootMargin: "0px",
    threshold: 0
  };

  private images: NodeListOf<HTMLImageElement>;
  private observer: IntersectionObserver | null;

	public constructor(
    document: Document,
    options: Partial<LazyloadOptions> = {},
  ) {
    this.settings = this.extend(this.settings, options) as LazyloadOptions;
    this.images = document.querySelectorAll(this.settings.selector);
    this.observer = null;
    this.init();
  }

  private init() {
    /* Without observers load everything and bail out early. */
    if (!window.IntersectionObserver) {
      this.loadImages();
      return;
    }

    let self = this;
    let observerConfig = {
      root: this.settings.root,
      rootMargin: this.settings.rootMargin,
      threshold: [this.settings.threshold]
    };

    this.observer = new IntersectionObserver(function(entries) {
      Array.prototype.forEach.call(entries, function (entry) {
        if (entry.isIntersecting && self.observer) {
          self.observer.unobserve(entry.target);
          let src = entry.target.getAttribute(self.settings.src);
          let srcset = entry.target.getAttribute(self.settings.srcset);
          if ("img" === entry.target.tagName.toLowerCase()) {
            if (src) entry.target.src = src;
            if (srcset) entry.target.srcset = srcset;
          } else {
            entry.target.style.backgroundImage = "url(" + src + ")";
          }
        }
      });
    }, observerConfig);

    Array.prototype.forEach.call(this.images, function (image) {
      if (self.observer) self.observer.observe(image);
    });
}


  public loadImages () {
    if (!this.settings) { return; }

    let self = this;
    Array.prototype.forEach.call(this.images, function (image) {
      let src = image.getAttribute(self.settings.src);
      let srcset = image.getAttribute(self.settings.srcset);
      if ("img" === image.tagName.toLowerCase()) {
        if (src) image.src = src;
        if (srcset) image.srcset = srcset;
      } else {
        image.style.backgroundImage = "url('" + src + "')";
      }
    });
  }

  public loadAndDestroy() {
    if (!this.settings) { return; }
    this.loadImages();
    this.destroy();
  }
  public destroy () {
    if (!this.settings) { return; }
    if (this.observer) this.observer.disconnect();
  }


 /**
  * Merge two or more objects. Returns a new object.
  * @private
  * @param {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
  * @param {Object}   objects  The objects to merge together
  * @returns {Object}          Merged values of defaults and options
  */
  public extend(first: boolean | Record<string, any>, ...args: Record<string, any>[])  {
    const self = this;
    let extended: Record<string, any> = {};
    let deep = false;
    let i = 0;
    let length = args.length + 1;
    let data = args;

    /* Check if a deep merge */
    if (typeof first === 'boolean') {
      deep = first;
    } else {
      data = [first].concat(args);
    }

    /* Merge the object into the extended object */
    let merge = function (obj: Record<string, any>) {
      for (let prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
          /* If deep merge and property is an object, merge properties */
          if (deep && Object.prototype.toString.call(obj[prop]) === "[object Object]") {
            extended[prop] = self.extend(true, extended[prop], obj[prop]);
          } else {
            extended[prop] = obj[prop];
          }
        }
      }
    };

    /* Loop through each object and conduct a merge */
    for (; i < length; i++) {
      let obj = data[i];
      merge(obj);
    }

    return extended;
  };
}



