function optimizeImageUrl(url) {
    if (!url) return '';
    if (url.includes('res.cloudinary.com/') && url.includes('/image/upload/') && !url.includes('/c_limit')) {
        return url.replace('/image/upload/', '/image/upload/c_limit,w_1024,f_auto,q_auto/');
    }
    return url;
}

document.addEventListener('DOMContentLoaded', () => {
    // Sitenin tüm dinamik yapısını başlatmak için ana fonksiyon
    initApp();
});

async function initApp() {
    let siteData = { settings: {}, events: [] };
    
    // settings.json ve events.json dosyalarından verileri yükle
    try {
        const [settingsRes, eventsRes] = await Promise.all([
            fetch('settings.json?t=' + Date.now()),
            fetch('events.json?t=' + Date.now())
        ]);
        
        if (settingsRes.ok) {
            const settingsData = await settingsRes.json();
            siteData.settings = settingsData.settings || {};
        } else {
            console.warn("settings.json yüklenemedi, HTML'deki statik veriler kullanılacak.");
        }

        if (eventsRes.ok) {
            const eventsData = await eventsRes.json();
            siteData.events = eventsData.events || [];
        } else {
            console.warn("events.json yüklenemedi, HTML'deki statik veriler kullanılacak.");
        }
        
        // Ön yüzü doldur
        renderContent(siteData);
    } catch (error) {
        console.error("Veri yükleme hatası:", error);
    }

    // 2. DOM yüklendikten sonra diğer dinamik bileşenleri çalıştır
    initializeUiComponents(siteData);
}

