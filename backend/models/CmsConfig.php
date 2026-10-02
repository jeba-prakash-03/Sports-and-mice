<?php
// backend/models/CmsConfig.php

class CmsConfig {
    // Matches MAX_NAV_ITEMS in frontend/src/context/EditorContext.jsx — keep both in sync.
    const MAX_NAV_ITEMS = 7;

    private $db;
    private $publishedFile;
    private $draftFile;
    private $defaultConfigFile;
    private $versionsFile;

    public function __construct($db = null) {
        $this->db = $db;
        $this->publishedFile = __DIR__ . '/../data/site_config.json';
        $this->draftFile = __DIR__ . '/../data/draft_config.json';
        $this->defaultConfigFile = __DIR__ . '/../data/default_config.json';
        $this->versionsFile = __DIR__ . '/../data/content_versions.json';

        $this->ensureInitialized();
    }

    public function getDefaultConfig() {
        return [
            'version' => 1,
            'last_published_at' => date('Y-m-d H:i:s'),
            'last_saved_at' => date('Y-m-d H:i:s'),
            'has_unpublished_changes' => false,

            // Theme Customizer
            'theme' => [
                'primary_color' => '#ff0000',
                'primary_hover' => '#e60000',
                'secondary_color' => '#106cc2',
                'accent_color' => '#ff6b6b',
                'dark_bg' => '#1f242d',
                'card_bg' => '#faf5fa',
                'card_border' => '#ede4ed',
                'text_primary' => '#222222',
                'text_secondary' => '#555555',
                'font_family' => "'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif",
                'border_radius' => '8px',
                'button_border_radius' => '50px'
            ],

            // Global & Section Animation Settings
            'animations' => [
                'enabled' => true,
                'default_type' => 'up', // 'up', 'down', 'left', 'right', 'fade', 'zoom'
                'default_duration' => 0.55,
                'default_delay' => 0.1,
                'stagger_children' => true,
                'page_transition' => 'fade', // 'fade', 'slide', 'none'
                'card_hover' => 'lift', // 'lift', 'glow', 'zoom', 'none'
                'reduced_motion_support' => true,
                // Per section animation overrides
                'sections' => [
                    'home_hero' => ['type' => 'up', 'duration' => 0.6, 'delay' => 0.1],
                    'home_stats' => ['type' => 'fade', 'duration' => 0.5, 'delay' => 0.1],
                    'home_cards' => ['type' => 'up', 'duration' => 0.5, 'delay' => 0.15],
                    'home_trust' => ['type' => 'up', 'duration' => 0.5, 'delay' => 0.1],
                    'home_video' => ['type' => 'right', 'duration' => 0.6, 'delay' => 0.2],
                    'service_hero' => ['type' => 'up', 'duration' => 0.5, 'delay' => 0.1],
                    'service_cards' => ['type' => 'up', 'duration' => 0.5, 'delay' => 0.15],
                    'service_workflow' => ['type' => 'up', 'duration' => 0.5, 'delay' => 0.2],
                    'about_hero' => ['type' => 'up', 'duration' => 0.5, 'delay' => 0.1],
                    'about_story' => ['type' => 'right', 'duration' => 0.6, 'delay' => 0.15],
                    'about_travel' => ['type' => 'up', 'duration' => 0.5, 'delay' => 0.2],
                    'hotels_hero' => ['type' => 'up', 'duration' => 0.5, 'delay' => 0.1],
                    'hotels_tours' => ['type' => 'up', 'duration' => 0.5, 'delay' => 0.15],
                    'contact_hero' => ['type' => 'up', 'duration' => 0.5, 'delay' => 0.1],
                    'contact_form' => ['type' => 'left', 'duration' => 0.55, 'delay' => 0.2]
                ]
            ],

            // Header & Navigation Configuration
            'header' => [
                'logo_url' => '/assets/images/logo.png',
                'brand_title' => 'Sports & MICE',
                'sticky' => true,
                'show_language_selector' => true,
                'nav_items' => [
                    ['id' => 'nav_home', 'name_en' => 'Home', 'name_de' => 'Startseite', 'path' => '/', 'enabled' => true, 'order' => 1],
                    ['id' => 'nav_service', 'name_en' => 'Service', 'name_de' => 'Dienstleistung', 'path' => '/en/Service/', 'enabled' => true, 'order' => 2],
                    ['id' => 'nav_about', 'name_en' => 'About us', 'name_de' => 'Über uns', 'path' => '/en/About-us/', 'enabled' => true, 'order' => 3],
                    ['id' => 'nav_hotels', 'name_en' => 'Hotels & more', 'name_de' => 'Hotels & mehr', 'path' => '/en/Hotels-more/', 'enabled' => true, 'order' => 4],
                    ['id' => 'nav_contact', 'name_en' => 'Contact', 'name_de' => 'Kontakt', 'path' => '/en/Contact/', 'enabled' => true, 'order' => 5]
                ]
            ],

            // Footer Configuration
            'footer' => [
                'company_name' => 'K-Consulting Sports & MICE',
                'street' => 'Fritz-Pullig-Strasse 9',
                'city_country_en' => "53757 Sankt Augustin\nGermany",
                'city_country_de' => "53757 Sankt Augustin\nDeutschland",
                'phone' => '+49 2241 343320',
                'fax' => '+49 2241 344316',
                'email' => 'contact@sportsandmice.com',
                'whatsapp' => '',
                'business_hours' => '',
                'copyright_text' => '© 2026 www.Sportsandmice.Com',
                'social_links' => [
                    ['platform' => 'LinkedIn', 'url' => 'https://linkedin.com', 'enabled' => true],
                    ['platform' => 'YouTube', 'url' => 'https://youtube.com', 'enabled' => true],
                    ['platform' => 'Instagram', 'url' => 'https://instagram.com', 'enabled' => false]
                ]
            ],

            // Page Metadata & Settings
            'pages' => [
                'home' => [
                    'id' => 'home',
                    'title' => 'Home',
                    'seo_title' => 'Sports & MICE | K-Consulting - Sports Travel & Conferences',
                    'seo_description' => 'Sport needs professional structures when traveling to competitions, team building and conferences around the world.',
                    'hero_bg_image' => '/assets/images/home_hero_bg.jpg',
                    'enabled' => true
                ],
                'service' => [
                    'id' => 'service',
                    'title' => 'Service',
                    'seo_title' => 'MICE & Sports Services | Sports & MICE',
                    'seo_description' => 'Comprehensive MICE services for sports associations, team trips, congresses, and hotel scouting.',
                    'hero_bg_image' => '/assets/images/service_hero_bg.jpg',
                    'enabled' => true
                ],
                'about' => [
                    'id' => 'about',
                    'title' => 'About Us',
                    'seo_title' => 'About Marc Knuelle & Sports & MICE Team',
                    'seo_description' => 'Learn about Marc Knuelle, international field hockey referee and founder of K-Consulting Sports & MICE.',
                    'hero_bg_image' => '/assets/images/about_hero_bg.jpg',
                    'enabled' => true
                ],
                'hotels' => [
                    'id' => 'hotels',
                    'title' => 'Hotels & More',
                    'seo_title' => 'Hotel Inspection Tours | Sports & MICE',
                    'seo_description' => 'On-site hotel inspections and scouting tours across Cancún, Dubai, Kenya, USA, Brazil, Japan.',
                    'hero_bg_image' => '/assets/images/hotels_hero_bg.jpg',
                    'enabled' => true
                ],
                'contact' => [
                    'id' => 'contact',
                    'title' => 'Contact',
                    'seo_title' => 'Contact Us | Sports & MICE K-Consulting',
                    'seo_description' => 'Get in touch with K-Consulting Sports & MICE for your next team trip or conference inquiry.',
                    'hero_bg_image' => '/assets/images/contact_hero_bg.jpg',
                    'enabled' => true
                ],
                'imprint' => [
                    'id' => 'imprint',
                    'title' => 'Imprint & Privacy',
                    'seo_title' => 'Imprint & Data Protection | Sports & MICE',
                    'seo_description' => 'Legal imprint and GDPR data protection regulations for K-Consulting Sports & MICE.',
                    'hero_bg_image' => '/assets/images/home_hero_bg.jpg',
                    'enabled' => true
                ]
            ],

            // Section Configurations per Page (Titles, Subtitles, Ordering, Visibility, Backgrounds, Images)
            'sections' => [
                'home' => [
                    [
                        'id' => 'home_hero',
                        'type' => 'hero',
                        'name' => 'Hero Banner Section',
                        'heading_prefix_en' => 'Sports associations &',
                        'heading_prefix_de' => 'Sportverbände &',
                        'tag1_en' => 'Meetings ♢ Incentives',
                        'tag1_de' => 'Besprechungen ♢ Teambildung',
                        'tag2_en' => 'Conferences ♢ Events',
                        'tag2_de' => 'Konferenzen ♢ Veranstaltungen',
                        'subtitle_en' => 'Sport needs professional structures when traveling to competitions, team building and conferences around the world',
                        'subtitle_de' => 'Der Sport braucht professionelle Strukturen bei Reisen zu Wettkämpfen, Teambildung und Konferenzen weltweit',
                        'bg_image' => '/assets/images/home_hero_bg.jpg',
                        'cta_button_text_en' => 'Get Free Consultation',
                        'cta_button_text_de' => 'Kostenlose Beratung anfragen',
                        'cta_button_link' => '/en/Contact/',
                        'cta_button_enabled' => true,
                        'enabled' => true,
                        'order' => 1
                    ],
                    [
                        'id' => 'home_intro',
                        'type' => 'home_intro',
                        'name' => 'Introductory Explanation',
                        'title_en' => 'Sport needs professional structures when traveling to competitions, team building and conferences around the world',
                        'title_de' => 'Der Sport braucht professionelle Strukturen bei Reisen zu Wettkämpfen, Teambildung und Konferenzen weltweit',
                        'p1_en' => 'Be it at competitions or team building of the national teams or at conferences, events or meetings of sports associations, the focus must always be on sport and its further development.',
                        'p1_de' => 'Sei es bei Wettkämpfen oder Teambildungen der Nationalmannschaften oder bei Konferenzen, Veranstaltungen oder Besprechungen der Sportverbände, der Sport und seine Weiterentwicklung müssen immer im Mittelpunkt stehen.',
                        'p2_en' => 'It is particularly important that the infrastructure suits the needs to the attendees. Hotels need to be able to deal with the needs of sports teams, team building activities have to meet the special demands of athletes and conference rooms should suit active athletic participants.',
                        'p2_de' => 'So ist es besonders wichtig, dass die Infrastruktur stimmig ist. Hotels müssen mit Sportmannschaften umgehen können, Teambildungsaktivitäten den besonderen Ansprüchen der Sportler:innen entsprechen, Konferenzräume zu den aktiven sportlichen Teilnehmer:innen passen.',
                        'p3_en' => 'For events to be successful, the environment must also be suit the sporting characteristics of the customer.',
                        'p3_de' => 'Zum Gelingen von Veranstaltungen muss auch das Umfeld zu den sportlichen Eigenschaften der Kunden passen.',
                        'enabled' => true,
                        'order' => 2
                    ],
                    [
                        'id' => 'home_cards',
                        'type' => 'cards',
                        'name' => 'Together for Success - 3 Pillars',
                        'title_en' => 'Together for success! Travel and meet like the pros!',
                        'title_de' => 'Gemeinsam zum Erfolg! Reisen und Tagen wie die Profis!',
                        'cards' => [
                            [
                                'num' => '01',
                                'title_en' => 'HOTELS',
                                'title_de' => 'HOTELS',
                                'desc_en' => 'We find the right hotels around the globe for the needs of your sports team. The security and facilities of hotels play a major role, as well as good connections to the competition site and an environment suitable for athletes.',
                                'desc_de' => 'Wir finden für die Bedürfnisse Ihrer Sportmannschaft die richtigen Hotels rund um den Globus. Dabei spielen die Sicherheit und die Ausstattung der Hotels eine große Rolle, sowie gute Verbindungen zum Wettkampfort und ein für Sportler:innen passendes Umfeld.'
                            ],
                            [
                                'num' => '02',
                                'title_en' => 'CONFERENCES',
                                'title_de' => 'KONFERENZEN',
                                'desc_en' => 'For meetings, conferences, seminars and events, we will find the right venue for you that suits your athletic participants. This also includes an environment with attractive offers and events.',
                                'desc_de' => 'Für die Besprechungen, Konferenzen, Seminare und Veranstaltungen finden wir für Sie den passenden Veranstaltungsort, der zu Ihren sportlichen Teilnehmenden passt. Dazu gehört auch ein Umfeld mit attraktiven Angeboten und Events.'
                            ],
                            [
                                'num' => '03',
                                'title_en' => 'INCENTIVES',
                                'title_de' => 'TEAMBILDUNG',
                                'desc_en' => 'Whether the national team or the board of directors of the sports association, we will find a suitable motivating and extraordinary activity for you, which will weld you together even more so that you can celebrate successes together.',
                                'desc_de' => 'Ob die Nationalmannschaft oder der Vorstand des Sportverbandes, wir finden für Sie eine passende motivierende und außergewöhnliche Aktivität, die Sie noch enger zusammenschweißt, um gemeinsam Erfolge zu feiern. Langeweile ist uns fremd!'
                            ]
                        ],
                        'enabled' => true,
                        'order' => 3
                    ],
                    [
                        'id' => 'home_expertise',
                        'type' => 'expertise',
                        'name' => 'Expertise for Sporting Success',
                        'title_en' => 'Use our expertise for your sporting success!',
                        'title_de' => 'Nutzen Sie unsere Expertise für Ihren sportlichen Erfolg!',
                        'p1_en' => 'Unlike large companies, sports associations usually do not have their own department specializing in trips to competitions for national teams or sports officials to conferences.',
                        'p1_de' => 'Anders als große Unternehmen haben Sportverbände in der Regel keine eigene Abteilung, die sich nur um die Reisen zu Wettkämpfen der Nationalmannschaften oder der Sportfunktionäre zu Tagungen kümmert.',
                        'p2_en' => 'We take care of the search for the right team hotel for you, organize transport from the airport and to the competition venue, or find the right team building activity.',
                        'p2_de' => 'Wir übernehmen für Sie die Suche des passenden Mannschaftshotels ab, organisieren auf Wunsch den Transport vom Flughafen wie auch zur Wettkampfstätte oder finden die richtige Teambildungsaktivität.',
                        'p3_en' => 'We will look for suitable conference options for your conferences and meetings that suit your sports officials and their needs.',
                        'p3_de' => 'Wir suchen passende Tagungsmöglichkeiten für Ihre Konferenzen und Besprechungen, die zu Ihren Sportfunktionären passen.',
                        'p4_en' => 'We will only propose conference locations with access to suitable sporting facilities. With our many years of experience, we will find exactly the right thing for you.',
                        'p4_de' => 'Keine Konferenzorte ohne sportliches Angebot. Mit unseren langjährigen Erfahrungen werden wir genau das Richtige für Sie finden.',
                        'enabled' => true,
                        'order' => 4
                    ],
                    [
                        'id' => 'home_video',
                        'type' => 'video',
                        'name' => 'International High-Performance Sport Video',
                        'title_en' => 'Our own experiences in international high-performance sport make us experts!',
                        'title_de' => 'Eigene Erfahrungen im internationalen Hochleistungssport machen uns zu Experten!',
                        'video_url' => 'https://www.youtube.com/embed/dD_FThvzO9I?start=76&controls=1',
                        'p1_en' => 'In order to understand the needs of customers from top-class sport, a MICE co-ordinator needs to have had their own experiences at that level.',
                        'p1_de' => 'Um Kunden aus dem Spitzensport verstehen zu können, sollte man eigene Erfahrungen gemacht haben.',
                        'p2_en' => 'How do you know what it means when a sports team competes and travels abroad? What is important to sports officials at conferences? What are their special requirements?',
                        'p2_de' => 'Was bedeutet es, wenn eine Sportmannschaft zu einem Wettkampf reist oder man selbst an einem Wettkampf teilnimmt? Was ist den Sportfunktionären bei Tagungen wichtig? Was sind die besonderen Ansprüche?',
                        'p3_en' => 'We know the answers because we have seen it ourselves!',
                        'p3_de' => 'Wir kennen die Antworten, denn wir haben es selbst erlebt!',
                        'about_link_text_en' => 'See further details in our About Us section.',
                        'about_link_text_de' => 'Erfahren Sie mehr in unserem Bereich Über uns.',
                        'about_link_url' => '/en/About-us/',
                        'enabled' => true,
                        'order' => 5
                    ],
                    [
                        'id' => 'home_contact_cta',
                        'type' => 'cta',
                        'name' => 'Contact Call to Action',
                        'title_en' => 'Write to us with your request!',
                        'title_de' => 'Kontaktieren Sie uns!',
                        'subtitle_en' => 'Contact us today for professional team travel, meetings, and conferences.',
                        'subtitle_de' => 'Schreiben Sie uns Ihr Anliegen, wir melden uns bei Ihnen.',
                        'button_text_en' => 'Contact Us',
                        'button_text_de' => 'Kontaktformular',
                        'button_link' => '/en/Contact/',
                        'bg_image' => '/assets/images/service_cta_bg.jpg',
                        'enabled' => true,
                        'order' => 6
                    ]
                ],
                'service' => [
                    [
                        'id' => 'service_hero_video',
                        'type' => 'service_hero',
                        'name' => 'Service Video Showcase',
                        'title_en' => 'Service',
                        'title_de' => 'Dienstleistung',
                        'video_url' => 'https://www.youtube.com/embed/aXREXtsXonE?controls=1',
                        'bg_image' => '/assets/images/service_hero_bg.jpg',
                        'enabled' => true,
                        'order' => 1
                    ],
                    [
                        'id' => 'service_intro',
                        'type' => 'text_block',
                        'name' => 'Service Introduction Text',
                        'enabled' => true,
                        'order' => 2,
                        'title_en' => 'With our commitment we support your sporting success!',
                        'title_de' => 'Mit unserem Engagement unterstützen wir Ihren sportlichen Erfolg!',
                        'p1_en' => 'Our team ensures the right selection of venues and hotels for your MICE activities. Sports teams and sports officials have special requirements, which guide us in our recommendations for you.',
                        'p1_de' => 'Unser Team sorgt für die richtige Auswahl von Venues und Hotels für Ihre MICE-Aktivitäten.',
                        'p2_en' => 'When selecting hotels, we ensure that they are suitable for sports teams and that they have staff who are familiar with dealing with sports teams. Our targeted advice to the selected hotel ensures high-quality services for you. The facilities need to be right; the fitness center shouldn\'t be the smallest room in the hotel. We also value attractive running routes near the hotel.',
                        'p2_de' => 'Bei der Auswahl der Hotels achten wir darauf, dass diese für Sportmannschaften geeignet sind.',
                        'p3_en' => 'We make sure that you are in a good location and distance from the competition site and can ensure that transport is looked after. We check the conference facilities for meetings, seminars and assemblies that your teams or your sports officials need to meet your needs. It is our strength that we have made a picture for ourselves on site.',
                        'p3_de' => 'Wir sorgen dafür, dass Sie sich in guter Lage zur Wettkampfstätte befinden.'
                    ],
                    [
                        'id' => 'service_cards',
                        'type' => 'services',
                        'name' => 'Service Offerings Grid',
                        'enabled' => true,
                        'order' => 3,
                        'title_en' => 'The right answers to your needs',
                        'title_de' => 'Die passenden Antworten auf Ihre Bedürfnisse'
                    ],
                    [
                        'id' => 'service_cta',
                        'type' => 'cta',
                        'name' => 'Call to Action Banner',
                        'enabled' => true,
                        'order' => 4,
                        'title_en' => 'Write to us with your request!',
                        'title_de' => 'Schreiben Sie uns Ihr Anliegen!',
                        'button_text_en' => 'contact form',
                        'button_text_de' => 'Kontaktformular',
                        'button_link' => '/en/Contact/',
                        'bg_image' => '/assets/images/service_cta_bg.jpg'
                    ]
                ],
                'about' => [
                    [
                        'id' => 'about_hero',
                        'type' => 'hero',
                        'name' => 'About Hero Banner',
                        'enabled' => true,
                        'order' => 1,
                        'title_en' => 'About us',
                        'title_de' => 'Über uns',
                        'bg_image' => '/assets/images/about_hero_bg.jpg'
                    ],
                    [
                        'id' => 'about_story',
                        'type' => 'story',
                        'name' => 'High-Performance Sport Story',
                        'enabled' => true,
                        'order' => 2,
                        'title_en' => 'Active in high-performance sport',
                        'title_de' => 'Aktiv im Spitzensport',
                        'photo' => '/assets/images/about_hockey_referee.jpeg',
                        'p1_en' => 'Our founder, Marc Knuelle, has been an international referee in field hockey since 2000. In addition to three European championships, he has acted as a referee at many international tournaments on five continents. There are also countless trips around the world, during which he has accompanied national teams to their training camps. Participation in major sporting events and congresses rounds off Marc’s deep and broad insight into the world of high-performance sport and the MICE activities of the sports associations.',
                        'p1_de' => 'Unser Gründer Marc Knuelle ist seit 2000 internationaler Schiedsrichter im Feldhockey. Neben drei Europameisterschaften leitete er Spiele auf fünf Kontinenten.',
                        'p2_en' => 'As a referee, you learn early on to make decisions again and again and to take responsibility for mistakes. These clear ways of acting characterize our performance for customers. We will make sure that we deliver an experience that matches your expectations.',
                        'p2_de' => 'Als Schiedsrichter lernt man früh, immer wieder Entscheidungen zu treffen und Verantwortung zu übernehmen.',
                        'p3_en' => 'After organizing and holding many meetings of the referees at the national level, Marc founded K-Consulting Sports & MICE in 2015, which to this day supports sports associations in holding meetings and trips for national teams.',
                        'p3_de' => '2015 gründete Marc die K-Consulting Sports & MICE.'
                    ],
                    [
                        'id' => 'about_travel',
                        'type' => 'gallery',
                        'name' => 'World Traveler Destinations',
                        'enabled' => true,
                        'order' => 3,
                        'title_en' => 'World traveler - "Marco Polo" conquers the planet',
                        'title_de' => 'Weltreisender - "Marco Polo" erobert den Planeten'
                    ],
                    [
                        'id' => 'about_cta',
                        'type' => 'cta',
                        'name' => 'About Contact CTA',
                        'enabled' => true,
                        'order' => 4,
                        'title_en' => 'Write to us with your request!',
                        'title_de' => 'Schreiben Sie uns Ihr Anliegen!',
                        'button_text_en' => 'Contact Form',
                        'button_text_de' => 'Kontaktformular',
                        'button_link' => '/en/Contact/',
                        'bg_image' => '/assets/images/service_cta_bg.jpg'
                    ]
                ],
                'hotels' => [
                    [
                        'id' => 'hotels_hero',
                        'type' => 'hero',
                        'name' => 'Hotels Hero Banner',
                        'enabled' => true,
                        'order' => 1,
                        'title_en' => 'Hotels & more',
                        'title_de' => 'Hotels & mehr',
                        'bg_image' => '/assets/images/hotels_hero_bg.jpg'
                    ],
                    [
                        'id' => 'hotels_tours',
                        'type' => 'gallery',
                        'name' => 'Inspection Tours List',
                        'enabled' => true,
                        'order' => 2,
                        'title_en' => 'Hotels sights inspection tours',
                        'title_de' => 'Hotels sights inspection tours'
                    ],
                    [
                        'id' => 'hotels_upcoming',
                        'type' => 'upcoming',
                        'name' => 'Upcoming Destinations Banner',
                        'enabled' => true,
                        'order' => 3,
                        'title_en' => 'Next: Kenya – Mexico – USA – Brazil – Japan',
                        'title_de' => 'Next: Kenia – Mexiko – USA – Brasilien – Japan'
                    ],
                    [
                        'id' => 'hotels_cta',
                        'type' => 'cta',
                        'name' => 'Hotels Contact CTA',
                        'enabled' => true,
                        'order' => 4,
                        'title_en' => 'Write to us with your request!',
                        'title_de' => 'Schreiben Sie uns Ihr Anliegen!',
                        'button_text_en' => 'Contact Form',
                        'button_text_de' => 'Kontaktformular',
                        'button_link' => '/en/Contact/',
                        'bg_image' => '/assets/images/service_cta_bg.jpg'
                    ]
                ],
                'contact' => [
                    [
                        'id' => 'contact_hero',
                        'type' => 'hero',
                        'name' => 'Contact Hero Banner',
                        'enabled' => true,
                        'order' => 1,
                        'title_en' => 'Contact',
                        'title_de' => 'Kontakt',
                        'bg_image' => '/assets/images/contact_hero_bg.jpg'
                    ],
                    [
                        'id' => 'contact_form_section',
                        'type' => 'contact',
                        'name' => 'Interactive Contact Form & Info',
                        'enabled' => true,
                        'order' => 2,
                        'title_en' => 'contact form',
                        'title_de' => 'Kontaktformular',
                        'subtitle_en' => 'Write us your request, we will get in touch with you',
                        'subtitle_de' => 'Schreiben Sie uns Ihr Anliegen, wir melden uns bei Ihnen',
                        'team_sign_en' => 'Your K-Consulting Team Sports & MICE',
                    ]
                ]
            ],

            // Hero Carousel Slides — seeded with exactly one slide built from
            // this same default config's home_hero section fields, so
            // introducing this collection doesn't change what's currently
            // live. DynamicSectionRenderer renders a carousel only when more
            // than one active slide exists; one slide looks identical to the
            // previous single-hero-object behavior.
            'hero_slides' => [
                [
                    'id' => 'slide_1',
                    'bg_image' => '/assets/images/home_hero_bg.jpg',
                    'heading_prefix_en' => 'Sports associations &',
                    'heading_prefix_de' => 'Sportverbände &',
                    'tag1_en' => 'Meetings ♢ Incentives',
                    'tag1_de' => 'Besprechungen ♢ Teambildung',
                    'tag2_en' => 'Conferences ♢ Events',
                    'tag2_de' => 'Konferenzen ♢ Veranstaltungen',
                    'subtitle_en' => 'Sport needs professional structures when traveling to competitions, team building and conferences around the world',
                    'subtitle_de' => 'Der Sport braucht professionelle Strukturen bei Reisen zu Wettkämpfen, Teambildung und Konferenzen weltweit',
                    'cta_button_text_en' => 'Get Free Consultation',
                    'cta_button_text_de' => 'Kostenlose Beratung anfragen',
                    'cta_button_link' => '/en/Contact/',
                    'cta_button_enabled' => true,
                    'active' => true,
                    'order' => 1
                ]
            ],

            // Content Collections (Services CRUD)
            'services' => [
                [
                    'id' => 'svc_1',
                    'title_en' => 'Meetings and Conferences',
                    'title_de' => 'Meetings und Konferenzen',
                    'desc_en' => 'Conference rooms, state-of-the-art presentation technology, and quiet meeting atmosphere for sports executives.',
                    'desc_de' => 'Tagungsräume, moderne Präsentationstechnik und ruhige Tagungsatmosphäre für Sportfunktionäre.',
                    'image' => '/assets/images/service_meeting.jpg',
                    'link' => '/en/Contact/',
                    'order' => 1,
                    'active' => true
                ],
                [
                    'id' => 'svc_2',
                    'title_en' => 'Team building & Incentives',
                    'title_de' => 'Teambuilding & Incentives',
                    'desc_en' => 'Motivational group activities, athletic challenges, and bonding programs tailored to competitive spirits.',
                    'desc_de' => 'Motivierende Gruppenaktivitäten und Teambuilding-Programme für Teams.',
                    'image' => '/assets/images/service_teambuilding.png',
                    'link' => '/en/Contact/',
                    'order' => 2,
                    'active' => true
                ],
                [
                    'id' => 'svc_3',
                    'title_en' => 'Team trips and events',
                    'title_de' => 'Teamreisen und Events',
                    'desc_en' => 'Logistics, tailored nutrition, dedicated team floors, and proximity to competition facilities worldwide.',
                    'desc_de' => 'Logistik, gesunde Sportlerernährung und kurze Wege zu Wettkampfstätten.',
                    'image' => '/assets/images/service_teamtrips.jpeg',
                    'link' => '/en/Contact/',
                    'order' => 3,
                    'active' => true
                ],
                [
                    'id' => 'svc_4',
                    'title_en' => 'International sports congresses',
                    'title_de' => 'Internationale Sportkongresse',
                    'desc_en' => 'Host world-class congresses, annual general meetings, and sporting federations events seamlessly.',
                    'desc_de' => 'Austragung von Sportkongressen und Delegiertenversammlungen.',
                    'image' => '/assets/images/congress_icon.png',
                    'link' => '/en/Contact/',
                    'order' => 4,
                    'active' => true
                ]
            ],

            // Team / Founder CRUD
            'team' => [
                [
                    'id' => 'member_marc',
                    'name' => 'Marc Knuelle',
                    'role_en' => 'Founder & Managing Director',
                    'role_de' => 'Gründer & Geschäftsführer',
                    'designation' => 'International Field Hockey Referee since 2000',
                    'photo' => '/assets/images/about_hockey_referee.jpeg',
                    'bio_en' => 'Active referee at 3 European Championships and international tournaments across 5 continents.',
                    'bio_de' => 'Internationaler Schiedsrichter bei 3 Europameisterschaften und weltweiten Turnieren.',
                    'order' => 1,
                    'active' => true
                ]
            ],

            // Testimonials CRUD
            'testimonials' => [
                [
                    'id' => 'test_1',
                    'name' => 'National Hockey Delegation',
                    'role' => 'Team Manager',
                    'review' => 'K-Consulting provided flawless hotel selection and logistical execution for our international training camp.',
                    'rating' => 5,
                    'active' => true,
                    'order' => 1
                ],
                [
                    'id' => 'test_2',
                    'name' => 'European Sports Federation',
                    'role' => 'Congress Organizer',
                    'review' => 'The venue scouting in Cancún was outstanding. The facilities matched all athletic and conferencing needs perfectly.',
                    'rating' => 5,
                    'active' => true,
                    'order' => 2
                ]
            ],

            // FAQs CRUD
            'faqs' => [
                [
                    'id' => 'faq_1',
                    'question_en' => 'How does Sports & MICE select team hotels?',
                    'question_de' => 'Wie wählt Sports & MICE Teamhotels aus?',
                    'answer_en' => 'We personally inspect hotels on site to ensure they meet athletic dietary requirements, offer adequate gym/fitness facilities, have quiet team meeting rooms, and are located close to competition venues.',
                    'answer_de' => 'Wir besichtigen Hotels persönlich vor Ort, um sicherzustellen, dass gesunde Ernährung, Fitnessräume und ruhige Tagungsräume vorhanden sind.',
                    'order' => 1,
                    'active' => true
                ],
                [
                    'id' => 'faq_2',
                    'question_en' => 'Can you handle emergency travel changes for large delegations?',
                    'question_de' => 'Können kurzfristige Änderungen für Delegationen übernommen werden?',
                    'answer_en' => 'Yes, our 24/7 on-site and remote coordination team handles flight delays, schedule changes, luggage transfers, and room reallocations promptly.',
                    'answer_de' => 'Ja, unser 24/7 Koordinationsteam reagiert sofort auf Flugverschiebungen, Terminänderungen und Umbuchungen.',
                    'order' => 2,
                    'active' => true
                ],
                [
                    'id' => 'faq_3',
                    'question_en' => 'Do sports associations receive special group rates?',
                    'question_de' => 'Erhalten Sportverbände Sonderkonditionen?',
                    'answer_en' => 'Yes, we negotiate special association rates and flexible cancellation policies directly with vetted partner hotel chains.',
                    'answer_de' => 'Ja, wir verhandeln exklusive Verbandskonditionen und flexible Stornobedingungen direkt mit Partnerhotels.',
                    'order' => 3,
                    'active' => true
                ]
            ],

            // Gallery & Inspection Tours CRUD
            'gallery' => [
                [
                    'id' => 'tour_cancun',
                    'title' => 'Tour - Mexico - Cancún',
                    'hotel_name' => 'Hotel Fairmont Mayakoba "Riviera Maya"',
                    'location' => 'Cancún, Mexico',
                    'image' => '/assets/images/hotel_cancun.jpg',
                    'external_url' => 'https://www.fairmont.com/mayakoba-riviera-maya/',
                    'desc_en' => 'The Yucatán peninsula not only inspires with its breathtaking beaches, but also with its excellent hotel infrastructure. Meetings with a view of the sea or events on the beach are easily possible here.',
                    'desc_de' => 'Die Halbinsel Yucatán begeistert mit atemberaubenden Stränden und exzellenter Hotelinfrastruktur.',
                    'order' => 1,
                    'active' => true
                ],
                [
                    'id' => 'tour_dubai',
                    'title' => 'Tour - UAE - Dubai',
                    'hotel_name' => 'Sofitel The Palm Dubai',
                    'location' => 'Dubai, UAE',
                    'image' => '/assets/images/hotel_dubai.jpg',
                    'external_url' => 'https://www.sofitel-dubai-thepalm.com',
                    'desc_en' => 'Dubai is a year-round destination with extensive conference facilities. It offers a high level of security as well as a wide range of sports infrastructure.',
                    'desc_de' => 'Dubai ist eine ganzjährige Destination mit umfangreichen Konferenzeinrichtungen.',
                    'order' => 2,
                    'active' => true
                ],
                [
                    'id' => 'travel_havana',
                    'title' => 'Havana - Cuba',
                    'hotel_name' => 'Seaside Conference & Motivational Hub',
                    'location' => 'Havana, Cuba',
                    'image' => '/assets/images/about_havana.jpeg',
                    'external_url' => '',
                    'desc_en' => 'The Caribbean passion of sport, for meeting with a view of the sea and ideal for motivational trips.',
                    'desc_de' => 'Die karibische Leidenschaft des Sports, für Meetings mit Meerblick.',
                    'order' => 3,
                    'active' => true
                ],
                [
                    'id' => 'travel_beijing',
                    'title' => 'Beijing - China',
                    'hotel_name' => 'Olympic & Championship Venues',
                    'location' => 'Beijing, China',
                    'image' => '/assets/images/about_beijing.jpg',
                    'external_url' => '',
                    'desc_en' => 'A country where sport is very important - ideally suited for large sport competitions.',
                    'desc_de' => 'Ein Land, in dem Sport einen hohen Stellenwert hat.',
                    'order' => 4,
                    'active' => true
                ],
                [
                    'id' => 'travel_joburg',
                    'title' => 'Johannesburg - South Africa',
                    'hotel_name' => 'Sports & Wildlife Team Building Base',
                    'location' => 'Johannesburg, South Africa',
                    'image' => '/assets/images/about_johannesburg.jpg',
                    'external_url' => '',
                    'desc_en' => 'Ideal for sport thanks to its good hotels, good sports event infrastructure and great team building activities.',
                    'desc_de' => 'Ideal für Sport dank guter Hotels und Teambuilding-Aktivitäten.',
                    'order' => 5,
                    'active' => true
                ]
            ]
        ];
    }

