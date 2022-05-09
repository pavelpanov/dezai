type Config = {
	duration: number;
	autoplay: boolean;
	delay: number;
	arrows: boolean;
	dots: boolean;
};

export class Slider {
	private readonly document: Document;
	private readonly container: HTMLElement;
	private readonly linked: Slider | undefined;
	private track: HTMLElement | undefined;
	private dots: HTMLElement | undefined;
	private currentIndex: number;
	private total: number;
	private timer: ReturnType<typeof setTimeout> | undefined;
	private fastTimer: ReturnType<typeof setTimeout> | undefined;
	private readonly config: Config = {
		duration: 500,
		autoplay: true,
		delay: 5000,
		arrows: true,
		dots: false,
	};

	public constructor(
		document: Document,
		element: HTMLElement,
		config?: Partial<Config>,
		linked?: Slider,
	) {
		this.document = document;
		this.linked = linked;
		this.config = { ...this.config, ...config };
		this.currentIndex = 1;
		this.total = element.children.length;
		this.container = element;
		this.init();
		if (this.config.autoplay) this.start();
	}
	private makeButton(isNext: boolean = false) {
		const button = this.document.createElement('button');
		button.setAttribute('type', 'button');
		button.setAttribute('role', 'button');
		button.dataset.role = 'none';
		button.classList.add('slider-arrow');
		button.classList.add(`slider-${isNext ? 'next' : 'prev'}`);
		button.innerHTML = isNext ? 'Next' : 'Prev';
		button.onclick = this[isNext ? 'manualToNext' : 'manualToPrev'].bind(this);
		return button;
	}
	private makeDots(isNext: boolean = false) {
		this.dots = this.document.createElement('ul');
		this.dots.classList.add('slider-dots')
		this.dots.setAttribute('role', 'tablist');
		let i = 0;
		for (i = 0; i < this.total; i++) {
			const li = this.document.createElement('li');
			if (i === (this.currentIndex - 1)) li.classList.add('slider-active');
			li.setAttribute('role', 'presentation');
			const button = this.document.createElement('button');
			button.setAttribute('type', 'button');
			button.setAttribute('role', 'button');
			button.dataset.role = 'none';
			button.innerHTML = (i + 1).toString();
			button.onclick = this.manualToIndex.bind(this, i + 1);
			li.appendChild(button);
			this.dots.appendChild(li);
		}
		return this.dots;
	}
	private init() {
		const element = this.container;
		element.classList.add('slider-box');
		const content = element.children as unknown as NodeListOf<HTMLDivElement | HTMLLIElement>;
		let width = 0;
		Array.from(content).forEach((c, index) => {
			if (c.classList) c.classList.add('slider-slide')
			if (index === 0) c.classList.add('slider-current')
			if (c.offsetWidth) {
				width += c.offsetWidth;
				c.style.width = c.offsetWidth + 'px';
			}
		});
		const contentStore = [...content];
		const makeClone = (index: number) => {
			const data = Array.from(contentStore)[index];
			const clone = data.cloneNode(true) as HTMLElement;
			clone.classList.add('slider-cloned');
			width += parseInt(data.style.width, 10);
			return clone;
		}
		const wrapper = this.document.createElement('div');
		this.track = this.document.createElement('div');
		this.track.append(makeClone(contentStore.length - 1));
		this.track.append(...content);
		this.track.append(makeClone(0));
		wrapper.classList.add('slider-list');
		this.track.classList.add('slider-track');
		this.track.style.width = width + 'px';
		wrapper.appendChild(this.track);
		element.innerHTML = '';
		if (this.config.arrows) element.appendChild(this.makeButton(false))
		element.appendChild(wrapper);
		if (this.config.arrows) element.appendChild(this.makeButton(true))
		if (this.config.dots) element.appendChild(this.makeDots());
		this.scrollToIndex(this.currentIndex, true);
		element.classList.add('slider-initialized');
		if ('style' in element) element.style.opacity = '1';
	}
	private stop() {
		if (this.timer) clearTimeout(this.timer);
	}
	private start() {
		this.stop();
		this.timer = setTimeout(() => {
			this.scrollToNext();
			this.start();
		}, this.config.delay);
	}
	private manualToNext() {
		if (this.linked) this.linked.scrollToIndex(this.currentIndex + 1);
		this.scrollToNext();
	}
	private manualToPrev() {
		if (this.linked) this.linked.scrollToIndex(this.currentIndex - 1);
		this.scrollToPrev();
	}
	private manualToIndex(index: number) {
		if (this.linked) this.linked.scrollToIndex(index);
		this.scrollToIndex(index);
	}
	private scrollToNext() {
		this.scrollToIndex(this.currentIndex + 1);
	}
	private scrollToPrev() {
		this.scrollToIndex(this.currentIndex - 1);
	}
	private scrollToIndex(index: number, fast: boolean = false) {
		this.stop();
		const currentIndex = this.currentIndex;
		if (this.fastTimer) clearTimeout(this.fastTimer);
		if (!this.track) return;
		this.track.style.transition = fast ? 'none' : `transform ${this.config.duration}ms ease-out`;
		const current = this.track.children[currentIndex];
		const next = this.track.children[index] as HTMLElement;
		if (current) current.classList.remove('slider-current');
		if (next) next.classList.add('slider-current');
		const offset = next.offsetLeft * -1;
		this.track.style.transform = 'translate3d(' + offset + 'px, 0, 0)';
		if (this.dots) {
			const lastCDot = this.dots.children[currentIndex - 1];
			if (lastCDot) lastCDot.classList.remove('slider-active');
			let rightIndex = index;
			if (index > this.total) rightIndex = 1;
			if (index === 0) rightIndex = this.total;
			this.dots.children[rightIndex - 1].classList.add('slider-active');
		}
		this.fastTimer = setTimeout(() => {
			if (index > this.total) this.scrollToIndex(1, true);
			if (index === 0) this.scrollToIndex(this.total, true);
		}, this.config.duration);
		this.currentIndex = index;
		if (this.config.autoplay) this.start();
	}
}