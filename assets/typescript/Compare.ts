export class Compare {
  private readonly body: HTMLElement;
  private readonly container: HTMLElement;

	public constructor(
    private readonly document: Document,
  ) {
    const elements = this.document.getElementsByClassName('compare-block-draggable');
    this.container = this.document.getElementsByClassName('slider-compare')[0] as HTMLElement;
    this.body = this.document.getElementsByTagName('body')[0];
    const move = this.move.bind(this);
    if (elements) {
      const mousedown = (e: any) => {
        e.stopPropagation();
        this.body.addEventListener('touchmove', move, { capture: false, passive: true });
        this.body.addEventListener('mousemove', move, { capture: false, passive: true });
      };
      Array.from(elements).forEach((element) => {
        element.addEventListener('touchstart', mousedown);
        element.addEventListener('mousedown', mousedown);
      });
    }
    const mouseup = (e: any) => {
      this.body.removeEventListener('touchmove', move, { capture: false });
      this.body.removeEventListener('mousemove', move, { capture: false });
      return true;
    };
    this.body.addEventListener('touchend', mouseup);
    this.body.addEventListener('mouseup', mouseup);
  }

  private move(e: any) {
    const coordX = this.body.classList.contains('mobile-version') ? e.originalEvent.touches[0].pageX : e.pageX;
    const beforeWidth = coordX - this.container.getBoundingClientRect().left;
    if (beforeWidth > -1 && beforeWidth < this.container.offsetWidth) {
      const slide = this.container.getElementsByClassName('slider-current')[0] as HTMLElement;
      if (slide) {
        const element = slide.getElementsByClassName('compare-block-before')[0] as HTMLElement;
        const slider = slide.getElementsByClassName('compare-block-slider')[0] as HTMLElement;
        const compare = slide.getElementsByClassName('compare-block')[0] as HTMLElement;
        element.style.right = compare.offsetWidth - beforeWidth + 'px';
        slider.style.left = beforeWidth + 'px';
      }
    }
  }
}