    private function ensureInitialized() {
        $defaultConfig = $this->getDefaultConfig();
        file_put_contents($this->defaultConfigFile, json_encode($defaultConfig, JSON_PRETTY_PRINT));

        if (!file_exists($this->publishedFile) || filesize($this->publishedFile) < 10) {
            file_put_contents($this->publishedFile, json_encode($defaultConfig, JSON_PRETTY_PRINT));
        }

        if (!file_exists($this->draftFile) || filesize($this->draftFile) < 10) {
            file_put_contents($this->draftFile, json_encode($defaultConfig, JSON_PRETTY_PRINT));
        }

        if (!file_exists($this->versionsFile) || filesize($this->versionsFile) < 10) {
            $initialVersions = [
                [
                    'id' => 1,
                    'version_number' => 1,
                    'page_id' => 'global',
                    'status' => 'published',
                    'summary' => 'Initial Website Release (v1)',
                    'created_by' => 'system',
                    'created_at' => date('Y-m-d H:i:s'),
                    'published_at' => date('Y-m-d H:i:s')
                ]
            ];
            file_put_contents($this->versionsFile, json_encode($initialVersions, JSON_PRETTY_PRINT));
        }
    }

    public function getPublished() {
        if ($this->db instanceof PDO) {
            try {
                $stmt = $this->db->prepare("SELECT content_json FROM site_content WHERE section_key = 'published_config' LIMIT 1");
                $stmt->execute();
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($row && !empty($row['content_json'])) {
                    $data = is_string($row['content_json']) ? json_decode($row['content_json'], true) : $row['content_json'];
                    if ($data && (!empty($data['sections']) || !empty($data['pages']))) {
                        return $data;
                    }
                }
            } catch (Exception $e) {
                // fallback to file
            }
        }

        if (file_exists($this->publishedFile)) {
            $content = file_get_contents($this->publishedFile);
            $data = json_decode($content, true);
            if ($data) return $data;
        }
        return $this->getDefaultConfig();
    }

