export class PageTransform {

    constructor() {
        console.log('page active');
    }

    init() {
        this.mainMenuButtonInit();
        this.carouselInit();
    }

    centerContent()  {
        $('*[class*="__content"]').each((i, el) => {
            let height = $(el).height();
            console.log(parseInt(height), $(el).attr('class'));
            $(el).css('margin-top', parseInt(height / 2) * -1);
        });
    };

    mainMenuButtonInit() {
        $('.fixed-header__button').click( (event) => {
            $(event.currentTarget).toggleClass('on');
            if ($(window).width() < 771) {
                $('.fixed-header__menu, .fixed-header').toggleClass('on');
            }
            return false;
        });

        $(document).click ( (event) => {
            if ($('.fixed-header__menu, .fixed-header').hasClass('on')) {
                $('.fixed-header__menu, .fixed-header, .fixed-header__button').toggleClass('on');
            }
        })
    }

    carouselInit() {
        $('.page-2__slider.owl-carousel').owlCarousel({
            loop:true,
            margin:10,
            responsiveClass:true,
            responsive:{
                0:{
                    items:1,
                    nav:false
                },
                600:{
                    items:2,
                    nav:false
                },
                800: {
                    items:3,
                    nav: false
                },
                1039:{
                    items:4,
                    nav:true,
                    loop:false
                }
            }
        });
    }
}