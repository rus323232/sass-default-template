export class SmoothScroll {
    constructor (settings) {
        this.wrapper = $('.full-page');
        this.screenItem = $('section[id*="page-"]');
        this.animationTime = settings.animationTime || 1000;
        this.animationDelay = settings.animationDelay || 500;
        this.pageHeight = 0;
        this.currentPage = 0;
        this.pageCount = 0;
        this.lastAnimation = 0;
        this.pageList = this.getPageList();
    }

    init () {
        this.setPosition('default');
        this.formatPage();
        this.scrollInit();
        this.touchInit();
        this.arrowNavInit();
        this.menuInit();
        this.pageChangeListen();
    }

    getPageList () {
        let result = [];

        this.screenItem.each((index, element) => {
            let title, pathName;

            title = $(element).attr('data-title');
            pathName = $(element).attr('id');
            result.push({
                title: title,
                pathName: pathName
            });
        });

        return result;
    }

    formatPage () {
        let offsetY = 0,
            paginationCircle = $('.pagination li');

        if (!$('body').hasClass('formatted')) {
            this.wrapper.css({
                'transition': 'all '+this.animationTime+'ms ease 0s',
                '-moz-transition': 'all '+this.animationTime+'ms ease 0s',
                '-o-transition': 'all '+this.animationTime+'ms ease 0s',
                '-ms-transition': 'all '+this.animationTime+'ms ease 0s',
                '-webkit-transition': 'all '+this.animationTime+'ms ease 0s'
            });
            this.screenItem.each( (index, element) => {
                $(element).css('top', offsetY + "%");
                offsetY += 100;
            });
            $('body').addClass('formatted');
        }

        this.calcPageParams();

        if (this.currentPage !== undefined) {
            this.screenItem.removeClass('active');
            this.screenItem.eq(this.currentPage).addClass('active');
            paginationCircle.removeClass('active');
            paginationCircle.eq(this.currentPage).addClass('active');
            if (this.currentPage === 1 ) {
                $('.fixed-header').addClass('fixed-header_black');
            } else {
                $('.fixed-header').removeClass('fixed-header_black');
            }
            this.updateUrl(this.currentPage);
        }
    }

    updateUrl (pageNumber) {
        let currentUrl = location.href.split('/'),
            newUrl, newTitle;

        currentUrl.splice(-1);
        currentUrl.join('/');

        newTitle = this.pageList[pageNumber].title;
        newUrl = '#/' + this.pageList[pageNumber].pathName;

        window.history.pushState(null, newTitle, newUrl);
        document.title = newTitle;
    }

    pageChangeListen() {
        $(window).on('hashchange', (e) => {
            e.preventDefault();
            let newPage = location.href.split('#')[1],
                newPageNumber, i, max;
            max = this.pageList.length;

            for (i = 0; i < max; i++) {
                if ('/' + this.pageList[i].pathName === newPage) {
                    this.setPosition('default');
                    this.goToPage(i);
                    return;
                } else {
                    this.goToPage(0);
                }
            }
        })
    }

    calcPageParams () {
        let pageHeight  = this.screenItem.height(),
            pageCount   = this.wrapper.height() / pageHeight;

        this.pageHeight  = parseInt(pageHeight);
        this.pageCount   = parseInt(pageCount);
    }

    scrollInit () {
        $(document).on('mousewheel DOMMouseScroll', event => {
            event.preventDefault();
            let currentTime = new Date().getTime(),
                delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;

            if(currentTime - this.lastAnimation < this.animationDelay + this.animationTime) {
                event.preventDefault();
                return;
            }

            this.lastAnimation = currentTime;

            if (delta < 0) {
                if (this.currentPage < (this.pageCount - 1)) {
                    this.goNextPage();
                }
            }
            else {
                if (this.currentPage !== 0) {
                    this.goPrevPage();
                }
            }
        });
    }

    touchInit () {
        let lastY;

        $(window).on('touchstart', (e) => {
            lastY = e.originalEvent.touches[0].pageY;
        });

        $(window).on('touchmove', (e) => {
            e.preventDefault();
            let moveY = lastY-e.originalEvent.touches[0].pageY;

            if (Math.abs(moveY) < 60) {
                return false
            }
            if(moveY < 0){
                if (this.currentPage !== 0) {
                    this.goPrevPage();
                }
            }else {
                if (this.currentPage < (this.pageCount - 1)) {
                    this.goNextPage();
                }
            }
        });

        $(window).resize (() => {
            this.formatPage();
            this.goToPage(this.currentPage);
        });
    }

    arrowNavInit () {
        $(document).on('keypress', (e) => {
            switch (e.keyCode) {
                case 38:
                    e.preventDefault();
                    if (this.currentPage !== 0) {
                        this.goPrevPage();
                    }
                    break;
                case 40:
                    e.preventDefault();
                    if (this.currentPage < (this.pageCount - 1)) {
                        this.goNextPage();
                    }
                    break;
            }
        });
    }

    menuInit () {
        $('.pagination a, .fixed-header__menu a').on('click', (event) => {
            event.preventDefault();
            let link = $(event.currentTarget).attr('href'),
                page = link.split('#')[1],
                i, max = this.pageList.length;

            for (i = 0; i < max; i++) {
                if ('/' + this.pageList[i].pathName === page) {
                    this.setPosition('default');
                    this.goToPage(i);
                    return;
                } else {
                    this.goToPage(0);
                }
            }
        });
    }

    goPrevPage () {
        let prevPage = this.currentPage - 1;

        this.setPosition(prevPage);
        this.currentPage = prevPage;
        this.formatPage();
    }

    goNextPage () {
        let nextPage = this.currentPage + 1;

        this.setPosition(nextPage);
        this.currentPage = nextPage;
        this.formatPage();
    }

    goToPage (pageNumber) {
        let page = parseInt(pageNumber);

        if (page > (this.pageCount - 1) && page < 0) {
            console.log('Page not exist');
            return;
        }
        this.setPosition(page);
        this.currentPage = page;
        this.formatPage();
    }

    setPosition (page) {
        let position;

        if (page === 'default') {
            $(window).scrollTop(0);
        }
        position = parseInt(page) * this.pageHeight * -1;
        if (position !== undefined) {
            this.wrapper.css({
                '-webkit-transform': 'translate3d(0px, '+ position + 'px, 0px)',
                '-moz-transform': 'translate3d(0px, '+ position + 'px, 0px)',
                '-ms-transform': 'translate3d(0px, '+ position + 'px, 0px)',
                '-o-transform': 'translate3d(0px, '+ position + 'px, 0px)',
                'transform': 'translate3d(0px, '+ position + 'px, 0px)'
            });
        }
    }
}