    public function getDraft() {
        if ($this->db instanceof PDO) {
            try {
                $stmt = $this->db->prepare("SELECT content_json FROM site_content WHERE section_key = 'draft_config' LIMIT 1");
                $stmt->execute();
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($row && !empty($row['content_json'])) {
                    $data = is_string($row['content_json']) ? json_decode($row['content_json'], true) : $row['content_json'];
                    if ($data && (!empty($data['sections']) || !empty($data['pages']))) {
                        return $data;
                    }
                }
            } catch (Exception $e) {
                // fallback to file
            }
        }

        if (file_exists($this->draftFile)) {
            $content = file_get_contents($this->draftFile);
            $data = json_decode($content, true);
            if ($data) return $data;
        }
        return $this->getPublished();
    }

    /**
     * Compute differences between draft and published configuration
     */
    public function calculateDiff($draft, $published) {
        $changesCount = 0;
        $summary = [];

        // 1. Sections diff
        $draftSections = $draft['sections'] ?? [];
        $pubSections = $published['sections'] ?? [];

        foreach ($draftSections as $pageKey => $pSecs) {
            $pubSecs = $pubSections[$pageKey] ?? [];
            if (count($pSecs) !== count($pubSecs)) {
                $diff = abs(count($pSecs) - count($pubSecs));
                $changesCount += $diff;
                $summary[] = "{$diff} section(s) added/removed on " . ucfirst($pageKey);
            } else {
                foreach ($pSecs as $idx => $s) {
                    $pubS = $pubSecs[$idx] ?? null;
                    if (!$pubS || json_encode($s) !== json_encode($pubS)) {
                        $changesCount++;
                        $secName = $s['name'] ?? $s['id'] ?? "Section #{$idx}";
                        $summary[] = "Modified {$secName} on " . ucfirst($pageKey);
                    }
                }
            }
        }

        // 2. Pages diff
        $draftPages = $draft['pages'] ?? [];
        $pubPages = $published['pages'] ?? [];
        if (count($draftPages) !== count($pubPages)) {
            $diff = abs(count($draftPages) - count($pubPages));
            $changesCount += $diff;
            $summary[] = "{$diff} page structure change(s)";
        }

        // 3. Header / Brand diff
        if (json_encode($draft['header'] ?? []) !== json_encode($published['header'] ?? [])) {
            $changesCount++;
            $summary[] = "Header & Navigation changes";
        }

        // 4. Footer diff
        if (json_encode($draft['footer'] ?? []) !== json_encode($published['footer'] ?? [])) {
            $changesCount++;
            $summary[] = "Footer & Contact details changes";
        }

        // 5. Theme & styling diff
        if (json_encode($draft['theme'] ?? []) !== json_encode($published['theme'] ?? [])) {
            $changesCount++;
            $summary[] = "Theme & Color palette changes";
        }

        return [
            'count' => $changesCount,
            'summary' => $summary
        ];
    }

