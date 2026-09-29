import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import '../styles/imprint.css';

const Imprint = () => {
  const { t } = useLanguage();

  return (
    <div className="imprint-page">
      {/* Hero Banner */}
      <section className="imprint-hero" style={{ backgroundImage: `url('/assets/images/imprint_hero_bg.jpg')` }}>
        <div className="container">
          <h1 className="imprint-hero-title">
            {t.imprint.heroTitle.split('\n').map((line, idx) => (
              <React.Fragment key={idx}>{line}<br/></React.Fragment>
            ))}
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="imprint-content-section">
        <div className="container">
          {/* Imprint Section */}
          <div className="imprint-block">
            <h2 className="imprint-section-title">{t.imprint.imprintHeading}</h2>
            <p className="imprint-intro-text">{t.imprint.imprintIntro}</p>
            
            <div className="imprint-details-card">
              <p><strong>K-Consulting Sports & MICE</strong></p>
              <p>Marc Knuelle</p>
              <p>Fritz-Pullig-Strasse 9</p>
              <p>53757 Sankt Augustin</p>
              <p>Deutschland</p>
              <br/>
              <p>Telefon: +49 2241 343320</p>
              <p>E-Mail: <a href="mailto:kontakt@marc-knuelle.de">kontakt(@)marc-knuelle.de</a></p>
            </div>

            <h3 className="imprint-sub-title">{t.imprint.techHeading}</h3>
            <div className="imprint-details-card">
              <p><strong>Kontent GmbH</strong></p>
              <p>Winkelhauser Str. 63</p>
              <p>47228 Duisburg</p>
              <p>Deutschland</p>
              <br/>
              <p>Tel.: +49 203 3094 340</p>
              <p>E-Mail: <a href="mailto:info-de@kontent.com">info-de@kontent.com</a></p>
            </div>
          </div>

          {/* Data Protection Section */}
          <div className="imprint-block dp-block">
            <h2 className="imprint-section-title">{t.imprint.dpHeading}</h2>
            <h3 className="imprint-sub-title">{t.imprint.dpIntro}</h3>
            <p className="imprint-text">{t.imprint.dpP1}</p>
            <p className="imprint-text">{t.imprint.dpP2}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Imprint;
