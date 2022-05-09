import {Lazyload} from './Lazyload'
import {Slider} from './Slider'
import {Compare} from './Compare'

function getCookie(name: string) {
	var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
	return v ? v[2] : null;
}
function setCookie(name: string, value: string, days: number) {
	var d = new Date;
	d.setTime(d.getTime() + 24*60*60*1000*days);
	document.cookie = name + "=" + value + ";path=/;expires=" + d.toUTCString();
}

function bootstrap(document: Document) {
	new Lazyload(document);
	new Compare(document);

	const imageLinks = document.getElementsByClassName('portfolio-img');
	Array.from(imageLinks).forEach((link) => { (link as HTMLAnchorElement).target = '_blank'; });

	if (document.getElementsByClassName('header-dezai').length > 0) {
		const miniElement = document.getElementsByClassName('header-slider-mini')[0] as HTMLElement;
		const element = document.getElementsByClassName('header-slider')[0] as HTMLElement;
		const slider = new Slider(document, element, { arrows: false });
		new Slider(document, miniElement, undefined, slider);
	}

	const compare = document.getElementsByClassName('slider-compare')[0] as HTMLElement;
	const compareText = document.getElementsByClassName('slider-reviews')[0] as HTMLElement;
	const compareSlider = new Slider(document, compare, { arrows: false, autoplay: false });
	new Slider(document, compareText, { dots: true, autoplay: false }, compareSlider);

	const root = (window as { hbspt: any } & Window & typeof globalThis);
	if (root.hbspt) {
		root.hbspt.forms.create({ target: '#contact-form', region: "eu1", portalId: "25696124", formId: "7961c2c8-23c4-4702-985a-5ddbe9458ab9"});
		root.hbspt.forms.create({ target: '#popover-form .popup', region: "eu1", portalId: "25696124", formId: "7961c2c8-23c4-4702-985a-5ddbe9458ab9"});
	}

	const cblock = document.getElementsByClassName('cookies-dezai')[0] as HTMLElement;
	if (cblock) {
		if (!getCookie('cookie_accept')) cblock.style.display = 'block';
		const cookieAccept = cblock.getElementsByClassName('accept')[0];
		if (cookieAccept) cookieAccept.addEventListener('click', () => {
			setCookie('cookie_accept', 'true', 365);
			cblock.style.display = 'none';
		});
	}

	let lastAnchor = '';
	const formAnchor = 'popover-form';
  const handle = () => {
    const newAnchor = window.location.hash.substring(1);
    if (lastAnchor !== newAnchor) {
      lastAnchor = newAnchor;
			const elem = document.getElementById(newAnchor) as HTMLElement;
			if (!elem) return;
			if (newAnchor === formAnchor) {
				document.body.style.overflow = 'hidden';
				elem.style.display = 'block';
				elem.style.opacity = '1';
      } else {
				document.body.style.overflow = 'auto';
				elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
    }
  };
  handle();
  window.addEventListener('hashchange', handle);
	const popovers = document.getElementsByClassName('popup-content');
	Array.from(popovers).forEach((d) => {
		const handle = () => {
			history.replaceState({}, document.title, window.location.href.split('#')[0]);
			lastAnchor = '';
			const elem = d.parentNode as HTMLElement;
			elem.style.opacity = '0';
			document.body.style.overflow = 'auto';
			setTimeout(() => { elem.style.display = 'none'; }, 300);
		};
		d.getElementsByClassName('popup-close')[0].addEventListener('click', handle);
		d.getElementsByClassName('popup-back')[0].addEventListener('click', handle);
	});


  // Pricing
	const compareBox = document.getElementsByClassName('compare')[0];
	if (compareBox) {
		const inputs = compareBox.getElementsByTagName('input');
		Array.from(inputs).forEach((input) => {
			input.addEventListener('change', () => {
				const list = compareBox.getElementsByClassName('compare-list')[0];
				Array.from(list.getElementsByClassName('row')).forEach((item) => {
					if (!item.classList.contains('row-head')) {
						const vIndex = input.value === 'dezai' ? 1 : 2;
						const hIndex = input.value === 'dezai' ? 2 : 1;
						(item.children[vIndex] as HTMLElement).style.display = 'flex';
						(item.children[hIndex] as HTMLElement).style.display = 'none';
					}
				});
			});
		});
	}


	const tabs = document.getElementsByClassName('portfolio')[0]?.getElementsByClassName('tabs')[0];
	tabs.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement)?.closest('.tab');
		if (!target) return;
		tabs.getElementsByClassName('active')[0]?.classList.remove('active');
		target?.classList.add('active');
		const id = target?.id.split('-')[1];
		const contents = document.getElementsByClassName('tab-content');
		Array.from(contents).forEach((content) => {
			(content as HTMLElement).style.display = 'none';
		});
		const content = document.getElementById(`tc${id}`) as HTMLElement;
		if (content) content.style.display = 'block';
	});
}

document.addEventListener("DOMContentLoaded", () => bootstrap(document));