    /**
     * Save changes ONLY to DRAFT.
     * The public website reads getPublished(), so it will NEVER see these draft edits
     * until publish() is explicitly called!
     */
    /**
     * Server-side guards mirroring the frontend checks in
     * src/utils/adminValidation.js and EditorContext.jsx's addNavItem —
     * never trust the client alone. Throws InvalidArgumentException with a
     * user-facing message; api/admin/config.php turns that into a 400.
     */
    private function validateIncomingConfig($newConfig) {
        if (isset($newConfig['header']['nav_items']) && is_array($newConfig['header']['nav_items'])) {
            if (count($newConfig['header']['nav_items']) > self::MAX_NAV_ITEMS) {
                throw new InvalidArgumentException('Maximum ' . self::MAX_NAV_ITEMS . ' navigation items are allowed.');
            }
        }
    }

    /**
     * Strips HTML/script tags and clamps runaway string lengths on every
     * string value in the incoming config, recursively. Defense in depth
     * against injected markup and UI-breaking walls of text — the specific
     * per-field length limits are enforced client-side (adminValidation.js);
     * this is just a broad backstop, not a replacement for those.
     */
    private function sanitizeConfigStrings($data, $maxLen = 5000) {
        if (is_array($data)) {
            $out = [];
            foreach ($data as $k => $v) {
                $out[$k] = $this->sanitizeConfigStrings($v, $maxLen);
            }
            return $out;
        }
        if (is_string($data)) {
            $clean = strip_tags($data);
            if (strlen($clean) > $maxLen) {
                $clean = substr($clean, 0, $maxLen);
            }
            return $clean;
        }
        return $data;
    }

