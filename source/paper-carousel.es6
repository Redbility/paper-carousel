if (Polymer.Element) {

	class PaperCarousel extends Polymer.mixinBehaviors([Polymer.IronResizableBehavior], Polymer.Element) {
		static get is() {return 'paper-carousel'}

		items() {
			var module, moduleRect, breakpoints, breakpointKey, breakpoint, nextBreakpoint;

			module = this;
			moduleRect = module.getBoundingClientRect();

			if(module.getAttribute('responsive') != null) {
				breakpoints = module.getAttribute('responsive').replace(/\s/g, '').split(',');
				breakpointKey = 0;

				while(breakpointKey < breakpoints.length) {
					// Set loop vars
					breakpoint = breakpoints[breakpointKey].split(':');

					if(breakpoints[breakpointKey+1]) {
						nextBreakpoint = breakpoints[breakpointKey+1].split(':')
					} else {
						nextBreakpoint = {0:0}
					}

					// Set rwd items
					if(moduleRect.width <= breakpoint[0] && moduleRect.width > nextBreakpoint[0]) {
						return breakpoint[1]
					}

					breakpointKey++
				}
			}

			// Set item numbers
			if(module.getAttribute('items') != null) {
				return module.getAttribute('items');
			} else {
				return 1;
			}
		}

		_isLoop() {
			var module, value;
			// Set vars
			module = this;
			value = module.getAttribute('loop');

			// Set item number
			if (value != null) {
				if (value == 'true') {
					return true
				} else {
					return false
				}
			}else {
				return false
			}
		};

		_getRealTotalItems() {
			const childs = Polymer.dom(this).children;
			return childs.length;
		};

		_setContainerSize() {
			var module, dom, moduleWrapper, moduleRect, containerWidth, childWidth;
			// Set vars
			module = this;
			dom = module.shadowRoot;

			moduleWrapper = dom.querySelector('.paper-carousel_wrapper');
			moduleRect = module.getBoundingClientRect();

			if(module._isLoop()) {
				containerWidth = moduleRect.width * module._getRealTotalItems() / module.items()
			} else {
				// containerWidth = moduleRect.width * module._getTotalItems() / module.items()
			}

			if(module._isLoop()) {
				childWidth = Math.round(100/module._getRealTotalItems()*10000)/10000
			} else {
				// childWidth = Math.round(100/module._getTotalItems()*10000)/10000
			}

			// Set children width
			[].forEach.call(Polymer.dom(this).children, function(node) {
				if(node.localName != undefined) {
					node.style.width = childWidth + '%'
				}
			})
			// Set container width
			return moduleWrapper.style.minWidth = containerWidth + 'px';
		};


		// Own Callbacks
		_onLoad() {
			this._onResize();
		};

		_onResize() {
			this.addEventListener('iron-resize', e => {
				this._setContainerSize();
			});
		}


		// Native Callbacks
		constructor() {
			super();
		};

		connectedCallback() {
			this.async(() => {
				super.connectedCallback();
				this._onLoad();
			}, 10)
		};

		ready() {
			super.ready();

			this._onResize();
			this._getTotalItems();
		}
	}

	customElements.define(PaperCarousel.is, PaperCarousel);

}else {
	Polymer({
		is: 'paper-carousel',
		behaviors: [Polymer.IronResizableBehavior],
		listeners: {
			'iron-resize': '_onResize'
		},
		items: function() {
			var breakpoint, breakpointKey, breakpoints, module, moduleRect, nextBreakpoint;
			module = this;
			moduleRect = module.getBoundingClientRect();
			if (module.getAttribute('responsive') !== null) {
				breakpoints = module.getAttribute('responsive').replace(/\s/g, '').split(',');
				breakpointKey = 0;
				while (breakpointKey < breakpoints.length) {
					breakpoint = breakpoints[breakpointKey].split(':');
					if (breakpoints[breakpointKey + 1]) {
						nextBreakpoint = breakpoints[breakpointKey + 1].split(':');
					} else {
						nextBreakpoint = {
							0: 0
						};
					}
					if (moduleRect.width <= breakpoint[0] && moduleRect.width > nextBreakpoint[0]) {
						return breakpoint[1];
					}
					breakpointKey++;
				}
			}
			if (module.getAttribute('items') !== null) {
				return module.getAttribute('items');
			} else {
				return 1;
			}
		},
		_dotText: function() {
			var module, value;
			module = this;
			value = module.getAttribute('dotText');
			if (value !== null) {
				if (value === 'false') {
					return false;
				} else {
					return true;
				}
			} else {
				return true;
			}
		},
		_isLoop: function() {
			var module, value;
			module = this;
			value = module.getAttribute('loop');
			if (value !== null) {
				if (value === 'true') {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		},
		_transitionSpeed: function() {
			var module, value;
			module = this;
			value = module.getAttribute('transitionspeed');
			if (value !== null && value !== void 0) {
				module.customStyle['--transition-speed'] = value + 'ms';
				return module.updateStyles();
			}
		},
		_isAutoplay: function() {
			var module, value;
			module = this;
			value = module.getAttribute('autoplay');
			if (value !== null) {
				if (value === 'true') {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		},
		getTotalItems: function() {
			var child, i, j, len, len1, module, moduleWrapper, ref, ref1, totalItems;
			module = this;
			moduleWrapper = module.querySelector('.paper-carousel_wrapper');
			totalItems = 0;
			if (module._isLoop()) {
				ref = moduleWrapper.children;
				for (i = 0, len = ref.length; i < len; i++) {
					child = ref[i];
					if (child.localName !== 'template' && !child.classList.contains('cloned')) {
						totalItems++;
					}
				}
			} else {
				ref1 = moduleWrapper.children;
				for (j = 0, len1 = ref1.length; j < len1; j++) {
					child = ref1[j];
					if (child.localName !== 'template') {
						totalItems++;
					}
				}
			}
			return totalItems;
		},
		_getRealTotalItems: function() {
			var child, i, len, module, moduleWrapper, ref, totalItems;
			module = this;
			moduleWrapper = module.querySelector('.paper-carousel_wrapper');
			totalItems = 0;
			ref = moduleWrapper.children;
			for (i = 0, len = ref.length; i < len; i++) {
				child = ref[i];
				if (child.localName !== 'template') {
					totalItems++;
				}
			}
			return totalItems;
		},
		getPages: function() {
			var item, module, page, pages;
			module = this;
			item = 1;
			page = [];
			pages = [];
			while (item <= this.getTotalItems()) {
				page.push(item - 1);
				if (item % this.items() === 0) {
					pages.push(page);
					page = [];
				}
				if (item === this.getTotalItems()) {
					pages.push(page);
				}
				item++;
			}
			return pages;
		},
		getTotalPages: function() {
			var module;
			module = this;
			return Math.ceil(this.getTotalItems() / this.items());
		},
		getContainerPosition: function() {
			var module, moduleWrapper, transform, translateX, translateXValue;
			module = this;
			moduleWrapper = module.querySelector('.paper-carousel_wrapper');
			transform = moduleWrapper.style.transform;
			translateXValue = 0;
			if (transform !== '') {
				translateX = transform.match(/translateX\((.*)/)[0];
				translateXValue = translateX.match(/\((.*)\)/)[0];
				translateXValue = translateXValue.substr(1, translateXValue.length - 2);
				translateXValue = parseFloat(translateXValue);
			}
			return translateXValue;
		},
		getCurrentItem: function() {
			var item, itemPortion, itemPortion2, module;
			module = this;
			itemPortion = Math.round((100 / this.getTotalItems()) * 1000) / 1000;
			itemPortion2 = Math.round((100 / this._getRealTotalItems()) * 1000) / 1000;
			item = 0;
			if (this._isLoop) {
				while (item <= this._getRealTotalItems()) {
					if (Math.round((itemPortion2 * item) * 1000) / 1000 === -this.getContainerPosition()) {
						module.currentItem = item - this.itemsToPrepend.length;
						return item - this.itemsToPrepend.length;
					}
					item++;
				}
			} else {
				while (item <= this.getTotalItems()) {
					if (Math.round((itemPortion * item) * 1000) / 1000 === -this.getContainerPosition()) {
						module.currentItem = item;
						return item;
					}
					item++;
				}
			}
		},
		goToItem: function(key) {
			var itemPortion, module, moduleWrapper, movement;
			module = this;
			moduleWrapper = module.querySelector('.paper-carousel_wrapper');
			if (this._isLoop()) {
				itemPortion = Math.round((100 / this._getRealTotalItems()) * 1000) / 1000;
				movement = Math.round(((key + this.itemsToPrepend.length) * -itemPortion) * 1000) / 1000;
			} else {
				itemPortion = Math.round((100 / this.getTotalItems()) * 1000) / 1000;
				movement = Math.round((key * -itemPortion) * 1000) / 1000;
			}
			if (this._isLoop()) {
				moduleWrapper.style.transform = 'translateX(' + movement + '%)';
			} else {
				if (key < this.getTotalItems() && key >= 0) {
					if (this.items() < this.getTotalItems()) {
						moduleWrapper.style.transform = 'translateX(' + movement + '%)';
					}
				}
			}
			this._setActiveDot(this.getCurrentPage());
			this._setDisabledControls();
			return this._fireOnMoveEvent();
		},
		goToNextItem: function() {
			var itemPortion, itemPortion2, module, moduleWrapper;
			module = this;
			moduleWrapper = module.querySelector('.paper-carousel_wrapper');
			itemPortion = Math.round((100 / this.getTotalItems()) * 1000) / 1000;
			itemPortion2 = Math.round((100 / this._getRealTotalItems()) * 1000) / 1000;
			if (this._isLoop()) {
				this.goToItem(this.getCurrentItem() + 1);
				if (this.getCurrentItem() === this.getTotalItems()) {
					moduleWrapper.style.transition = 'none';
					this.goToItem(-1);
					moduleWrapper.style.transition = '';
					return this.goToItem(0);
				}
			} else {
				if (this.getContainerPosition() > -(this.getTotalItems() - this.items() - 1) * itemPortion - 5) {
					return this.goToItem(this.getCurrentItem() + 1);
				}
			}
		},
		goToPrevItem: function() {
			var itemPortion, itemPortion2, module, moduleWrapper;
			module = this;
			moduleWrapper = module.querySelector('.paper-carousel_wrapper');
			itemPortion = Math.round((100 / this.getTotalItems()) * 1000) / 1000;
			itemPortion2 = Math.round((100 / this._getRealTotalItems()) * 1000) / 1000;
			if (this._isLoop) {
				this.goToItem(this.getCurrentItem() - 1);
				if (this.getCurrentItem() === -1) {
					moduleWrapper.style.transition = 'none';
					this.goToItem(this.getTotalItems());
					moduleWrapper.style.transition = '';
					return this.goToItem(this.getTotalItems() - 1);
				}
			} else {
				if (this.getContainerPosition() < 0) {
					return this.goToItem(this.getCurrentItem() - 1);
				}
			}
		},
		getCurrentPage: function() {
			var itemPortion, lastItem, page, pageKey, pagePortion;
			itemPortion = Math.round((100 / this.getTotalItems()) * 1000) / 1000;
			pagePortion = itemPortion * this.items();
			pageKey = 0;
			while (pageKey < this.getPages().length) {
				page = this.getPages()[pageKey];
				lastItem = parseFloat(this.getCurrentItem()) + parseFloat(this.items());
				if (lastItem >= this.getTotalItems()) {
					if (!this._isLoop()) {
						this.goToPage(this.getTotalPages() - 1);
					}
					return this.getTotalPages() - 1;
				}
				if (page.indexOf(this.getCurrentItem()) !== -1) {
					return pageKey;
				}
				pageKey++;
			}
		},
		goToPage: function(key) {
			var itemPortion, itemPortion2, module, moduleWrapper, movement, pagePortion, pagePortion2, pagePortionFix, pagePortionFix2;
			module = this;
			moduleWrapper = module.querySelector('.paper-carousel_wrapper');
			itemPortion = Math.round((100 / this.getTotalItems()) * 1000) / 1000;
			itemPortion2 = Math.round((100 / this._getRealTotalItems()) * 1000) / 1000;
			pagePortionFix = (this.items() - this.getPages()[key].length) * itemPortion;
			pagePortionFix2 = (this.items() - this.getPages()[key].length) * itemPortion2;
			pagePortion = -itemPortion * this.items();
			pagePortion2 = -itemPortion2 * this.items();
			if (this._isLoop()) {
				movement = (Math.round(((key * pagePortion2) + pagePortionFix2) * 1000) / 1000) + pagePortion2;
			} else {
				movement = Math.round(((key * pagePortion) + pagePortionFix) * 1000) / 1000;
			}
			if (this._isLoop()) {
				moduleWrapper.style.transform = 'translateX(' + movement + '%)';
			} else {
				if (key < this.getTotalPages() && key >= 0) {
					if (this.items() < this.getTotalItems()) {
						moduleWrapper.style.transform = 'translateX(' + movement + '%)';
					}
				}
			}
			this._setActiveDot(key);
			this._setDisabledControls();
			return this._fireOnMoveEvent();
		},
		goToNextPage: function() {
			var itemPortion;
			itemPortion = Math.round((100 / this.getTotalItems()) * 1000) / 1000;
			if (this.getContainerPosition() > -(this.getTotalItems() - this.items() - 1) * itemPortion - 5) {
				return this.goToPage(this.getCurrentPage() + 1);
			}
		},
		goToPrevPage: function() {
			var itemPortion;
			itemPortion = Math.round((100 / this.getTotalItems()) * 1000) / 1000;
			if (this.getContainerPosition() < -5) {
				return this.goToPage(this.getCurrentPage() - 1);
			}
		},
		_createOnMoveEvent: function() {
			var module;
			module = this;
			module.onMove = void 0;
			if (document.createEvent) {
				module.onMove = document.createEvent("HTMLEvents");
				module.onMove.initEvent("onmove", true, true);
			} else {
				module.onMove = document.createEventObject();
				module.onMove.eventType = "onmove";
			}
			return module.onMove.eventName = "onmove";
		},
		_fireOnMoveEvent: function() {
			var module;
			module = this;
			if (document.createEvent) {
				return module.dispatchEvent(module.onMove);
			} else {
				return module.fireEvent("on" + module.onMove.eventType, module.onMove);
			}
		},
		_setContainerSize: function() {
			var child, childWidth, containerWidth, i, len, module, moduleRect, moduleWrapper, ref;
			module = this;
			moduleWrapper = module.querySelector('.paper-carousel_wrapper');
			moduleRect = module.getBoundingClientRect();
			if (this._isLoop()) {
				containerWidth = moduleRect.width * module._getRealTotalItems() / this.items();
			} else {
				containerWidth = moduleRect.width * module.getTotalItems() / this.items();
			}
			if (this._isLoop) {
				childWidth = Math.round(100 / this._getRealTotalItems() * 10000) / 10000;
			} else {
				childWidth = Math.round(100 / this.getTotalItems() * 10000) / 10000;
			}
			ref = moduleWrapper.children;
			for (i = 0, len = ref.length; i < len; i++) {
				child = ref[i];
				if (child.localName !== 'template') {
					child.style.width = childWidth + '%';
				}
			}
			return moduleWrapper.style.minWidth = containerWidth + 'px';
		},
		_setActiveDot: function(key) {
			var activeDotLine, activeDots, dotKey, module;
			module = this;
			activeDots = module.querySelectorAll('.paper-carousel_dot');
			activeDotLine = module.querySelector('.paper-carousel_dot-line');
			dotKey = 0;
			while (dotKey < activeDots.length) {
				if (dotKey === parseInt(key)) {
					activeDots[key].classList.add('active');
				} else {
					activeDots[dotKey].classList.remove('active');
				}
				dotKey++;
			}
			if (activeDotLine) {
				if (this.items() < this.getTotalItems()) {
					return activeDotLine.style.transform = 'translateX(' + key + '00%)';
				}
			}
		},
		_printControls: function(force) {
			var controlsContainer, controlsWrapper, loopIncrement, module, nextLink, nextLinkIcon, prevLink, prevLinkIcon;
			module = this;
			loopIncrement = 1;
			if (module.getAttribute('controls') === 'false') {
				return;
			}
			if (force !== true) {
				if (module.tpages === this.items()) {
					return;
				}
			}
			if (module.querySelector('.paper-carousel_controls')) {
				module.querySelector('.paper-carousel_controls').remove();
			}
			controlsContainer = document.createElement('div');
			controlsContainer.classList.add('paper-carousel_controls');
			controlsWrapper = document.createElement('div');
			controlsWrapper.classList.add('paper-carousel_controls_wrapper');
			nextLink = document.createElement('a');
			nextLinkIcon = document.createElement('iron-icon');
			if (module.getAttribute('nextIcon') !== null) {
				nextLinkIcon.setAttribute('icon', module.getAttribute('nextIcon'));
			} else {
				nextLinkIcon.setAttribute('icon', 'image:navigate-next');
			}
			prevLink = document.createElement('a');
			prevLinkIcon = document.createElement('iron-icon');
			if (module.getAttribute('prevIcon') !== null) {
				prevLinkIcon.setAttribute('icon', module.getAttribute('prevIcon'));
			} else {
				prevLinkIcon.setAttribute('icon', 'image:navigate-before');
			}
			nextLink.setAttribute('href', '');
			nextLink.classList.add('paper-carousel_controls_arrow-next');
			prevLink.setAttribute('href', '');
			prevLink.classList.add('paper-carousel_controls_arrow-prev');
			nextLink.addEventListener('click', function(e) {
				e.preventDefault();
				return module._disableAutoPlay();
			});
			prevLink.addEventListener('click', function(e) {
				e.preventDefault();
				return module._disableAutoPlay();
			});
			module.listen(nextLink, 'tap', 'goToNextItem');
			module.listen(prevLink, 'tap', 'goToPrevItem');
			Polymer.dom(nextLink).appendChild(nextLinkIcon);
			Polymer.dom(prevLink).appendChild(prevLinkIcon);
			Polymer.dom(controlsContainer).appendChild(controlsWrapper);
			Polymer.dom(controlsWrapper).appendChild(prevLink);
			Polymer.dom(controlsWrapper).appendChild(nextLink);
			if (this.getTotalPages() > 1) {
				Polymer.dom(module.root).appendChild(controlsContainer);
			}
			return this._setDisabledControls();
		},
		_setDisabledControls: function(key) {
			var controlLeft, controlRight, itemPortion, itemPortion2, module;
			module = this;
			itemPortion = Math.round((100 / this.getTotalItems()) * 1000) / 1000;
			itemPortion2 = Math.round((100 / this._getRealTotalItems()) * 1000) / 1000;
			controlLeft = module.querySelector('.paper-carousel_controls_arrow-prev');
			controlRight = module.querySelector('.paper-carousel_controls_arrow-next');
			if (!this._isLoop()) {
				if (controlRight !== null && controlLeft !== null) {
					if (this.getContainerPosition() > -0.5) {
						controlLeft.classList.add('paper-carousel_controls_arrow--disabled');
					} else {
						controlLeft.classList.remove('paper-carousel_controls_arrow--disabled');
					}
					if (this.getContainerPosition() < -(this.getTotalItems() - this.items() - 1) * itemPortion) {
						return controlRight.classList.add('paper-carousel_controls_arrow--disabled');
					} else {
						return controlRight.classList.remove('paper-carousel_controls_arrow--disabled');
					}
				}
			}
		},
		_printDots: function(force) {
			var dotCurrentLine, dotItem, dotItemLink, dotsContainer, dotsWrapper, loopIncrement, module;
			module = this;
			loopIncrement = 1;
			if (module.getAttribute('dots') === 'false') {
				return;
			}
			dotsContainer = document.createElement('div');
			dotsContainer.classList.add('paper-carousel_dots');
			dotsWrapper = document.createElement('ul');
			dotsWrapper.classList.add('paper-carousel_dots_wrapper');
			Polymer.dom(dotsContainer).appendChild(dotsWrapper);
			if (force !== true) {
				if (module.tpages !== this.items()) {
					module.tpages = this.items();
				} else {
					return;
				}
			}
			if (module.querySelector('.paper-carousel_dots')) {
				module.querySelector('.paper-carousel_dots').remove();
			}
			while (loopIncrement <= this.getTotalPages()) {
				dotItem = document.createElement('li');
				dotItem.classList.add('paper-carousel_dot');
				dotItemLink = document.createElement('a');
				dotItemLink.setAttribute('href', '');
				dotItemLink.setAttribute('data-rel', loopIncrement - 1);
				module.clickDotsEvent = function(e) {
					var activeItem;
					activeItem = e.target.getAttribute('data-rel');
					return this.goToPage(activeItem);
				};
				dotItemLink.addEventListener('click', function(e) {
					e.preventDefault();
					return module._disableAutoPlay();
				});
				module.listen(dotItemLink, 'tap', 'clickDotsEvent');
				if (this._dotText() === true) {
					dotItemLink.textContent = loopIncrement;
				}
				dotCurrentLine = document.createElement('li');
				dotCurrentLine.classList.add('paper-carousel_dot-line');
				Polymer.dom(dotItem).appendChild(dotItemLink);
				Polymer.dom(dotsWrapper).appendChild(dotItem);
				if (loopIncrement === this.getTotalPages()) {
					Polymer.dom(dotsWrapper).appendChild(dotCurrentLine);
				}
				loopIncrement++;
			}
			if (this.getTotalPages() > 1) {
				Polymer.dom(module.root).appendChild(dotsContainer);
			}
			return this._setActiveDot(this.getCurrentPage());
		},
		_getDragState: function(e) {
			var endLimit, endRangeLimit, endTime, itemLoop, itemPortion, itemPortion2, limitSwipeVelocity, maxLimit, maxLimit2, module, moduleWrapper, moduleWrapperRect, movement, rangeLimit, realMovement, startLimit, startRangeLimit, swipeVelocity, touchValue;
			module = this;
			moduleWrapper = module.querySelector('.paper-carousel_wrapper');
			moduleWrapperRect = moduleWrapper.getBoundingClientRect();
			movement = Math.round(((e.detail.dx * 100) / moduleWrapperRect.width) * 1000) / 1000;
			itemPortion = Math.round((100 / this.getTotalItems()) * 1000) / 1000;
			itemPortion2 = Math.round((100 / this._getRealTotalItems()) * 1000) / 1000;
			maxLimit = Math.round((itemPortion * (this.getTotalItems() - this.items())) * 1000) / 1000;
			maxLimit2 = Math.round((itemPortion2 * (this._getRealTotalItems() - this.items())) * 1000) / 1000;
			endTime = 0;
			touchValue = e.detail.dx;
			switch (e.detail.state) {
				case 'start':
					module.startTime = new Date().getTime();
					module.dragPosition = this.getContainerPosition();
					window.touching = true;
					moduleWrapper.style.transitionDuration = '0s';
					return window.addEventListener('scroll', function() {
						clearInterval(window.scrollingInterval);
						window.scrolling = true;
						window.touchScroll = true;
						return window.scrollingInterval = setTimeout((function() {
							window.scrolling = false;
							if (window.touching === false) {
								return window.touchScroll = false;
							}
						}), 50);
					});
				case 'track':
					realMovement = Math.round((module.dragPosition + movement) * 1000) / 1000;
					realMovement = Math.min(realMovement, 0);
					if (this._isLoop()) {
						realMovement = Math.max(realMovement, -maxLimit2);
					} else {
						realMovement = Math.max(realMovement, -maxLimit);
					}
					if ((window.scrolling === false || window.scrolling === void 0) && (window.touchScroll === false || window.touchScroll === void 0)) {
						if (touchValue > 2 || touchValue < -2) {
							if (this.items() < this.getTotalItems() && window.movingCarousel === true) {
								moduleWrapper.style.transform = 'translateX(' + realMovement + '%) translateY(0) translateZ(0)';
							}
							window.movingCarousel = true;
						}
					}
					return window.addEventListener('touchmove', function(e) {
						if (window.movingCarousel === true) {
							return e.preventDefault();
						}
					});
				case 'end':
					endTime = new Date().getTime();
					swipeVelocity = endTime - module.startTime;
					limitSwipeVelocity = Math.max(Math.min(swipeVelocity, 500), 100);
					if (this._isLoop()) {
						itemLoop = -1;
					} else {
						itemLoop = 0;
					}
					if (this.getContainerPosition() > -5) {
						limitSwipeVelocity = 500;
					}
					if (this._isLoop()) {
						if (this.getContainerPosition() < -(this._getRealTotalItems() - this.items()) * itemPortion + 5) {
							limitSwipeVelocity = 500;
						}
					} else {
						if (this.getContainerPosition() < -(this.getTotalItems() - this.items()) * itemPortion + 5) {
							limitSwipeVelocity = 500;
						}
					}
					if (touchValue < 30 && touchValue > -30) {
						limitSwipeVelocity = 500;
					}
					moduleWrapper.style.transitionDuration = limitSwipeVelocity + 'ms';
					module.resetTransition = function() {
						if (module._isLoop()) {
							if (module.getCurrentItem() === module.getTotalItems()) {
								moduleWrapper.style.transition = 'none';
								module.goToItem(0);
								moduleWrapper.style.transition = '';
							}
							if (this.getCurrentItem() === -1) {
								moduleWrapper.style.transition = 'none';
								this.goToItem(this.getTotalItems() - 1);
								moduleWrapper.style.transition = '';
							}
						}
						return moduleWrapper.style.transitionDuration = '';
					};
					module.listen(moduleWrapper, 'transitionend', 'resetTransition');
					if ((window.scrolling === false || window.scrolling === void 0) && (window.touchScroll === false || window.touchScroll === void 0)) {
						if (touchValue > 2 || touchValue < -2) {
							if (this._isLoop()) {
								while (itemLoop < this._getRealTotalItems()) {
									startLimit = -Math.round((itemPortion2 * (itemLoop + this.itemsToPrepend.length)) * 1000) / 1000;
									endLimit = -Math.round((itemPortion2 * (itemLoop + this.itemsToPrepend.length + 1)) * 1000) / 1000;
									rangeLimit = Math.round((startLimit - endLimit) * 1000) / 1000;
									endRangeLimit = endLimit + rangeLimit / 2;
									startRangeLimit = startLimit - rangeLimit / 2;
									if (movement < 0 && swipeVelocity < 150) {
										if (this.getContainerPosition() < startLimit && this.getContainerPosition() >= endLimit) {
											this.goToItem(itemLoop + 1);
										}
									}
									if (movement > 0 && swipeVelocity < 150) {
										if (this.getContainerPosition() < startLimit && this.getContainerPosition() >= endLimit) {
											this.goToItem(itemLoop);
										}
									}
									if (this.getContainerPosition() < startLimit && this.getContainerPosition() >= endRangeLimit) {
										this.goToItem(itemLoop);
									}
									if (this.getContainerPosition() < startRangeLimit && this.getContainerPosition() >= endLimit) {
										this.goToItem(itemLoop + 1);
									}
									itemLoop++;
								}
							} else {
								while (itemLoop < this.getTotalItems()) {
									startLimit = -Math.round((itemPortion * itemLoop) * 1000) / 1000;
									endLimit = -Math.round((itemPortion * (itemLoop + 1)) * 1000) / 1000;
									rangeLimit = Math.round((startLimit - endLimit) * 1000) / 1000;
									endRangeLimit = endLimit + rangeLimit / 2;
									startRangeLimit = startLimit - rangeLimit / 2;
									if (movement < 0 && swipeVelocity < 150) {
										if (this.getContainerPosition() < startLimit && this.getContainerPosition() >= endLimit) {
											this.goToItem(itemLoop + 1);
										}
									}
									if (movement > 0 && swipeVelocity < 150) {
										if (this.getContainerPosition() < startLimit && this.getContainerPosition() >= endLimit) {
											this.goToItem(itemLoop);
										}
									}
									if (this.getContainerPosition() < startLimit && this.getContainerPosition() >= endRangeLimit) {
										this.goToItem(itemLoop);
									}
									if (this.getContainerPosition() < startRangeLimit && this.getContainerPosition() >= endLimit) {
										this.goToItem(itemLoop + 1);
									}
									itemLoop++;
								}
							}
						}
					}
					window.movingCarousel = false;
					window.touchScroll = false;
					return window.touching = false;
			}
		},
		_loop: function() {
			var cloneItems, clonedItems, module, moduleWrapper, totalItems;
			module = this;
			if (module._isLoop()) {
				moduleWrapper = module.querySelector('.paper-carousel_wrapper');
				totalItems = 0;
				module.itemsToAppend = [];
				module.itemsToPrepend = [];
				clonedItems = module.querySelectorAll('.paper-carousel_wrapper .cloned');
				cloneItems = function() {
					var childrenReverse;
					childrenReverse = [];
					[].forEach.call(moduleWrapper.children, function(val, key) {
						var clonedItem;
						if (key < module.items()) {
							clonedItem = val.cloneNode(true);
							clonedItem.classList.add('cloned');
							module.itemsToAppend.push(clonedItem);
						}
						if (key >= (module.getTotalItems() - module.items()) && key <= module.getTotalItems()) {
							return childrenReverse.push(val);
						}
					});
					return [].forEach.call(childrenReverse, function(val, key) {
						var clonedItem;
						if (key < module.items()) {
							clonedItem = val.cloneNode(true);
							clonedItem.classList.add('cloned');
							return module.itemsToPrepend.push(clonedItem);
						}
					});
				};
				if (clonedItems.length > 0) {
					[].forEach.call(clonedItems, function(val, key) {
						val.remove();
						if (key === clonedItems.length - 1) {
							return cloneItems();
						}
					});
				} else {
					cloneItems();
				}
				[].forEach.call(module.itemsToAppend, function(val, key) {
					return moduleWrapper.appendChild(val);
				});
				return [].forEach.call(module.itemsToPrepend.reverse(), function(val, key) {
					return moduleWrapper.insertBefore(val.cloneNode(true), moduleWrapper.children[0]);
				});
			}
		},
		_autoPlay: function() {
			var autoPlayIntervalTime, module;
			module = this;
			if (module.getAttribute('autoplaytime') !== null && module.getAttribute('autoplaytime') !== void 0) {
				autoPlayIntervalTime = module.getAttribute('autoplaytime');
			} else {
				autoPlayIntervalTime = 6000;
			}
			if (module._isAutoplay()) {
				return module.autoPlayInterval = setInterval((function() {
					if (module._isLoop()) {
						return module.goToNextItem();
					} else {
						if ((module.getCurrentItem() + 1) < module.getTotalItems()) {
							return module.goToNextItem();
						} else {
							return module.goToItem(0);
						}
					}
				}), autoPlayIntervalTime);
			}
		},
		_disableAutoPlay: function() {
			var module;
			module = this;
			if (module._isAutoplay()) {
				clearInterval(module.autoPlayInterval);
				return module._isAutoplay = function() {
					return false;
				};
			}
		},
		_onDrag: function() {
			var module, moduleWrapper;
			module = this;
			moduleWrapper = module.querySelector('.paper-carousel_wrapper');
			module.listen(this.$$('.paper-carousel_wrapper'), 'track', '_getDragState');
			return moduleWrapper.style.touchAction = '';
		},
		_setInitialPosition: function() {
			var module, moduleWrapper;
			module = this;
			moduleWrapper = module.querySelector('.paper-carousel_wrapper');
			moduleWrapper.style.transition = 'none';
			module.goToItem(0);
			moduleWrapper.style.transition = '';
			return module.initialize = true;
		},
		refresh: function() {
			this._setContainerSize();
			this._printControls(true);
			this._printDots(true);
			return this._onResize();
		},
		ready: function() {
			this.itemsToAppend = [];
			this.itemsToPrepend = [];
			return this._createOnMoveEvent();
		},
		attached: function() {
			var module;
			module = this;
			return this.async(function() {
				return setTimeout((function() {
					return module._onLoad();
				}), 0);
			});
		},
		_onLoad: function() {
			this._onDrag();
			this._onResize();
			this._setInitialPosition();
			this._transitionSpeed();
			return this._autoPlay();
		},
		_onResize: function() {
			this._loop();
			this._setContainerSize();
			this._printControls();
			this._printDots();
			if (this.initialize === true) {
				return this.goToItem(this.currentItem);
			}
		}
	});
}
