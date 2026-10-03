import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    nav: {
      home: 'Home',
      service: 'Service',
      aboutUs: 'About us',
      hotelsMore: 'Hotels & more',
      contact: 'Contact',
    },
    footer: {
      contactUsTitle: 'Contact us!',
      findUsHere: 'You can also find us here:',
      phone: 'Phone:',
      phoneNumber: '+49 2241 343320',
      fax: 'Fax:',
      faxNumber: '+49 2241 344316',
      email: 'Contact()Sportsandmice.Com',
      addressTitle: 'Address:',
      companyName: 'K-Consulting Sports & MICE',
      street: 'Fritz-Pullig-Strasse 9',
      cityCountry: '53757 Sankt Augustin\nGermany',
      imprintLink: 'Imprint & Data Protection\nRegulation',
      copyright: '© 2021 www.Sportsandmice.Com'
    },
    home: {
      heroTitlePrefix: 'Sports associations &',
      heroTag1: 'Meetings ♢ Incentives',
      heroTag2: 'Conferences ♢ Events',
      heroSubtitle: 'Sport needs professional structures when traveling to competitions, team building and conferences around the world',
      sec2Title: 'Together for success! Travel and meet like the pros!',
      card1Title: 'TEAM TRIPS',
      card1Text: 'The special needs of sports teams are the focus of planning trips to training camps and competitions. High-quality and healthy food and an environment in which the teams can prepare in a focused manner are essential.',
      card2Title: 'MEETINGS',
      card2Text: 'Sporting officials need an environment for meetings and congresses where they can make decisions with foresight and calm. We take care of a smooth process and a relaxed atmosphere.',
      card3Title: 'CONFERENCES',
      card3Text: 'For meetings, conferences, seminars and events, we will find the right venue for you that suits your athletic participants. This also includes an environment with attractive offers and events.',
      card4Title: 'INCENTIVES',
      card4Text: 'Whether the national team or the board of directors of the sports association, we will find a suitable motivating and extraordinary activity for you, which will weld you together even more so that you can celebrate successes together.',
      sec3Title: 'Use our expertise for your sporting success!',
      sec3P1: 'Unlike large companies, sports associations usually do not have their own department specializing in trips to competitions for national teams or sports officials to conferences.',
      sec3P2: 'We take care of the search for the right team hotel for you, organize transport from the airport and to the competition venue, or find the right team building activity.',
      sec3P3: 'Our own experiences in international high-performance sport make us experts!',
      stats: {
        years: '15+',
        yearsLabel: 'Years in High-Performance Sport',
        events: '500+',
        eventsLabel: 'Tailor-Made Sports & MICE Events',
        destinations: '35+',
        destinationsLabel: 'Global Destinations Worldwide',
        satisfaction: '100%',
        satisfactionLabel: 'Personal Consultation & Execution'
      },
      trustBadges: [
        { title: 'Global Network', desc: 'Vetted team hotels & conference venues across 5 continents' },
        { title: 'Athletic Expertise', desc: 'Tailored nutrition, fitness facilities & match proximity' },
        { title: 'Complete Logistics', desc: 'Airport transfers, luggage routing & local support' },
        { title: 'Cost Transparency', desc: 'Clear budgets and negotiated group association rates' }
      ]
    },
    service: {
      heroTitle: 'Service',
      sec1Title: 'With our commitment we support your sporting success!',
      sec1P1: 'Our team ensures the right selection of venues and hotels for your MICE activities. Sports teams and sports officials have special requirements, which guide us in our recommendations for you.',
      sec1P2: 'When selecting hotels, we ensure that they are suitable for sports teams and that they have staff who are familiar with dealing with sports teams. Our targeted advice to the selected hotel ensures high-quality services for you. The facilities need to be right; the fitness center shouldn\'t be the smallest room in the hotel. We also value attractive running routes near the hotel.',
      sec1P3: 'We make sure that you are in a good location and distance from the competition site and can ensure that transport is looked after. We check the conference facilities for meetings, seminars and assemblies that your teams or your sports officials need to meet your needs. It is our strength that we have made a picture for ourselves on site.',
      sec2Title: 'The right answers to your needs',
      card1Title: 'Meetings and Conferences',
      card2Title: 'Team building & Incentives',
      card3Title: 'Team trips and events',
      card4Title: 'International sports congresses',
      ctaTitle: 'Write to us with your request!',
      ctaButton: 'contact form'
    },
    about: {
      heroTitle: 'About us',
      sec1Title: 'Active in high-performance sport',
      sec1P1: 'Our founder, Marc Knuelle, has been an international referee in field hockey since 2000. In addition to three European championships, he has acted as a referee at many international tournaments on five continents. There are also countless trips around the world, during which he has accompanied national teams to their training camps. Participation in major sporting events and congresses rounds off Marc’s deep and broad insight into the world of high-performance sport and the MICE activities of the sports associations.',
      sec1P2: 'As a referee, you learn early on to make decisions again and again and to take responsibility for mistakes. These clear ways of acting characterize our performance for customers. We will make sure that we deliver an experience that matches your expectations.',
      sec1P3: 'After organizing and holding many meetings of the referees at the national level, Marc founded K-Consulting Sports & MICE in 2015, which to this day supports sports associations in holding meetings and trips for national teams.',
      sec2Title: 'World traveler - "Marco Polo" conquers the planet',
      card1Title: 'Havana - Cuba',
      card1Text: 'The Caribbean passion of sport, for meeting with a view of the sea and ideal for motivational trips.',
      card2Title: 'Beijing - China',
      card2Text: 'A country where sport is very important - ideally suited for large sport competitions.',
      card3Title: 'Johannesburg - South Africa',
      card3Text: 'Ideal for sport thanks to its good hotels, good sports event infrastructure and great team building activities.',
      card4Title: 'Rio de Janeiro - Brazil',
      card4Text: 'Vibrant beach sports culture, World Cup venue infrastructure, and coastal conference facilities.'
    },
    hotels: {
      heroTitle: 'Hotels & more',
      sec1Title: 'Hotels sights inspection tours',
      tour1Title: 'Tour - Mexico - Cancún',
      tour1Text: 'The Yucatán peninsula not only inspires with its breathtaking beaches, but also with its excellent hotel infrastructure. Meetings with a view of the sea or events on the beach are easily possible here. Mexico also impresses with a wide range of sports, very special for water sports. It is a perfect location, especially for team building. We were particularly impressed by the Hotel Fairmont Myakoba "Riviera Maya", a great place to meet and relax.',
      tour1LinkText: 'Fairmont Mayakoba "Riviera Maya"',
      tour1LinkUrl: 'https://www.fairmont.com/mayakoba-riviera-maya/',
      tour2Title: 'Tour - UAE - Dubai',
      tour2Text: 'All events can happy here - Dubai is a year-round destination with extensive conference facilities. It offers a high level of security as well as a wide range of sports infrastructure. There are also various options for team building activities. We were particularly impressed by the Sofitel The Palm Dubai hotel, with its great location and a perfect mix of meeting and relaxing.',
      tour2LinkText: 'Sofitel The Palm Dubai',
      tour2LinkUrl: 'https://www.sofitel-dubai-thepalm.com',
      nextTitle: 'Next: Kenya – Mexico – USA – Brazil – Japan'
    },
    contact: {
      heroTitle: 'Contact',
      formHeading: 'contact form',
      formSub: 'Write us your request, we will get in touch with you',
      teamSign: 'Your K-Consulting Team Sports & MICE',
      phone: 'Phone:',
      fax: 'Fax:',
      email: 'E-Mail:',
      fields: {
        surname: 'Surname',
        email: 'e-mail',
        country: 'country',
        city: 'city',
        address: 'address',
        message: 'message',
        send: 'send'
      },
      validation: {
        required: 'Please fill out this field.',
        invalidEmail: 'Please enter a valid email address.',
        sending: 'Sending...',
        success: 'Thank you! Your message has been sent successfully.',
        error: 'Failed to send message. Please try again.'
      }
    },
    imprint: {
      heroTitle: 'Imprint &\ndata protection regulation',
      imprintHeading: 'Imprint',
      imprintIntro: 'Verantwortlich im Sinne des § 5 TMG, V.i.S.d.P. und Verantwortlicher für den Datenschutz:',
      imprintDetails: 'K-Consulting Sports & MICE\nMarc Knuelle\nFritz-Pullig-Strasse 9\n53757 Sankt Augustin\nDeutschland\n\nTelefon: +49 2241 343320\nE-Mail: kontakt(@)marc-knuelle.de',
      techHeading: 'Technischer Betrieb und Design:',
      techDetails: 'Kontent GmbH\nWinkelhauser Str. 63\n47228 Duisburg\nDeutschland\n\nTel.: +49 203 3094 340\nE-Mail: info-de@kontent.com',
      dpHeading: 'Data protection regulation',
      dpIntro: 'Allgemeines zur Datenverarbeitung',
      dpP1: 'Wir erheben und verwenden personenbezogene Daten unserer Nutzer grundsätzlich nur, soweit dies zur Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich ist.',
      dpP2: 'Die Verarbeitung personenbezogener Daten erfolgt regelmäßig nur nach Einwilligung des Nutzers. Eine Ausnahme gilt in solchen Fällen, in denen eine vorherige Einholung einer Einwilligung aus tatsächlichen Gründen nicht möglich ist und die Verarbeitung der Daten durch gesetzliche Vorschriften gestattet ist.'
    }
  },
  de: {
    nav: {
      home: 'Startseite',
      service: 'Dienstleistung',
      aboutUs: 'Über uns',
      hotelsMore: 'Hotels & mehr',
      contact: 'Kontakt',
    },
    footer: {
      contactUsTitle: 'Kontaktieren Sie uns!',
      findUsHere: 'Hier finden Sie uns auch:',
      phone: 'Telefon:',
      phoneNumber: '+49 2241 343320',
      fax: 'Fax:',
      faxNumber: '+49 2241 344316',
      email: 'Contact()Sportsandmice.Com',
      addressTitle: 'Adresse:',
      companyName: 'K-Consulting Sports & MICE',
      street: 'Fritz-Pullig-Strasse 9',
      cityCountry: '53757 Sankt Augustin\nDeutschland',
      imprintLink: 'Impressum & Datenschutz-\nGrundverordnung',
      copyright: '© 2021 www.Sportsandmice.Com'
    },
    home: {
      heroTitlePrefix: 'Sportverbände &',
      heroTag1: 'Meetings ♢ Incentives',
      heroTag2: 'Konferenzen ♢ Events',
      heroSubtitle: 'Sport benötigt professionelle Strukturen bei Reisen zu Wettkämpfen, Teambuilding und Konferenzen weltweit',
      sec2Title: 'Gemeinsam zum Erfolg! Reisen und tagen wie die Profis!',
      card1Title: 'TEAMREISEN',
      card1Text: 'Die besonderen Bedürfnisse von Sportteams stehen im Mittelpunkt der Planung von Reisen zu Trainingslagern und Wettkämpfen.',
      card2Title: 'MEETINGS',
      card2Text: 'Sportfunktionäre benötigen für Sitzungen und Tagungen ein Umfeld, in dem sie mit Weitsicht und Ruhe Entscheidungen treffen können.',
      card3Title: 'KONFERENZEN',
      card3Text: 'Für Tagungen, Konferenzen, Seminare und Events finden wir für Sie die passende Location.',
      card4Title: 'INCENTIVES',
      card4Text: 'Ob Nationalmannschaft oder Vorstand des Sportverbandes, wir finden eine passende motivierende Aktivität für Sie.',
      sec3Title: 'Nutzen Sie unsere Expertise für Ihren sportlichen Erfolg!',
      sec3P1: 'Anders als Großunternehmen haben Sportverbände meist keine eigene Abteilung für Wettkampfreisen oder Konferenzen.',
      sec3P2: 'Wir übernehmen für Sie die Suche nach dem passenden Teamhotel, organisieren den Transfer und Teambuilding-Aktivitäten.',
      sec3P3: 'Eigene Erfahrungen im internationalen Spitzensport machen uns zu Experten!',
      stats: {
        years: '15+',
        yearsLabel: 'Jahre Erfahrung im Spitzensport',
        events: '500+',
        eventsLabel: 'Maßgeschneiderte Sports & MICE Events',
        destinations: '35+',
        destinationsLabel: 'Destinationen weltweit',
        satisfaction: '100%',
        satisfactionLabel: 'Persönliche Beratung & Betreuung'
      },
      trustBadges: [
        { title: 'Globales Netzwerk', desc: 'Geprüfte Teamhotels & Tagungsorte auf 5 Kontinenten' },
        { title: 'Sportliche Expertise', desc: 'Gesunde Ernährung, Fitnessräume & kurze Wege zum Spiel' },
        { title: 'Komplette Logistik', desc: 'Flughafentransfer, Gepäckorganisation & Vor-Ort-Betreuung' },
        { title: 'Kostentransparenz', desc: 'Klare Budgets und günstige Verbandskonditionen' }
      ]
    },
    service: {
      heroTitle: 'Dienstleistung',
      sec1Title: 'Mit unserem Engagement unterstützen wir Ihren sportlichen Erfolg!',
      sec1P1: 'Unser Team sorgt für die richtige Auswahl von Venues und Hotels für Ihre MICE-Aktivitäten.',
      sec1P2: 'Bei der Auswahl der Hotels achten wir darauf, dass diese für Sportmannschaften geeignet sind.',
      sec1P3: 'Wir sorgen dafür, dass Sie sich in guter Lage zur Wettkampfstätte befinden.',
      sec2Title: 'Die passenden Antworten auf Ihre Bedürfnisse',
      card1Title: 'Meetings und Konferenzen',
      card2Title: 'Teambuilding & Incentives',
      card3Title: 'Teamreisen und Events',
      card4Title: 'Internationale Sportkongresse',
      ctaTitle: 'Schreiben Sie uns Ihr Anliegen!',
      ctaButton: 'Kontaktformular'
    },
    about: {
      heroTitle: 'Über uns',
      sec1Title: 'Aktiv im Spitzensport',
      sec1P1: 'Unser Gründer Marc Knuelle ist seit 2000 internationaler Schiedsrichter im Feldhockey. Neben drei Europameisterschaften leitete er Spiele auf fünf Kontinenten.',
      sec1P2: 'Als Schiedsrichter lernt man früh, immer wieder Entscheidungen zu treffen und Verantwortung zu übernehmen.',
      sec1P3: '2015 gründete Marc die K-Consulting Sports & MICE.',
      sec2Title: 'Weltreisender - "Marco Polo" erobert den Planeten',
      card1Title: 'Havanna - Kuba',
      card1Text: 'Die karibische Leidenschaft des Sports, für Meetings mit Meerblick.',
      card2Title: 'Peking - China',
      card2Text: 'Ein Land, in dem Sport einen hohen Stellenwert hat.',
      card3Title: 'Johannesburg - Südafrika',
      card3Text: 'Ideal für Sport dank guter Hotels und Teambuilding-Aktivitäten.',
      card4Title: 'Rio de Janeiro - Brasilien',
      card4Text: 'Lebendige Strandsportkultur, WM-Stadioninfrastruktur und erstklassige Tagungsmöglichkeiten an der Küste.'
    },
    hotels: {
      heroTitle: 'Hotels & mehr',
      sec1Title: 'Hotels & Besichtigungstouren',
      tour1Title: 'Tour - Mexiko - Cancún',
      tour1Text: 'Die Halbinsel Yucatán begeistert mit atemberaubenden Stränden und exzellenter Hotelinfrastruktur.',
      tour1LinkText: 'Fairmont Mayakoba "Riviera Maya"',
      tour1LinkUrl: 'https://www.fairmont.com/mayakoba-riviera-maya/',
      tour2Title: 'Tour - VAE - Dubai',
      tour2Text: 'Dubai ist eine ganzjährige Destination mit umfangreichen Konferenzeinrichtungen.',
      tour2LinkText: 'Sofitel The Palm Dubai',
      tour2LinkUrl: 'https://www.sofitel-dubai-thepalm.com',
      nextTitle: 'Next: Kenia – Mexiko – USA – Brasilien – Japan'
    },
    contact: {
      heroTitle: 'Kontakt',
      formHeading: 'Kontaktformular',
      formSub: 'Schreiben Sie uns Ihr Anliegen, wir melden uns bei Ihnen',
      teamSign: 'Ihr K-Consulting Team Sports & MICE',
      phone: 'Telefon:',
      fax: 'Fax:',
      email: 'E-Mail:',
      fields: {
        surname: 'Name',
        email: 'E-Mail',
        country: 'Land',
        city: 'Stadt',
        address: 'Adresse',
        message: 'Nachricht',
        send: 'Senden'
      },
      validation: {
        required: 'Bitte füllen Sie dieses Feld aus.',
        invalidEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
        sending: 'Wird gesendet...',
        success: 'Vielen Dank! Ihre Nachricht wurde erfolgreich übermittelt.',
        error: 'Fehler beim Senden. Bitte versuchen Sie es erneut.'
      }
    },
    imprint: {
      heroTitle: 'Impressum &\nDatenschutz-Grundverordnung',
      imprintHeading: 'Impressum',
      imprintIntro: 'Verantwortlich im Sinne des § 5 TMG, V.i.S.d.P. und Verantwortlicher für den Datenschutz:',
      imprintDetails: 'K-Consulting Sports & MICE\nMarc Knuelle\nFritz-Pullig-Strasse 9\n53757 Sankt Augustin\nDeutschland\n\nTelefon: +49 2241 343320\nE-Mail: kontakt(@)marc-knuelle.de',
      techHeading: 'Technischer Betrieb und Design:',
      techDetails: 'Kontent GmbH\nWinkelhauser Str. 63\n47228 Duisburg\nDeutschland\n\nTel.: +49 203 3094 340\nE-Mail: info-de@kontent.com',
      dpHeading: 'Datenschutz-Grundverordnung',
      dpIntro: 'Allgemeines zur Datenverarbeitung',
      dpP1: 'Wir erheben und verwenden personenbezogene Daten unserer Nutzer grundsätzlich nur, soweit dies zur Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich ist.',
      dpP2: 'Die Verarbeitung personenbezogener Daten erfolgt regelmäßig nur nach Einwilligung des Nutzers.'
    }
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  const t = translations[lang] || translations.en;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