    /**
     * Recursively merges $overrides into $base instead of blindly replacing
     * whole nested objects. Without this, saving a partial object for a
     * top-level key (e.g. {"footer": {"copyright_text": "x"}} to update just
     * one field) wiped out every sibling field of that key — a real, severe
     * data-loss bug confirmed in testing. Sequential (list-style) arrays are
     * still treated as a full replacement, since every caller that sends one
     * (nav_items, sections, card collections) already builds and sends the
     * complete array, not a sparse patch.
     */
    private function deepMerge($base, $overrides) {
        if (!is_array($overrides) || !is_array($base)) {
            return $overrides;
        }
        // empty() short-circuits here deliberately: an empty array has to be
        // treated as "replace with empty" (e.g. deleting the last social
        // link), not "merge nothing, keep the old list" — range(0, -1)
        // doesn't equal [] in PHP, so this edge case needs its own check.
        $isList = empty($overrides) || array_keys($overrides) === range(0, count($overrides) - 1);
        if ($isList) {
            return $overrides;
        }
        foreach ($overrides as $key => $value) {
            if (is_array($value) && isset($base[$key]) && is_array($base[$key])) {
                $base[$key] = $this->deepMerge($base[$key], $value);
            } else {
                $base[$key] = $value;
            }
        }
        return $base;
    }