// Görsel ve metinsel alanları data.json ile güncelleyen fonksiyon
function renderContent(data) {
    const s = data.settings || {};
    
    // Site Başlığı ve Açıklaması
    if (s.site_title) document.title = s.site_title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && s.site_desc) metaDesc.setAttribute('content', s.site_desc);

    // Logolar
    if (s.logo_title) {
        document.querySelectorAll('.logoTitle').forEach(el => el.textContent = s.logo_title);
    }
    if (s.logo_subtitle) {
        document.querySelectorAll('.logoSubtitle').forEach(el => el.textContent = s.logo_subtitle);
    }

    // Hero Bölümü
    if (s.hero_tagline) document.getElementById('heroTagline').textContent = s.hero_tagline;
    if (s.hero_title) document.getElementById('heroTitle').textContent = s.hero_title;
    if (s.hero_desc) document.getElementById('heroDesc').textContent = s.hero_desc;

    // Hero Slaytları
    const heroSlider = document.getElementById('heroSlider');
    const heroSliderControls = document.getElementById('heroSliderControls');
    if (heroSlider && heroSliderControls) {
        const slides = [];
        if (s.hero_slide_1) slides.push(s.hero_slide_1);
        if (s.hero_slide_2) slides.push(s.hero_slide_2);
        if (s.hero_slide_3) slides.push(s.hero_slide_3);

        if (slides.length > 0) {
            heroSlider.innerHTML = '';
            heroSliderControls.innerHTML = '';
            slides.forEach((slideSrc, idx) => {
                // Slayt
                const slideDiv = document.createElement('div');
                slideDiv.className = `slide ${idx === 0 ? 'active' : ''}`;
                slideDiv.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('${slideSrc}')`;
                heroSlider.appendChild(slideDiv);

                // Nokta kontrolü
                const dotBtn = document.createElement('button');
                dotBtn.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
                dotBtn.setAttribute('data-index', idx);
                dotBtn.setAttribute('aria-label', `Slayt ${idx + 1}`);
                heroSliderControls.appendChild(dotBtn);
            });
        }
    }

    // Hakkımızda Bölümü
    if (s.about_img_1) document.getElementById('aboutImg1').src = s.about_img_1;
    if (s.about_img_2) document.getElementById('aboutImg2').src = s.about_img_2;
    if (s.about_experience_years) document.getElementById('aboutExpYears').textContent = s.about_experience_years;
    if (s.about_experience_text) document.getElementById('aboutExpText').textContent = s.about_experience_text;
    if (s.about_subtitle) document.getElementById('aboutSubtitle').textContent = s.about_subtitle;
    if (s.about_title) document.getElementById('aboutTitle').textContent = s.about_title;
    if (s.about_desc) document.getElementById('aboutDesc').textContent = s.about_desc;

    // Hakkımızda Özellikler
    if (s.about_feat_1_title) document.getElementById('aboutFeat1Title').textContent = s.about_feat_1_title;
    if (s.about_feat_1_desc) document.getElementById('aboutFeat1Desc').textContent = s.about_feat_1_desc;
    if (s.about_feat_2_title) document.getElementById('aboutFeat2Title').textContent = s.about_feat_2_title;
    if (s.about_feat_2_desc) document.getElementById('aboutFeat2Desc').textContent = s.about_feat_2_desc;
    if (s.about_feat_3_title) document.getElementById('aboutFeat3Title').textContent = s.about_feat_3_title;
    if (s.about_feat_3_desc) document.getElementById('aboutFeat3Desc').textContent = s.about_feat_3_desc;

    // Salonumuz
    if (s.venue_subtitle) document.getElementById('venueSubtitle').textContent = s.venue_subtitle;
    if (s.venue_title) document.getElementById('venueTitle').textContent = s.venue_title;

    // Salon Slaytları
    const venueSlider = document.getElementById('venueSlider');
    const venueSliderControls = document.getElementById('venueSliderControls');
    if (venueSlider && venueSliderControls) {
        const vSlides = [];
        if (s.venue_slide_1) vSlides.push(s.venue_slide_1);
        if (s.venue_slide_2) vSlides.push(s.venue_slide_2);
        if (s.venue_slide_3) vSlides.push(s.venue_slide_3);

        if (vSlides.length > 0) {
            venueSlider.innerHTML = '';
            venueSliderControls.innerHTML = '';
            vSlides.forEach((slideSrc, idx) => {
                // Slayt
                const slideDiv = document.createElement('div');
                slideDiv.className = `venue-slide ${idx === 0 ? 'active' : ''}`;
                slideDiv.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.25)), url('${slideSrc}')`;
                venueSlider.appendChild(slideDiv);

                // Nokta kontrolü
                const dotBtn = document.createElement('button');
                dotBtn.className = `venue-dot ${idx === 0 ? 'active' : ''}`;
                dotBtn.setAttribute('data-slide', idx);
                dotBtn.setAttribute('aria-label', `Görsel ${idx + 1}`);
                venueSliderControls.appendChild(dotBtn);
            });
        }
    }

    // Salon Sağ Detayları
    if (s.venue_right_subtitle) document.getElementById('venueRightSubtitle').textContent = s.venue_right_subtitle;
    if (s.venue_right_title) document.getElementById('venueRightTitle').textContent = s.venue_right_title;
    if (s.venue_right_desc) document.getElementById('venueRightDesc').textContent = s.venue_right_desc;

    // Salon Özellikleri
    if (s.venue_feat_1_title) document.getElementById('venueFeat1Title').textContent = s.venue_feat_1_title;
    if (s.venue_feat_1_desc) document.getElementById('venueFeat1Desc').textContent = s.venue_feat_1_desc;
    if (s.venue_feat_2_title) document.getElementById('venueFeat2Title').textContent = s.venue_feat_2_title;
    if (s.venue_feat_2_desc) document.getElementById('venueFeat2Desc').textContent = s.venue_feat_2_desc;
    if (s.venue_feat_3_title) document.getElementById('venueFeat3Title').textContent = s.venue_feat_3_title;
    if (s.venue_feat_3_desc) document.getElementById('venueFeat3Desc').textContent = s.venue_feat_3_desc;
    if (s.venue_feat_4_title) document.getElementById('venueFeat4Title').textContent = s.venue_feat_4_title;
    if (s.venue_feat_4_desc) document.getElementById('venueFeat4Desc').textContent = s.venue_feat_4_desc;
    if (s.venue_feat_5_title) document.getElementById('venueFeat5Title').textContent = s.venue_feat_5_title;
    if (s.venue_feat_5_desc) document.getElementById('venueFeat5Desc').textContent = s.venue_feat_5_desc;
    if (s.venue_feat_6_title) document.getElementById('venueFeat6Title').textContent = s.venue_feat_6_title;
    if (s.venue_feat_6_desc) document.getElementById('venueFeat6Desc').textContent = s.venue_feat_6_desc;

    // Tanıtım Videosu
    if (s.video_subtitle) document.getElementById('videoSubtitle').textContent = s.video_subtitle;
    if (s.video_title) document.getElementById('videoTitle').textContent = s.video_title;
    if (s.video_desc) document.getElementById('videoDesc').textContent = s.video_desc;
    if (s.video_cover) {
        document.getElementById('videoCover').style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url('${s.video_cover}')`;
    }
    if (s.video_path) document.getElementById('tourVideo').src = s.video_path;

    // Hizmetlerimiz
    if (s.services_subtitle) document.getElementById('servicesSubtitle').textContent = s.services_subtitle;
    if (s.services_title) document.getElementById('servicesTitle').textContent = s.services_title;
    if (s.services_desc) document.getElementById('servicesDesc').textContent = s.services_desc;

    if (s.service_1_img) document.getElementById('service1Img').src = s.service_1_img;
    if (s.service_1_icon) document.getElementById('service1Icon').className = s.service_1_icon;
    if (s.service_1_title) document.getElementById('service1Title').textContent = s.service_1_title;
    if (s.service_1_desc) document.getElementById('service1Desc').textContent = s.service_1_desc;

    if (s.service_2_img) document.getElementById('service2Img').src = s.service_2_img;
    if (s.service_2_icon) document.getElementById('service2Icon').className = s.service_2_icon;
    if (s.service_2_title) document.getElementById('service2Title').textContent = s.service_2_title;
    if (s.service_2_desc) document.getElementById('service2Desc').textContent = s.service_2_desc;

    if (s.service_3_img) document.getElementById('service3Img').src = s.service_3_img;
    if (s.service_3_icon) document.getElementById('service3Icon').className = s.service_3_icon;
    if (s.service_3_title) document.getElementById('service3Title').textContent = s.service_3_title;
    if (s.service_3_desc) document.getElementById('service3Desc').textContent = s.service_3_desc;

    // Albümler ve Galeri
    if (s.gallery_subtitle) document.getElementById('gallerySubtitle').textContent = s.gallery_subtitle;
    if (s.gallery_title) document.getElementById('galleryTitle').textContent = s.gallery_title;
    if (s.gallery_desc) document.getElementById('galleryDesc').textContent = s.gallery_desc;

    const galleryGrid = document.getElementById('galleryGrid');
    if (galleryGrid && data.events && data.events.length > 0) {
        galleryGrid.innerHTML = '';
        data.events.forEach(event => {
            const card = document.createElement('a');
            card.href = 'javascript:void(0)';
            card.className = 'album-card';
            card.setAttribute('data-title', event.name);
            const validMedia = event.media ? event.media.filter(item => item && item.src && item.src.trim() !== '') : [];
            card.setAttribute('data-media', JSON.stringify(validMedia));

            // Tarih formatı (dd.mm.yyyy)
            let formattedDate = '';
            if (event.date) {
                const parts = event.date.split('-');
                if (parts.length === 3) {
                    formattedDate = `${parts[2]}.${parts[1]}.${parts[0]}`;
                } else {
                    formattedDate = event.date;
                }
            }

            const isVideoCover = event.cover_type === 'video';
            const coverHtml = isVideoCover 
                ? `<img src="Resimler/WhatsApp Image 2026-07-11 at 18.51.46 (3).jpeg" alt="${event.name}"><div class="album-badge"><i class="fa-solid fa-play"></i> Video Kapak</div>`
                : `<img src="${optimizeImageUrl(event.cover_path)}" alt="${event.name}" loading="lazy">`;

            card.innerHTML = `
                <div class="album-cover">
                    ${coverHtml}
                    <div class="album-overlay">
                        <span class="album-btn">Albüme Göz At <i class="fa-solid fa-folder-open"></i></span>
                    </div>
                </div>
                <div class="album-info">
                    <h3>${event.name}</h3>
                    <div class="album-meta">
                        <span class="album-category">${event.category_name}</span>
                        ${formattedDate ? `<span class="album-date">${formattedDate}</span>` : ''}
                    </div>
                    <div class="album-action">
                        <span class="album-link-text">Fotoğrafları Gör <i class="fa-solid fa-chevron-right" style="margin-left: 5px; font-size: 0.75rem;"></i></span>
                        <span style="font-size: 0.8rem; color: var(--color-text-muted);"><i class="fa-solid fa-images" style="margin-right: 3px;"></i> ${validMedia.length} Medya</span>
                    </div>
                </div>
            `;
            galleryGrid.appendChild(card);
        });
    }

    // İstatistikler
    if (s.stats_1_num) document.getElementById('stats1Num').textContent = s.stats_1_num;
    if (s.stats_1_label) document.getElementById('stats1Label').textContent = s.stats_1_label;
    if (s.stats_2_num) document.getElementById('stats2Num').textContent = s.stats_2_num;
    if (s.stats_2_label) document.getElementById('stats2Label').textContent = s.stats_2_label;
    if (s.stats_3_num) document.getElementById('stats3Num').textContent = s.stats_3_num;
    if (s.stats_3_label) document.getElementById('stats3Label').textContent = s.stats_3_label;
    if (s.stats_4_num) document.getElementById('stats4Num').textContent = s.stats_4_num;
    if (s.stats_4_label) document.getElementById('stats4Label').textContent = s.stats_4_label;

    // İletişim
    if (s.contact_subtitle) document.getElementById('contactSubtitle').textContent = s.contact_subtitle;
    if (s.contact_title) document.getElementById('contactTitle').textContent = s.contact_title;
    if (s.contact_desc) document.getElementById('contactDesc').textContent = s.contact_desc;
    if (s.contact_address) document.getElementById('contactAddress').textContent = s.contact_address;
    if (s.contact_phone) {
        document.getElementById('contactPhone').textContent = s.contact_phone;
        const cleanPhone = s.contact_phone.replace(/[^0-9+]/g, '');
        document.getElementById('contactPhoneLink').setAttribute('href', `tel:${cleanPhone}`);
    }
    if (s.contact_email) {
        document.getElementById('contactEmail').textContent = s.contact_email;
        document.getElementById('contactEmailLink').setAttribute('href', `mailto:${s.contact_email}`);
    }
    if (s.contact_instagram) document.getElementById('contactInstagram').setAttribute('href', s.contact_instagram);
    if (s.contact_facebook) document.getElementById('contactFacebook').setAttribute('href', s.contact_facebook);
    if (s.contact_youtube) document.getElementById('contactYoutube').setAttribute('href', s.contact_youtube);

    // Footer
    if (s.footer_tagline) document.getElementById('footerTagline').textContent = s.footer_tagline;

    // SEO için Dinamik Schema.org Yapılandırılmış Veri (JSON-LD) Enjeksiyonu
    let schemaScript = document.getElementById('seoSchema');
    if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'seoSchema';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
    }
    
    const cleanPhone = s.contact_phone ? s.contact_phone.replace(/[^0-9+]/g, '') : '';
    
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "EventVenue",
        "name": s.logo_title ? `${s.logo_title} ${s.logo_subtitle || ''}` : "Mercan Düğün & Davet",
        "description": s.site_desc || "",
        "image": s.about_img_1 || s.hero_slide_1 || "",
        "telephone": cleanPhone,
        "email": s.contact_email || "",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": s.contact_address || "",
            "addressCountry": "TR"
        },
        "url": window.location.origin
    };
    schemaScript.text = JSON.stringify(schemaData);
}

// UI Bileşenleri (Slider, Lightbox vb.) İlklendirme
function initializeUiComponents(siteData) {
    /* ==========================================
       1. YAPISKAN (STICKY) HEADER
       ========================================== */
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==========================================
       2. MOBİL MENÜ TETİKLEYİCİ
       ========================================== */
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    /* ==========================================
       3. HERO SLIDER (GÖRSEL GEÇİŞLERİ)
       ========================================== */
    const slides = document.querySelectorAll('.hero-slider .slide');
    const dots = document.querySelectorAll('.slider-controls .slider-dot');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        if (slides.length === 0) return;
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        if (dots[index]) dots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        if (slides.length === 0) return;
        let next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    function startSlideShow() {
        if (slides.length > 1) {
            slideInterval = setInterval(nextSlide, 5000);
        }
    }

    function stopSlideShow() {
        clearInterval(slideInterval);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopSlideShow();
            showSlide(index);
            startSlideShow();
        });
    });

    if (slides.length > 0) {
        startSlideShow();
    }

    /* ==========================================
       4. EKRANA GİRİŞ ANİMASYONLARI (SCROLL REVEAL)
       ========================================== */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    /* ==========================================
       TANITIM VİDEOSU OYNATMA KONTROLÜ
       ========================================== */
    const playTourBtn = document.getElementById('playTourBtn');
    const videoCover = document.getElementById('videoCover');
    const tourVideo = document.getElementById('tourVideo');

    if (playTourBtn && videoCover && tourVideo) {
        playTourBtn.addEventListener('click', () => {
            videoCover.classList.add('hidden');
            tourVideo.play();
        });
    }

    /* ==========================================
       5. AKTİF SAYFA LİNKİ GÜNCELLEME (SCROLLSPY)
       ========================================== */
    const sections = document.querySelectorAll('section[id]');

    function scrollSpy() {
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.add('active');
            } else {
                document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', scrollSpy);

    /* ==========================================
       6. ETKİLEŞİMLİ RESİM GALERİSİ (LIGHTBOX / ALBÜM)
       ========================================== */
    const albumCards = document.querySelectorAll('.album-card');
    const lightbox = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxVideo = document.getElementById('lightboxVideo');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    
    let activeImageIndex = 0;
    let galleryImagesData = [];

    // Albüm Kartları Tıklama Olayları
    if (albumCards.length > 0) {
        albumCards.forEach(card => {
            card.addEventListener('click', () => {
                const albumTitle = card.getAttribute('data-title');
                const rawMedia = card.getAttribute('data-media');
                
                try {
                    const parsedMedia = JSON.parse(rawMedia);
                    if (parsedMedia && parsedMedia.length > 0) {
                        galleryImagesData = parsedMedia
                            .filter(item => item && item.src && item.src.trim() !== '')
                            .map(item => ({
                                src: item.type === 'video' ? item.src : optimizeImageUrl(item.src),
                                alt: item.caption && item.caption.trim() !== '' ? item.caption : albumTitle,
                                type: item.type || 'image'
                            }));
                        
                        activeImageIndex = 0;
                        openLightbox();
                    }
                } catch (e) {
                    console.error("Albüm verisi okunamadı:", e);
                }
            });
        });
    }

    function openLightbox() {
        if (galleryImagesData.length === 0) return;
        updateLightboxImage();
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
        
        if (lightboxVideo) {
            lightboxVideo.pause();
            lightboxVideo.src = '';
            lightboxVideo.style.display = 'none';
        }

        const oldIframe = document.getElementById('lightboxIframe');
        if (oldIframe) {
            oldIframe.remove();
        }
    }

    function updateLightboxImage() {
        const data = galleryImagesData[activeImageIndex];
        if (!data) return;
        
        if (lightboxVideo) {
            lightboxVideo.pause();
            lightboxVideo.src = '';
            lightboxVideo.style.display = 'none';
        }

        const oldIframe = document.getElementById('lightboxIframe');
        if (oldIframe) {
            oldIframe.remove();
        }

        if (data.type === 'video') {
            if (lightboxImg) lightboxImg.style.display = 'none';
            
            // YouTube link kontrolü
            if (data.src.includes('youtube.com/') || data.src.includes('youtu.be/')) {
                const iframe = document.createElement('iframe');
                iframe.id = 'lightboxIframe';
                
                // Embed link formatı
                let embedUrl = data.src;
                if (data.src.includes('watch?v=')) {
                    embedUrl = data.src.replace('watch?v=', 'embed/');
                } else if (data.src.includes('youtu.be/')) {
                    embedUrl = data.src.replace('youtu.be/', 'youtube.com/embed/');
                }
                
                iframe.src = embedUrl;
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
                iframe.setAttribute('allowfullscreen', 'true');
                iframe.style.width = '100%';
                iframe.style.maxWidth = '800px';
                iframe.style.aspectRatio = '16/9';
                iframe.style.border = 'none';
                iframe.style.borderRadius = '8px';
                iframe.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
                
                const contentContainer = document.querySelector('.lightbox-content');
                if (lightboxCaption) {
                    contentContainer.insertBefore(iframe, lightboxCaption);
                } else {
                    contentContainer.appendChild(iframe);
                }
            } else {
                // Yerel video
                if (lightboxVideo) {
                    lightboxVideo.style.display = 'block';
                    lightboxVideo.src = data.src;
                    lightboxVideo.play().catch(err => console.log("Video oynatma engellendi: ", err));
                }
            }
        } else {
            if (lightboxVideo) lightboxVideo.style.display = 'none';
            if (lightboxImg) {
                lightboxImg.style.display = 'block';
                lightboxImg.style.opacity = 0;
                lightboxImg.src = data.src;
                setTimeout(() => {
                    lightboxImg.style.opacity = 1;
                }, 50);
            }
        }
        
        if (lightboxCaption) {
            lightboxCaption.textContent = data.alt;
        }
    }

    function showPrevImage() {
        if (galleryImagesData.length === 0) return;
        activeImageIndex = (activeImageIndex - 1 + galleryImagesData.length) % galleryImagesData.length;
        updateLightboxImage();
    }

    function showNextImage() {
        if (galleryImagesData.length === 0) return;
        activeImageIndex = (activeImageIndex + 1) % galleryImagesData.length;
        updateLightboxImage();
    }

    if (lightbox) {
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', showPrevImage);
        lightboxNext.addEventListener('click', showNextImage);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'ArrowRight') showNextImage();
        });
    }

    /* ==========================================
       7. TEKLİF FORMU GÖNDERİMİ (WEB3FORMS / NETLIFY)
       ========================================== */
    const offerForm = document.getElementById('offerForm');
    const formStatus = document.getElementById('formStatus');

    if (offerForm) {
        const dateInput = document.getElementById('eventDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }

        offerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = document.getElementById('email');
            if (emailInput && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
                formStatus.style.display = 'block';
                formStatus.className = 'form-status error';
                formStatus.innerHTML = 'Lütfen geçerli bir e-posta adresi girin.';
                return;
            }
            
            const submitBtn = offerForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Gönderiliyor... <i class="fa-solid fa-spinner fa-spin" style="margin-left: 8px;"></i>';

            formStatus.style.display = 'block';
            formStatus.className = 'form-status';
            formStatus.innerHTML = 'Teklif talebiniz iletiliyor, lütfen bekleyin...';

            const formData = new FormData(offerForm);
            
            // Web3Forms API Endpoint'i (Sunucusuz statik e-posta formu)
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    formStatus.className = 'form-status success';
                    formStatus.innerHTML = 'Teklif talebiniz başarıyla gönderildi! Sizinle en kısa sürede iletişime geçeceğiz.';
                    offerForm.reset();
                } else {
                    formStatus.className = 'form-status error';
                    formStatus.innerHTML = data.message || 'Gönderim sırasında bir hata oluştu. Lütfen tekrar deneyin.';
                }
                
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;

                setTimeout(() => {
                    formStatus.style.display = 'none';
                    formStatus.className = 'form-status';
                }, 8000);
            })
            .catch(error => {
                console.error("Form gönderme hatası:", error);
                formStatus.className = 'form-status error';
                formStatus.innerHTML = 'Bağlantı hatası! Lütfen internet bağlantınızı kontrol edip tekrar deneyin.';
                
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            });
        });
    }

    /* ==========================================
       VENUE GALLERY SLIDER (BOŞ SALON GEÇİŞLERİ)
       ========================================== */
    const venueSlides = document.querySelectorAll('.venue-slider .venue-slide');
    const venueDots = document.querySelectorAll('.venue-slider-controls .venue-dot');
    let currentVenueSlide = 0;
    let venueSlideInterval;

    function showVenueSlide(index) {
        if (venueSlides.length === 0) return;
        venueSlides.forEach(slide => slide.classList.remove('active'));
        venueDots.forEach(dot => dot.classList.remove('active'));
        
        venueSlides[index].classList.add('active');
        if (venueDots[index]) venueDots[index].classList.add('active');
        currentVenueSlide = index;
    }

    function nextVenueSlide() {
        if (venueSlides.length === 0) return;
        let next = (currentVenueSlide + 1) % venueSlides.length;
        showVenueSlide(next);
    }

    function startVenueSlideShow() {
        if (venueSlides.length > 1) {
            venueSlideInterval = setInterval(nextVenueSlide, 4000);
        }
    }

    function stopVenueSlideShow() {
        clearInterval(venueSlideInterval);
    }

    venueDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopVenueSlideShow();
            showVenueSlide(index);
            startVenueSlideShow();
        });
    });

    if (venueSlides.length > 0) {
        startVenueSlideShow();
    }
}