    public function saveDraft($newConfig, $adminEmail = 'admin@sportsandmice.com') {
        $this->validateIncomingConfig($newConfig);
        $newConfig = $this->sanitizeConfigStrings($newConfig);

        $currentDraft = $this->getDraft();

        foreach ($newConfig as $key => $val) {
            if ($key === 'sections' && is_array($val)) {
                $currentDraft['sections'] = $val;
            } elseif (is_array($val) && isset($currentDraft[$key]) && is_array($currentDraft[$key])) {
                $currentDraft[$key] = $this->deepMerge($currentDraft[$key], $val);
            } else {
                $currentDraft[$key] = $val;
            }
        }

        $published = $this->getPublished();
        $diff = $this->calculateDiff($currentDraft, $published);

        $currentDraft['last_saved_at'] = date('Y-m-d H:i:s');
        $currentDraft['has_unpublished_changes'] = ($diff['count'] > 0);
        $currentDraft['draft_changes_count'] = $diff['count'];
        $currentDraft['draft_changes_summary'] = $diff['summary'];

        // Save ONLY to draftFile & DB draft! NEVER save to published!
        file_put_contents($this->draftFile, json_encode($currentDraft, JSON_PRETTY_PRINT));

        if ($this->db instanceof PDO) {
            try {
                $jsonStr = json_encode($currentDraft);
                $isPgsql = ($this->db->getAttribute(PDO::ATTR_DRIVER_NAME) === 'pgsql');
                if ($isPgsql) {
                    $stmt = $this->db->prepare("INSERT INTO site_content (section_key, content_json, updated_at) 
                        VALUES ('draft_config', ?::jsonb, NOW()) 
                        ON CONFLICT (section_key) DO UPDATE SET content_json = EXCLUDED.content_json, updated_at = NOW()");
                } else {
                    $stmt = $this->db->prepare("INSERT INTO site_content (section_key, content_json, updated_at) 
                        VALUES ('draft_config', ?, NOW()) 
                        ON DUPLICATE KEY UPDATE content_json = VALUES(content_json), updated_at = NOW()");
                }
                $stmt->execute([$jsonStr]);
            } catch (Exception $e) {
                // Silently fallback to JSON
            }
        }

        // Record draft version entry in database and content_versions.json
        $this->recordVersion(
            $currentDraft['version'] ?? 1,
            $currentDraft,
            'draft',
            "Draft updated with {$diff['count']} pending changes",
            $adminEmail
        );

        return $currentDraft;
    }

    /**
     * Publish draft to live website.
     * Atomically copies draft content to published file and increments live version number.
     */
    public function publish($adminEmail = 'admin@sportsandmice.com', $summary = null) {
        $draft = $this->getDraft();
        $published = $this->getPublished();

        $currentVersion = intval($published['version'] ?? 1);
        $newVersion = $currentVersion + 1;

        $draft['version'] = $newVersion;
        $draft['last_published_at'] = date('Y-m-d H:i:s');
        $draft['has_unpublished_changes'] = false;
        $draft['draft_changes_count'] = 0;
        $draft['draft_changes_summary'] = [];

        // Save to publishedFile and draftFile
        file_put_contents($this->publishedFile, json_encode($draft, JSON_PRETTY_PRINT));
        file_put_contents($this->draftFile, json_encode($draft, JSON_PRETTY_PRINT));

        // Save to DB (both published_config and draft_config)
        if ($this->db instanceof PDO) {
            try {
                $jsonStr = json_encode($draft);
                $isPgsql = ($this->db->getAttribute(PDO::ATTR_DRIVER_NAME) === 'pgsql');
                if ($isPgsql) {
                    $stmt = $this->db->prepare("INSERT INTO site_content (section_key, content_json, updated_at) 
                        VALUES ('published_config', ?::jsonb, NOW()) 
                        ON CONFLICT (section_key) DO UPDATE SET content_json = EXCLUDED.content_json, updated_at = NOW()");
                    $stmt->execute([$jsonStr]);

                    $stmtDraft = $this->db->prepare("INSERT INTO site_content (section_key, content_json, updated_at) 
                        VALUES ('draft_config', ?::jsonb, NOW()) 
                        ON CONFLICT (section_key) DO UPDATE SET content_json = EXCLUDED.content_json, updated_at = NOW()");
                    $stmtDraft->execute([$jsonStr]);
                } else {
                    $stmt = $this->db->prepare("INSERT INTO site_content (section_key, content_json, updated_at) 
                        VALUES ('published_config', ?, NOW()) 
                        ON DUPLICATE KEY UPDATE content_json = VALUES(content_json), updated_at = NOW()");
                    $stmt->execute([$jsonStr]);

                    $stmtDraft = $this->db->prepare("INSERT INTO site_content (section_key, content_json, updated_at) 
                        VALUES ('draft_config', ?, NOW()) 
                        ON DUPLICATE KEY UPDATE content_json = VALUES(content_json), updated_at = NOW()");
                    $stmtDraft->execute([$jsonStr]);
                }
            } catch (Exception $e) {
                // Silently fallback to JSON
            }
        }

        // Record published version
        $this->recordVersion(
            $newVersion,
            $draft,
            'published',
            $summary ?: "Version v{$newVersion} published live to website",
            $adminEmail
        );

        return $draft;
    }

    /**
     * Restore a previously-published version's content and publish it as a
     * new version (never destroys history — the restore itself becomes a
     * new version entry). Requires the full content snapshot, which is only
     * retained in the MySQL content_versions table (the JSON version log
     * only keeps a summary, not the content), so this needs a DB connection.
     */
    public function rollbackToVersion($versionNumber, $adminEmail = 'admin@sportsandmice.com') {
        if (!($this->db instanceof PDO)) {
            throw new Exception('Rollback requires a database connection (version content is not retained in JSON fallback storage).');
        }

        $stmt = $this->db->prepare("SELECT content FROM content_versions WHERE version_number = ? ORDER BY id DESC LIMIT 1");
        $stmt->execute([$versionNumber]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row || empty($row['content'])) {
            throw new Exception("Version {$versionNumber} was not found.");
        }

        $restoredContent = json_decode($row['content'], true);
        if (!$restoredContent) {
            throw new Exception("Version {$versionNumber} content could not be read.");
        }

        $published = $this->getPublished();
        $newVersion = intval($published['version'] ?? 1) + 1;

        $restoredContent['version'] = $newVersion;
        $restoredContent['last_published_at'] = date('Y-m-d H:i:s');
        $restoredContent['has_unpublished_changes'] = false;
        $restoredContent['draft_changes_count'] = 0;
        $restoredContent['draft_changes_summary'] = [];

        file_put_contents($this->publishedFile, json_encode($restoredContent, JSON_PRETTY_PRINT));
        file_put_contents($this->draftFile, json_encode($restoredContent, JSON_PRETTY_PRINT));

        try {
            $jsonStr = json_encode($restoredContent);
            $isPgsql = ($this->db->getAttribute(PDO::ATTR_DRIVER_NAME) === 'pgsql');
            $upsert = $isPgsql
                ? "INSERT INTO site_content (section_key, content_json, updated_at) VALUES (?, ?::jsonb, NOW()) ON CONFLICT (section_key) DO UPDATE SET content_json = EXCLUDED.content_json, updated_at = NOW()"
                : "INSERT INTO site_content (section_key, content_json, updated_at) VALUES (?, ?, NOW()) ON DUPLICATE KEY UPDATE content_json = VALUES(content_json), updated_at = NOW()";
            $stmt = $this->db->prepare($upsert);
            $stmt->execute(['published_config', $jsonStr]);
            $stmt->execute(['draft_config', $jsonStr]);
        } catch (Exception $e) {
            // Silently fallback to JSON (already written above)
        }

        $this->recordVersion(
            $newVersion,
            $restoredContent,
            'published',
            "Restored content from version v{$versionNumber}",
            $adminEmail
        );

        return $restoredContent;
    }

    public function resetToDefault($adminEmail = 'admin@sportsandmice.com') {
        $default = $this->getDefaultConfig();
        $default['version'] = ($this->getPublished()['version'] ?? 1) + 1;
        $default['last_published_at'] = date('Y-m-d H:i:s');
        $default['last_saved_at'] = date('Y-m-d H:i:s');
        $default['has_unpublished_changes'] = false;
        $default['draft_changes_count'] = 0;

        file_put_contents($this->publishedFile, json_encode($default, JSON_PRETTY_PRINT));
        file_put_contents($this->draftFile, json_encode($default, JSON_PRETTY_PRINT));

        $this->recordVersion(
            $default['version'],
            $default,
            'published',
            "Website reset to system default configuration",
            $adminEmail
        );

        return $default;
    }

    public function discardDraft() {
        $published = $this->getPublished();
        $published['has_unpublished_changes'] = false;
        $published['draft_changes_count'] = 0;
        $published['last_saved_at'] = date('Y-m-d H:i:s');

        file_put_contents($this->draftFile, json_encode($published, JSON_PRETTY_PRINT));
        return $published;
    }

    /**
     * Record version snapshot in database and JSON version log
     */
    public function recordVersion($versionNumber, $content, $status, $summary, $createdBy) {
        $entry = [
            'id' => time() . '_' . rand(100, 999),
            'version_number' => $versionNumber,
            'page_id' => 'global',
            'status' => $status,
            'summary' => $summary,
            'created_by' => $createdBy,
            'created_at' => date('Y-m-d H:i:s'),
            'published_at' => ($status === 'published' ? date('Y-m-d H:i:s') : null)
        ];

        // 1. Save to JSON log
        $versions = [];
        if (file_exists($this->versionsFile)) {
            $contentJson = file_get_contents($this->versionsFile);
            $versions = json_decode($contentJson, true) ?: [];
        }

        // Keep last 50 versions
        array_unshift($versions, $entry);
        if (count($versions) > 50) {
            $versions = array_slice($versions, 0, 50);
        }
        file_put_contents($this->versionsFile, json_encode($versions, JSON_PRETTY_PRINT));

        // 2. Save to MySQL database if available
        if ($this->db instanceof PDO) {
            try {
                $stmt = $this->db->prepare("INSERT INTO content_versions 
                    (version_number, page_id, content, status, summary, created_by, created_at, published_at) 
                    VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)");
                $publishedAt = ($status === 'published' ? date('Y-m-d H:i:s') : null);
                $stmt->execute([
                    $versionNumber,
                    'global',
                    json_encode($content),
                    $status,
                    $summary,
                    $createdBy,
                    $publishedAt
                ]);
            } catch (Exception $e) {
                // Silently fallback to JSON log
            }
        }

        // 3. Log to AuditLog for Recent Activity stream
        try {
            require_once __DIR__ . '/AuditLog.php';
            $audit = new AuditLog($this->db);
            $action = ($status === 'published') ? 'Version published' : 'Draft updated';
            $target = ($status === 'published') ? "v{$versionNumber}" : 'Website Content';
            $audit->log($createdBy, $action, $target, $summary);
        } catch (Exception $e) {
            // ignore
        }

        return $entry;
    }

    public function getVersions($limit = 10) {
        if ($this->db instanceof PDO) {
            try {
                $stmt = $this->db->prepare("SELECT id, version_number, page_id, status, summary, created_by, created_at, published_at 
                    FROM content_versions ORDER BY id DESC LIMIT ?");
                $stmt->bindValue(1, (int)$limit, PDO::PARAM_INT);
                $stmt->execute();
                $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
                if (!empty($rows)) {
                    return $rows;
                }
            } catch (Exception $e) {
                // fallback to file
            }
        }

        if (file_exists($this->versionsFile)) {
            $data = json_decode(file_get_contents($this->versionsFile), true) ?: [];
            return array_slice($data, 0, $limit);
        }
        return [];
    }
}
